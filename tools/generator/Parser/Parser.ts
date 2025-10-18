import path from 'path';
import {IIconsRawDataMap} from './types';
import {IIconRawData, IParser} from '../types';
import {normalizeFillColor, normalizeFillOpacity} from '../utils/normalize';
import {matchAll} from '../utils/regexUtils';
import {EIconState, EIconTheme} from '../../enums';
import {getSvgDirectoryListing, readFile} from '../../utils/fsUtils';
import {Tokenizer} from '../../utils/Tokenizer/Tokenizer';
import ICON_FILL_PALETTES from './palettes';

/**
 * Парсер получает в себя путь до директории, которую следует распарсить.
 * Проверяет содержимое директории, правильность написания имён иконок,
 * количестов их состояний и путей (svg path) в них.
 * Далее парсер формирует коллекцию сырых данных иконок для дальнейшей обработки трансформером.
 */
export class Parser implements IParser {
    private readonly tokenizer = new Tokenizer();
    private errors: string[] = [];

    constructor(private readonly folders: string[]) {}

    /** Собирает сырые данные иконок. */
    getIconsRawData = async (): Promise<IIconRawData[]> => {
        try {
            let iconsRawData: IIconRawData[] = [];

            for (const folder of this.folders) {
                const iconsRawDataInFolder = await this.getIconsRawDataInFolder(folder);
                iconsRawData = iconsRawData.concat(iconsRawDataInFolder);
            }

            this.checkDefaultState(iconsRawData);
            this.checkColorCount(iconsRawData);

            if (this.errors.length > 0) {
                throw new Error(this.errors.join('\n'));
            }

            return iconsRawData;
        } catch (error) {
            throw new Error(`Во время парсинга иконок произошел сбой. ${error.message}`);
        }
    };

    /** Собирает сырые данные иконок в папке категории. */
    private getIconsRawDataInFolder = async (folder: string): Promise<IIconRawData[]> => {
        const iconsFileNames = await getSvgDirectoryListing(folder);
        const iconsRawDataMap: IIconsRawDataMap = {};

        for (const iconFileName of iconsFileNames) {
            const iconName = path.basename(iconFileName, '.svg');
            const tokenizedIconName = this.tokenizer.tokenizeIconName(iconName);

            if (tokenizedIconName === null) {
                this.errors.push(`Не удалось распарсить имя файла: ${iconName}.`);
                continue;
            }

            const iconSrc = await readFile(path.resolve(folder, iconFileName));

            if (this.isIconSizeValid(iconName, iconSrc, Number(tokenizedIconName.size)) === false) {
                continue;
            }

            const tokenizedIcon = this.tokenizer.tokenizeIcon(iconName, tokenizedIconName);
            const {type, /* state, */ theme, componentName} = tokenizedIcon;

            const icon = (iconsRawDataMap[componentName] = iconsRawDataMap[componentName] || {themes: {}});

            if (type === 'sc') {
                ICON_FILL_PALETTES.map((palette) => {
                    for (const theme in palette) {
                        icon.themes[theme] = {states: {}};
                        for (const state in palette[theme]) {
                            icon.themes[theme].states[state] = this.getFillProps(iconSrc).map(
                                () => palette[theme][state]
                            );

                            if (state === EIconState.default) {
                                icon.themes[theme].src = iconSrc;
                                icon.tokenized = tokenizedIcon;
                            }
                        }
                    }
                });
            } else if (type === 'mc') {
                if (theme) {
                    const themeIdx = EIconTheme[theme];
                    icon.themes[themeIdx] = {states: {[EIconState.default]: this.getFillProps(iconSrc)}};
                    icon.themes[themeIdx].src = iconSrc;
                } else {
                    ['lm', 'dm'].map((theme) => {
                        icon.themes[theme] = {states: {[EIconState.default]: this.getFillProps(iconSrc)}};
                        icon.themes[theme].src = iconSrc;
                    });
                }
                icon.tokenized = tokenizedIcon;
            } /* else {
                const themeIdx = EIconTheme[theme];

                if (!icon.themes[themeIdx]) {
                    icon.themes[themeIdx] = {states: {}};
                }

                icon.themes[themeIdx].states[state] = this.getFillProps(iconSrc);

                if (!icon.themes[themeIdx].src || state === EIconState.default) {
                    icon.themes[themeIdx].src = iconSrc;
                    icon.tokenized = tokenizedIcon;
                }
            } */
        }

        return Object.values(iconsRawDataMap) as IIconRawData[];
    };

    /**
     * Возвращает массив нормализованных свойств заливки.
     *
     * @param iconSrc исходный svg иконки.
     */
    private getFillProps = (iconSrc: string): {color: string; opacity?: string}[] =>
        matchAll(iconSrc, /fill="(?!none)(#[0-9A-F]+)" fill-opacity="([01]\.[0-9]+)"/g).map((match) => ({
            color: normalizeFillColor(match[1]),
            opacity: normalizeFillOpacity(match[2]),
        }));

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
            this.errors.push(`У некоторых иконок нет дефолтного состояния.\n${iconsWithoutDefault.join('\n')}`);
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
                        Object.values(states).every((styles) => styles.length === states[EIconState.default].length)
                    )
            )
            .map((iconData) => iconData.tokenized.srcName);

        if (iconsWithDifferentColorCount.length) {
            this.errors.push(`У некоторых иконок не хватает путей.\n${iconsWithDifferentColorCount.join('\n')}`);
        }
    };

    /**
     * Валидация размера иконки.
     *
     * @param iconSrc Исходный svg иконки.
     * @param iconName Имя иконки.
     * @param size Заявленный размер иконки.
     */
    private isIconSizeValid = (iconName: string, iconSrc: string, size: number): boolean => {
        const result = /width="(\d+\.\d+)" height="(\d+\.\d+)"/.exec(iconSrc);

        if (result === null) {
            this.errors.push(`Не удалось распарсить размер иконки ${iconName}.`);
            return false;
        }

        const [_, widthProp, heightProp] = result;

        const width = Number(widthProp);
        const height = Number(heightProp);

        if (size !== width || size !== height) {
            this.errors.push(`Размер иконки ${iconName} (${width}x${height}) отличается от заявленного (${size}x${size}).`)
            return false;
        }

        return true;
    };
}
