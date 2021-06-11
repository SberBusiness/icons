import path from 'path';
import {readFileSync, writeFileSync} from 'fs';
import {IFigmaComponent, IFigmaService, IIconData} from '../types';
import {lastSuccessfulFetchPath, modulesPaths, srcPaths} from '../../consts';
import {EIconCategory} from '../../enums';
import {Tokenizer} from '../../utils/Tokenizer/Tokenizer';
import {createFolderIfNotExists, isPathExists, readFile, writeFile} from '../../utils/fsUtils';

export class FigmaFetcher {
    private readonly tokenizer = new Tokenizer();
    private readonly lastDate;
    private nextLastDate;
    private isMinorChange = false;
    private isPatchChange = false;

    constructor(private readonly figmaService: IFigmaService) {
        this.nextLastDate = this.lastDate = this.getLastSuccessfulFetchDate();
    }

    fetch = async () => {
        try {
            const isUpdated = await this.isFigmaFileUpdated();
            if (!isUpdated) {
                return console.log('Версия figma файла не изменялась с даты последней синхронизации.');
            }
            const figmaComponents = await this.getFigmaComponents();
            if (!figmaComponents.length) {
                return console.log('С даты последней синхронизации иконки не изменялись.');
            }
            const iconsData = await this.getIconsData(figmaComponents);
            await this.saveIcons(iconsData);
            this.setLastSuccessfulFetchDate(this.nextLastDate);
            this.updatePackage();
        } catch (e) {
            throw new Error(`Во время фетчинга иконок произошел сбой. ${e.message}`);
        }
    };

    /**
     * Проверяет, обновился ли файл figma.
     */
    private isFigmaFileUpdated = async (): Promise<boolean> => {
        const figmaFileUpdateDate = await this.figmaService.getFigmaFileUpdateDate();
        const updateDate = new Date(figmaFileUpdateDate);
        const isNewDateBigger = updateDate > this.lastDate;
        this.nextLastDate = isNewDateBigger ? updateDate : this.nextLastDate;
        return isNewDateBigger;
    };

    /**
     * Получает компоненты из figma файла.
     */
    private getFigmaComponents = async (): Promise<IFigmaComponent[]> =>
        (await this.figmaService.getFigmaComponents())
            .map(component => ({
                ...component,
                name: component.name.split('/').pop()
            }))
            // TODO пока что отбираю только валидные, но это неправильно
            .filter(({name}) => this.tokenizer.isValid(name))
            .filter(({updated_at}) => new Date(updated_at) > this.lastDate);

    /**
     * Запрашивает иконки компонентов и формирует массив данных иконок.
     *
     * @param figmaComponents
     */
    private getIconsData = async (figmaComponents: IFigmaComponent[]): Promise<IIconData[]> => {
        const chunks = this.splitIntoGroups(figmaComponents);
        const chunksPromises = chunks.map(async (chunk) => {
            const ids = chunk.map(component => component.node_id).join(',');
            const figmaImagesUrlsMap = await this.figmaService.getFigmaImagesUrls(ids);
            const chunkPromises = chunk.map(async ({name, node_id}) => {
                const url = figmaImagesUrlsMap[node_id];
                const src = await this.figmaService.getIconSrc(url);
                return {
                    category: this.tokenizer.tokenize(name).category,
                    fileName: `${name}.svg`,
                    src
                }
            });
            return Promise.all(chunkPromises);
        });
        const chunksRes = await Promise.all(chunksPromises);

        return chunksRes.reduce((acc, chunkRes) => [...acc, ...chunkRes], []);
    };

    /**
     * Сохраняет полученные иконки.
     *
     * @param iconsData
     */
    private saveIcons = async (iconsData: IIconData[]): Promise<void> => {
        const iconsDataPromises = iconsData.map(async ({src, category, fileName}) => {
            const categoryPath = path.resolve(srcPaths.icons, EIconCategory[category]);
            createFolderIfNotExists(categoryPath);
            const filePath = path.resolve(categoryPath, fileName);
            if (isPathExists(filePath)) {
                const currentSrc = await readFile(filePath);
                if (currentSrc !== src) {
                    this.isPatchChange = true;
                    await writeFile(filePath, src);
                    return 'patched';
                } else {
                    return 'not_changed';
                }
            } else {
                this.isMinorChange = true;
                await writeFile(filePath, src);
                return 'added';
            }
        });

        const statuses = await Promise.all(iconsDataPromises);

        const added = statuses.filter(status => status === 'added')?.length;
        const patched = statuses.filter(status => status === 'patched')?.length;
        const notChanged = statuses.filter(status => status === 'not_changed')?.length;

        added && console.log(`Добавлено ${added} иконок.`);
        patched && console.log(`Изменено ${patched} иконок.`);
        notChanged && console.log(`Без изменений остались ${notChanged} иконок.`);
    };

    /**
     * Обновляет версию package.json в зависимости от изменений иконок.
     */
    private updatePackage = () => {
        if (this.isMinorChange || this.isPatchChange) {
            const iconsPackagePath = path.resolve(modulesPaths.icons, 'package.json');
            let json = readFileSync(iconsPackagePath, 'utf-8');
            const iconsPackage = JSON.parse(json);
            let version = iconsPackage.version;
            if (/alpha|beta/.test(version)) {
                version = version.replace(/\d+$/, ver => `${++ver}`);
            } else {
                version = version.replace(/(\d+)\.(\d+)$/, (m, minor, patch) => {
                    if (this.isMinorChange) {
                        minor++;
                        patch = 0;
                    } else if (this.isPatchChange) {
                        patch++;
                    }
                    return `${minor}.${patch}`;
                });
            }
            iconsPackage.version = version;
            json = JSON.stringify(iconsPackage, null, 4);
            writeFileSync(iconsPackagePath, json);
        }
    };

    /**
     * Разбивает массив на массивы определенной длины.
     *
     * @param data Входной массив.
     */
    private splitIntoGroups = <T>(data: T[]): T[][] => {
        // В url get запроса вмещается 2048 символов.
        // При условии, что node_id иконки занимает не более 15 символов (максимальное значение из выборки - 11),
        // плюс символ запятой - 16 символов, получается около 120 node_id в одном запросе.
        const groupLen = 120;
        let result = [];
        for (let i = 0; i < data.length; i += groupLen) result.push(data.slice(i, i + groupLen));
        return result;
    };

    /**
     * Получает дату последней синхронизации.
     */
    private getLastSuccessfulFetchDate = (): Date => {
        const json = isPathExists(lastSuccessfulFetchPath) && readFileSync(lastSuccessfulFetchPath, 'utf-8');
        const date = JSON.parse(json)?.date;
        return date ? new Date(date) : new Date();
    };

    /**
     * Сохраняет дату последней синхронизации.
     */
    private setLastSuccessfulFetchDate = (date: Date): void => {
        const json = JSON.stringify({date: date.toISOString()});
        writeFileSync(lastSuccessfulFetchPath, json);
    };
}
