import path from 'path';

export const root = path.resolve('.');

/** Пути модулей. */
export const modulesPaths = {
    icons: path.resolve(root, './packages/icons'),
    illustrations: path.resolve(root, './packages/illustrations'),
};

/** Пути до svg иконок модулей. */
export const srcPaths = {
    icons: path.resolve(root, './packages/icons/svgs'),
    illustrations: path.resolve(root, './packages/illustrations/svgs'),
};

export const generationPath = path.resolve(root, './generated');
export const publicationPath = path.resolve(root, './public');
