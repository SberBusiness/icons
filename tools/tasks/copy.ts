import copy from 'copy';
import path from 'path';
import {generationPath, modulesPaths, publicationPath, root} from '../consts';
import {createFolderIfNotExists} from '../utils/fsUtils';

const createCallback = (message) => (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log(message);
};

const targetPath = modulesPaths['icons'];

createFolderIfNotExists(publicationPath);

copy(path.join(root, './LICENSE.txt'), publicationPath, {}, createCallback('Успешно скопирован файл лицензии.'));

copy(
    path.join(targetPath, './package.json'),
    publicationPath,
    {flatten: true},
    createCallback('Успешно скопирован package.json.')
);

copy(
    path.join(generationPath, './*.js'),
    publicationPath,
    {},
    createCallback('Успешно скопирован сгенерированный js.')
);

copy(path.join(generationPath, './*.d.ts'), publicationPath, {}, createCallback('Успешно скопирован файл моделей.'));

copy(
    path.join(generationPath, './styles/icons.css'),
    path.join(publicationPath, './styles'),
    {flatten: true},
    createCallback('Успешно скопирован файл стилей.')
);

copy(
    path.join(generationPath, './utils/*.js'),
    path.join(publicationPath, './utils'),
    createCallback('Успешно скопирован файл утилит.')
);

copy(path.join(root, './README.md'), publicationPath, {}, createCallback('Успешно скопирован файл README.'));
