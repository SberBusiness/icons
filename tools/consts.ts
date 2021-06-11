import path from 'path';

export const root = path.resolve('.');

/** Пути модулей. */
export const modulesPaths = {
    icons: path.resolve(root, './icons'),
    illustrations: path.resolve(root, './illustrations'),
};

/** Пути до svg иконок модулей. */
export const srcPaths = {
    icons: path.resolve(root, './icons/svgs'),
    illustrations: path.resolve(root, './illustrations/svgs'),
};

export const generationPath = path.resolve(root, './generated');
export const publicationPath = path.resolve(root, './public');

/** Путь до файла с отпечатком даты последней синхронизации. */
export const lastSuccessfulFetchPath = path.resolve(root, './tools/fetcher/lastSuccessfulFetch.json');

/**
 * Переменные окружение. Либо из файла .env локально, либо из окружения пайплайна.
 */
require('dotenv').config();

/** Токен figma api */
export const figmaToken = process.env.FIGMA_TOKEN;

/** Ключ файла с иконками */
export const figmaIconsFileKey = process.env.FIGMA_ICONS_FILE_KEY;
