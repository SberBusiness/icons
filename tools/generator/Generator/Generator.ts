import path from 'path';
import {modelSrc} from './consts';
import {generationPath} from '../../consts';
import {IIconTransformedData, ITransformer} from '../types';
import {createFolderIfNotExists, writeFile} from '../../utils/fsUtils';

/**
 * Генератор получает в себя инстанс трансформера, от которого в дальнейшем получает
 * готовые к генерации коллекцию иконок и стили. Генератору остается только сохранить
 * данные в соответствующие файлы и проконтроллировать ошибки.
 */
export class Generator {
    constructor(private readonly transformer: ITransformer) {}

    generate = async () => {
        await this.transformer.transform();
        await this.generateComponents(this.transformer.getIconsData());
        await this.generateStyles(this.transformer.getStyles());
        await this.generateModel();
    };

    /**
     * Генерирует компоненты в папке назначения из подготовленных трансформером данных иконок.
     *
     * @param iconsData
     */
    private generateComponents = async (iconsData: IIconTransformedData[]): Promise<void> => {
        try {
            createFolderIfNotExists(generationPath);
            const promises = await Promise.all(
                iconsData.map(async iconData => {
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
            const cssFolder = path.resolve(generationPath, 'css');
            const filePath = path.resolve(cssFolder, 'icons.css');
            createFolderIfNotExists(generationPath);
            createFolderIfNotExists(cssFolder);
            await writeFile(filePath, styles);
            console.log('Успешно сформирован файл стилей');
        } catch (e) {
            console.error('Произошла ошибка при формировании файла стилей.', e.message);
            process.exit(1);
        }
    };

    /**
     * Генерирует файл модели.
     */
    private generateModel = async (): Promise<void> => {
        try {
            const filePath = path.resolve(generationPath, 'models.d.ts');
            await writeFile(filePath, modelSrc);
            console.log('Успешно сформирован файл моделей');
        } catch (e) {
            console.error('Произошла ошибка при формировании файла модели.', e.message);
            process.exit(1);
        }
    };
}
