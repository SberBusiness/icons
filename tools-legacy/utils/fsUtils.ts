import fs from 'fs';
import path from 'path';
import {promisify} from 'util';

const isDirectory = (source: string): boolean => fs.lstatSync(source).isDirectory();

export const getDirectories = (source: string): string[] =>
    fs
        .readdirSync(source)
        .map((name) => path.join(source, name))
        .filter(isDirectory);

export const isPathExists = (source: string): boolean => fs.existsSync(source);

/**
 * Создает папку в случае ее отутствия.
 *
 * @param folder Путь до папки.
 */
export function createFolderIfNotExists(folder: string): void {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
}

/**
 * Промисифицированное чтение файла.
 *
 * @param path Путь до файла.
 */
export const readFile = (path: string): Promise<string> => promisify(fs.readFile)(path, 'utf-8');

/**
 * Промисифицированная запись файла.
 *
 * @param path Путь до файла.
 * @param data Данные для записи.
 */
export const writeFile = (path: string, data: string): Promise<void> =>
    promisify(fs.writeFile)(path, data, {encoding: 'utf-8'});

/**
 * Получает список файлов в директории.
 *
 * @param path Путь до папки.
 * @param [filterPredicate] Фильтрующая функция.
 */
export const getDirectoryListing = (path: string, filterPredicate?: (filePath: string) => boolean): Promise<string[]> =>
    promisify(fs.readdir)(path, 'utf-8').then((files) => (filterPredicate ? files.filter(filterPredicate) : files));

/**
 * Получает список svg файлов директории.
 *
 * @param path Путь до папки.
 */
export const getSvgDirectoryListing = (path: string): Promise<string[]> =>
    getDirectoryListing(path, (filePath) => filePath.endsWith('.svg'));
