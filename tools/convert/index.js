const {validateIconNames} = require('./validateIconNames');
const {convertSourceIconsToTSXComponents} = require('./convert');
const {generateCss} = require('./generateCss');
const {generateModels} = require('./generateModels');
const {getDirectories} = require('../utils/fsUtils');
const {SOURCE_PATHS, DEFAULT_GENERATED_PATH} = require('../consts');

const folders = [
    ...getDirectories(SOURCE_PATHS.ICONS),
    ...getDirectories(SOURCE_PATHS.ILLUSTRATIONS)
];

/**
 * Валидирует имена иконок, конвертирует их в компоненты и генерирует файлы стилей и моделей.
 */
async function convert() {
    try {
        await validateIconNames(folders);

        for (const folder of folders) {
            await convertSourceIconsToTSXComponents(folder, DEFAULT_GENERATED_PATH);
        }

        await generateCss(DEFAULT_GENERATED_PATH);
        await generateModels(DEFAULT_GENERATED_PATH);

    } catch (err) {
        console.error('Произошла ошибка при формировании компонентов.', err.message);
        process.exit(1);
    }
}

convert();
