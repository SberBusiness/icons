import path from 'path';
import {getTypesSrc, getThemeProviderSrc, getUtilsSrc, getUseUniqueIdSrc} from './utils';
import {generationPath} from '../../consts';
import {IIconTransformedData, ITransformer} from '../types';
import {createFolderIfNotExists, writeFile} from '../../utils/fsUtils';

/**
 * Генератор получает в себя инстанс трансформера, от которого в дальнейшем получает
 * готовые к генерации коллекцию иконок и стили. Генератору остается только сохранить
 * данные в соответствующие файлы и проконтролировать ошибки.
 */
export class ReactGenerator {
    constructor(private readonly transformer: ITransformer) {}

    generate = async () => {
        await this.transformer.transform();
        await this.generateUtilities();
        await this.generateComponents(this.transformer.getIconsData());
        await this.generateStyles(this.transformer.getStyles());
        await this.generateTypes();
        await this.generateThemeProvider();
        await this.generateIndexFile(this.transformer.getIconsData());
    };

    private generateUtilities = async (): Promise<void> => {
        try {
            createFolderIfNotExists(generationPath);
            const folderPath = path.resolve(generationPath, 'utils');
            createFolderIfNotExists(folderPath);
            await Promise.all([
                writeFile(
                    path.resolve(folderPath, 'getPathClassName.ts'),
                    getUtilsSrc(this.transformer.getPaletteClasses())
                ),
                writeFile(path.resolve(folderPath, 'useUniqueId.ts'), getUseUniqueIdSrc()),
            ]);
            console.log('Успешно сформирован файл утилит');
        } catch (e) {
            console.error('Произошла ошибка при формировании файла утилит.', e.message);
            process.exit(1);
        }
    };

    /**
     * Генерирует компоненты в папке назначения из подготовленных трансформером данных иконок.
     *
     * @param iconsData
     */
    private generateComponents = async (iconsData: IIconTransformedData[]): Promise<void> => {
        try {
            const promises = await Promise.all(
                iconsData.map(async (iconData) => {
                    const filePath = path.resolve(generationPath, iconData.tokenized.componentName + '.tsx');
                    return writeFile(filePath, iconData.src);
                })
            );
            console.log(`Успешно сформировано ${promises.length} компонентов`);
        } catch (e) {
            console.error('Произошла ошибка при генерации компонентов.', e.message);
            process.exit(1);
        }
    };

    /**
     * Генерирует стили в папке назначения из подготовленных трансформером стилей.
     *
     * @param styles Строка с CSS стилями.
     */
    private generateStyles = async (styles: string): Promise<void> => {
        try {
            const folderPath = path.resolve(generationPath, 'styles');
            createFolderIfNotExists(folderPath);
            const filePath = path.resolve(folderPath, 'icons.css');
            await writeFile(filePath, styles);
            console.log('Успешно сформирован файл стилей');
        } catch (e) {
            console.error('Произошла ошибка при формировании файла стилей.', e.message);
            process.exit(1);
        }
    };

    /**
     * Генерирует файл типов.
     */
    private generateTypes = async (): Promise<void> => {
        try {
            const filePath = path.resolve(generationPath, 'types.d.ts');
            await writeFile(filePath, getTypesSrc());
            console.log('Успешно сформирован файл типов.');
        } catch (e) {
            console.error('Произошла ошибка при формировании файл типов.', e.message);
            process.exit(1);
        }
    };

    /**
     * Генерирует контекст и ThemeProvider.
     */
    private generateThemeProvider = async (): Promise<void> => {
        try {
            const filePath = path.resolve(generationPath, 'ThemeProvider.tsx');
            await writeFile(filePath, getThemeProviderSrc());
            console.log('Успешно сформирован файл ThemeProvider');
        } catch (e) {
            console.error('Произошла ошибка при формировании файла провайдера.', e.message);
            process.exit(1);
        }
    };

    /**
     * Генерирует index.ts
     */
    private generateIndexFile = async (iconsData: IIconTransformedData[]): Promise<void> => {
        try {
            const filePath = path.resolve(generationPath, 'index.ts');
            const lines = [
                'export { ISingleColorIconProps, IMultiColorIconProps } from "./types";',
                'export { ThemeProvider, useTheme, EIconsTheme } from "./ThemeProvider";',
                ...iconsData.map(
                    ({tokenized: {componentName}}) =>
                        `export { default as ${componentName} } from "./${componentName}";`
                ),
            ];

            await writeFile(filePath, `${lines.join('\n')}\n`);
            console.log('Успешно сформирован index.ts');
        } catch (e) {
            console.error('Произошла ошибка при формировании index.ts.', e.message);
            process.exit(1);
        }
    };
}
