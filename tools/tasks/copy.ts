import copy from 'copy';
import path from 'path';
import {generationPath, modulesPaths, publicationPath, root} from '../consts';
import {createFolderIfNotExists} from '../utils/fsUtils';
import {ETarget, getTarget} from '../utils/envUtils';

const createCallback = (message) => (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log(message);
};

const target = getTarget();
const targetPath = modulesPaths[target];

createFolderIfNotExists(publicationPath);

copy(path.join(root, './LICENSE.txt'), publicationPath, {}, createCallback('Успешно скопирован файл лицензии'));

copy(path.join(targetPath, './package.json'), publicationPath, { flatten: true }, createCallback('Успешно скопирован package.json'));

copy(path.join(generationPath, './*.js'), publicationPath, {}, createCallback('Успешно скопирован сгенерированный js'));

copy(path.join(generationPath, './*.d.ts'), publicationPath, {}, createCallback('Успешно скопирован файл моделей'));

if (target === ETarget.icons) {
    copy(path.join(generationPath, './css/icons.css'), path.join(publicationPath, './css'), { flatten: true }, createCallback('Успешно скопирован файл стилей'));
    copy(path.join(root, './README.md'), publicationPath, {}, createCallback('Успешно скопирован файл README'));
} else {
    copy(path.join(targetPath, './README.md'), publicationPath, { flatten: true }, createCallback('Успешно скопирован README'));
}
