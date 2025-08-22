import path from 'path';
import {getTypesSrc, getThemeProviderSrc} from './utils';
import {generationPath} from '../../consts';
import {IIconTransformedData, ITransformer} from '../types';
import {createFolderIfNotExists, writeFile} from '../../utils/fsUtils';

/**
 * Генератор получает в себя инстанс трансформера, от которого в дальнейшем получает
 * готовые к генерации коллекцию иконок и стили. Генератору остается только сохранить
 * данные в соответствующие файлы и проконтроллировать ошибки.
 */
export class ReactGenerator {
    constructor(protected readonly transformer: ITransformer) {}

    generate = async () => {
        await this.transformer.transform();
        await this.generateComponents(this.transformer.getIconsData());
        await this.generateStyles(this.transformer.getStyles());
        await this.generateTypes();
        await this.generateThemeProvider();
        await this.generateIndexFile(this.transformer.getIconsData());
    };

    /**
     * Генерирует компоненты в папке назначения из подготовленных трансформером данных иконок.
     *
     * @param iconsData
     */
    protected generateComponents = async (iconsData: IIconTransformedData[]): Promise<void> => {
        try {
            createFolderIfNotExists(generationPath);
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
    protected generateStyles = async (styles: string): Promise<void> => {
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
            console.log('Успешно сформирован файл моделей');
        } catch (e) {
            console.error('Произошла ошибка при формировании файла модели.', e.message);
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
            let src = "export { IIconProps } from \"./types\";";

            src += "\nexport { ThemeProvider, useTheme, EIconsTheme } from \"./ThemeProvider\";";

            iconsData.map((iconData) => {
                const {componentName} = iconData.tokenized;
                src += `\nexport { default as ${componentName} } from "./${componentName}";`;
            })

            await writeFile(filePath, src);
            console.log('Успешно сформирован index.ts');
        } catch (e) {
            console.error('Произошла ошибка при формировании index.ts.', e.message);
            process.exit(1);
        }
    };
}
