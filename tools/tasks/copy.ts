import copy from 'copy';
import path from 'path';
import {generationPath, modulesPaths, publicationPath, root} from '../consts';
import {createFolderIfNotExists} from '../utils/fsUtils';
import {getTarget} from '../utils/processUtils';

const createCallback = (message) => (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log(message);
};

const targetPath = modulesPaths[getTarget(process.argv)];

createFolderIfNotExists(publicationPath);

copy(path.join(root, './LICENSE.txt'), publicationPath, {}, createCallback('Успешно скопирован файл лицензии'));

copy(path.join(root, './README.md'), publicationPath, {}, createCallback('Успешно скопирован файл README'));

copy(path.join(targetPath, './package.json'), publicationPath, { flatten: true }, createCallback('Успешно скопирован package.json'));

copy(path.join(generationPath, './*.js'), publicationPath, {}, createCallback('Успешно скопирован сгенерированный js'));

copy(path.join(generationPath, './*.d.ts'), publicationPath, {}, createCallback('Успешно скопирован файл моделей'));

copy(path.join(generationPath, './css/icons.css'), path.join(publicationPath, './css'), { flatten: true }, createCallback('Успешно скопирован файл стилей'));
