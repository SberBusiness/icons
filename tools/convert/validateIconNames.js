const path = require('path');
const {isNameValid} = require('./tokenizeIconName');
const {getSvgDirectoryListing} = require('../utils/fsUtils');

/**
 * Проверяет валидность имен иконок.
 *
 * @param {Array<string>} folders Список директорий с иконками.
 * @throws Возвращает ошибку со списком невалидных имен иконок.
 */
async function validateIconNames(folders) {
    folders = await Promise.all(folders.map(getSvgDirectoryListing));

    const invalidIconNames = folders
        .reduce((iconPaths, folderPaths) => [...iconPaths, ...folderPaths])
        .map(iconFileName => path.basename(iconFileName, '.svg'))
        .filter(iconName => !isNameValid(iconName));

    if (invalidIconNames.length) {
        throw new Error(`Не удалось токенизировать имена файлов:\n${invalidIconNames.join('\n')}`);
    }
}

module.exports = {
    validateIconNames
};
