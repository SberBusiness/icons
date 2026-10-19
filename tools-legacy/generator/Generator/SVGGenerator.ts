import path from 'path';
import {ReactGenerator} from './ReactGenerator';
import {generationPath} from '../../consts';
import {IIconTransformedData} from '../types';
import {createFolderIfNotExists, writeFile} from '../../utils/fsUtils';

/**
 * Генератор получает в себя инстанс трансформера, от которого в дальнейшем получает
 * готовые к генерации коллекцию иконок и стили. Генератору остается только сохранить
 * данные в соответствующие файлы и проконтроллировать ошибки.
 */
export class SVGGenerator extends ReactGenerator {
    generateIcons = async () => {
        await this.transformer.transform();
        await this.generateSVG(this.transformer.getIconsData());
        await this.generateStyles(this.transformer.getStyles());
    };

    /**
     * Генерирует svg иконки в папке назначения из подготовленных трансформером данных иконок.
     *
     * @param iconsData
     */
    protected generateSVG = async (iconsData: IIconTransformedData[]): Promise<void> => {
        try {
            createFolderIfNotExists(generationPath);
            const promises = await Promise.all(
                iconsData.map(async (iconData) => {
                    const filePath = path.resolve(generationPath, iconData.tokenized.srcName + '.svg');
                    return writeFile(filePath, iconData.src);
                })
            );
            console.log(`Успешно сформировано ${promises.length} svg файлов`);
        } catch (e) {
            console.error('Произошла ошибка при генерации svg.', e.message);
            process.exit(1);
        }
    };
}
