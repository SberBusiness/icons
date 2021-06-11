const fs = require('fs');
const path = require('path');

const isDirectory = source => fs.lstatSync(source).isDirectory();

const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);

const isDirectoryExists = source => fs.existsSync(source);

/**
 * Создает папку в случае ее отутствия.
 *
 * @param {string} folder Путь до папки.
 */
function createFolderIfNotExists(folder) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
}

/**
 * Промисифицированное чтение файла.
 *
 * @param {string} filePath Путь до файла.
 * @return {Promise<string>}
 */
function readFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, 'utf-8', function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    });
}

/**
 * Промисифицированная запись файла.
 *
 * @param {string} filePath Путь до файла.
 * @param {string} data Данные для записи.
 * @return {Promise}
 */
function writeFile(filePath, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filePath, data, {encoding: 'utf-8'}, function(err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

/**
 * Получает список файлов в директории.
 *
 * @param {string} path Путь до папки.
 * @param {Function} [filterPredicate] Фильтрующая функция.
 * @return Promise<string[]>
 */
function getDirectoryListing(path, filterPredicate) {
    return new Promise(function(resolve, reject) {
        fs.readdir(path, 'utf-8', function(err, files) {
            if (err) {
                reject(err);
            }

            let result = files;

            if (filterPredicate) {
                result = files.filter(filterPredicate);
            }

            resolve(result);
        });
    });
}

/**
 * Получает список svg файлов директории.
 *
 * @param {string} path Путь до папки.
 * @return Promise<string[]>
 */
function getSvgDirectoryListing(path) {
    return getDirectoryListing(path, filePath => filePath.endsWith('.svg'));
}

module.exports = {
    isDirectoryExists,
    getDirectories,
    createFolderIfNotExists,
    readFile,
    writeFile,
    getSvgDirectoryListing,
};
