import path from 'path';
import {IIconsRawDataMap} from './types';
import {IIconRawData, IParser} from '../types';
import {normalizeColor} from '../utils/normalizeColors';
import {matchAll} from '../utils/regexUtils';
import {EIconState} from '../../enums';
import {getSvgDirectoryListing, readFile} from '../../utils/fsUtils';
import {Tokenizer} from '../../utils/Tokenizer/Tokenizer';

const INVALID_SIZE_NAMES_WHITELIST = {
    // Deprecated
    "ic_prd_gigaassistaint_default_32_dm_w": undefined,
    "ic_prd_gigaassistaint_default_32_lm_w": undefined,
    "ic_srv_repeatpayment_active_20_dm_w": undefined,
    "ic_srv_repeatpayment_active_20_lm_w": undefined,
    "ic_srv_repeatpayment_default_20_dm_w": undefined,
    "ic_srv_repeatpayment_default_20_lm_w": undefined,
    "ic_srv_repeatpayment_disabled_20_dm_w": undefined,
    "ic_srv_repeatpayment_disabled_20_lm_w": undefined,
    "ic_srv_repeatpayment_hover_20_dm_w": undefined,
    "ic_srv_repeatpayment_hover_20_lm_w": undefined,
};

/**
 * Парсер получает в себя путь до директории, которую следует распарсить.
 * Проверяет содержимое директории, правильность написания имён иконок,
 * количестов их состояний и путей (svg path) в них.
 * Далее парсер формирует коллекцию сырых данных иконок для дальнейшей обработки трансформером.
 */
export class Parser implements IParser {
    private readonly tokenizer = new Tokenizer();

    constructor(private readonly folders) {}

    /**
     * Собирает сырые данные иконок.
     */
    getIconsRawData = async (): Promise<IIconRawData[]> => {
        try {
            await this.validateIconsSources();

            let iconsRawData: IIconRawData[] = [];

            for (const folder of this.folders) {
                const iconsRawDataInFolder = await this.getIconsRawDataInFolder(folder);
                iconsRawData = iconsRawData.concat(iconsRawDataInFolder);
            }

            this.checkDefaultState(iconsRawData);
            this.checkColorCount(iconsRawData);

            return iconsRawData;
        } catch (e) {
            throw new Error(`Во время парсинга иконок произошел сбой. ${e.message}`);
        }
    };

    /**
     * Проверяет svg иконки на правильность написания имён и выводит список
     * некорректных названий при наличии.
     */
    private validateIconsSources = async (): Promise<void> => {
        const folders: string[][] = await Promise.all(this.folders.map(getSvgDirectoryListing));

        const invalidIconsNames = folders
            .reduce((iconsPaths, folderPaths) => [...iconsPaths, ...folderPaths])
            .map((iconFileName) => path.basename(iconFileName, '.svg'))
            .filter((iconName) => !this.tokenizer.isValid(iconName));

        if (invalidIconsNames.length) {
            throw new Error(`Не удалось токенизировать имена файлов:\n${invalidIconsNames.join('\n')}`);
        }
    };

    /**
     * Собирает сырые данные иконок в папке категории.
     *
     * @param folder
     */
    private getIconsRawDataInFolder = async (folder: string): Promise<IIconRawData[]> => {
        const iconsFileNames = await getSvgDirectoryListing(folder);
        const iconsRawDataMap: IIconsRawDataMap = {};

        for (const iconFileName of iconsFileNames) {
            const iconSrc = await readFile(path.resolve(folder, iconFileName));
            const iconName = path.basename(iconFileName, '.svg');
            const tokenizedIconName = this.tokenizer.tokenize(iconName);
            const {componentName, state, size, theme} = tokenizedIconName;

            this.validateIconSize(iconSrc, iconName, size);

            const icon = (iconsRawDataMap[componentName] = iconsRawDataMap[componentName] || {themes: {}});

            if (!icon.themes[theme]) {
                icon.themes[theme] = {states: {}};
            }

            if (icon.themes[theme].states[state]) {
                throw new Error(`Дублирующееся состояние ${state} у иконки ${iconName}.`);
            }

            icon.themes[theme].states[state] = this.getColors(iconSrc);

            if (!icon.themes[theme].src || state === EIconState.default) {
                icon.themes[theme].src = iconSrc;
                icon.tokenized = tokenizedIconName;
            }
        }

        return Object.values(iconsRawDataMap) as IIconRawData[];
    };

    /**
     * Возвращает массив нормализованных цветов иконки.
     *
     * @param iconSrc исходный svg иконки.
     */
    private getColors = (iconSrc: string): string[] =>
        matchAll(iconSrc, /fill="(?!none)([#0-9A-z]+)"/g).map((m) => normalizeColor(m[1]));

    /**
     * Валидация размера иконки.
     *
     * @param iconSrc Исходный svg иконки.
     * @param iconName Имя иконки.
     * @param size Заявленный размер иконки.
     */
    private validateIconSize = (iconSrc: string, iconName: string, size: string): void => {
        const results = /width="(\d+)" height="(\d+)"/.exec(iconSrc);

        if (results === null) {
            throw new Error(`Не удалось распарсить размер иконки ${iconName}.`);
        } else if (iconName in INVALID_SIZE_NAMES_WHITELIST) {
            return;
        }

        const [_, width, height] = results;

        if (size !== width || size !== height) {
            throw new Error(`Размер иконки ${iconName} (${width}x${height}) отличается от заявленного (${size}x${size}).`);
        }
    };

    /**
     * Проверяет, что у каждой иконки есть default состояние, т.к.
     * не у каждой иконки могут быть другие состояния, но состояние default должно быть всегда.
     *
     * @param iconsData
     */
    private checkDefaultState = (iconsData: IIconRawData[]): void => {
        const iconsWithoutDefault = iconsData
            .filter((iconData) => !Object.values(iconData.themes).every((theme) => EIconState.default in theme.states))
            .map((iconData) => iconData.tokenized.srcName);

        if (iconsWithoutDefault.length) {
            throw new Error(`У некоторых иконок нет дефолтного состояния.\n${iconsWithoutDefault.join('\n')}`);
        }
    };

    /**
     * Проверяет количество цветов у всех состояний и, следовательно, svg path у исходных иконок.
     * Если оно не совпадает, значит у каких-то иконок неконсистентное содержимое.
     *
     * @param iconsData
     */
    private checkColorCount = (iconsData: IIconRawData[]): void => {
        const iconsWithDifferentColorCount = iconsData
            .filter(
                ({themes}) =>
                    !Object.values(themes).every(({states}) =>
                        Object.values(states).every((colors) => colors.length === states[EIconState.default].length)
                    )
            )
            .map((iconData) => iconData.tokenized.srcName);

        if (iconsWithDifferentColorCount.length) {
            throw new Error(`У некоторых иконок не хватает путей.\n${iconsWithDifferentColorCount.join('\n')}`);
        }
    };
}
