const path = require('path');
const {writeFile} = require('../utils/fsUtils');

const modelsSrc = `/**
 * @prop {never} [style] Инлайн-стили запрещены.
 * @prop {boolean} [table] Включение табличного поведения иконки с двойным ховером.
 * @prop {string} [className]
 * @prop {string} [data-test-id]
 */
export interface IIconProps {
    style?: never;
    table?: boolean;
    className?: string;
    'data-test-id'?: string;
}
`;

/**
 * Генерирует файл модели с интерфейсом свойств иконок.
 *
 * @param {string} destinationFolder Папка назначения.
 */
async function generateModels(destinationFolder) {
    try {
        const filePath = path.resolve(destinationFolder, 'models.d.ts');
        await writeFile(filePath, modelsSrc);
        console.log('Успешно сформирован файл моделей');
    } catch (e) {
        throw new Error(`Ошибка в процессе формирования файла моделей. ${e.message}`);
    }
}

module.exports = {
    generateModels
};
