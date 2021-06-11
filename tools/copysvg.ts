import path from 'path';
import {createFolderIfNotExists, getDirectories, getSvgDirectoryListing, readFile, writeFile} from './utils/fsUtils';

const rawsvgsPath = path.resolve('./rawsvgs');
const destinationPath = path.resolve('./icons_source/product');
const folders = [...getDirectories(rawsvgsPath)];

(async () => {
    createFolderIfNotExists(destinationPath);
    for (const folder of folders) {
        const iconsFileNames = await getSvgDirectoryListing(folder);
        for (const iconFileName of iconsFileNames) {
            const iconSrc = await readFile(path.resolve(folder, iconFileName));
            await writeFile(path.resolve(destinationPath, iconFileName), iconSrc);
        }
    }
})();
