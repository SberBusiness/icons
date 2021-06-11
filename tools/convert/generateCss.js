const path = require('path');
const {ICON_STATES, THEMES} = require('../consts');
const {createFolderIfNotExists, writeFile} = require('../utils/fsUtils');

const STYLES = [
    '.table-icon .primary-fill { fill: #D0D7DD; }',
    'tr:hover .table-icon .primary-fill { fill: #B2B8BF; }',
    'button:hover:not(:disabled) .table-icon .primary-fill { fill: #7D838A; }',
    '.product-fill { fill: #B2B8BF; }',
    '.hoverable.active .product-fill { fill: #107F8C; }',
    '.link-fill { fill: #1358BF; }',
    '.hoverable:hover .link-fill { fill: #107F8C; }',
    '.hoverable:active .link-fill { fill: #0F5498; }',
    '.hoverable:disabled .link-fill { fill: #93B7ED; }',
    '.hoverable.disabled .link-fill { fill: #93B7ED; }',
    '.paginator-primary-fill { fill: #565B62; }',
    '.paginator-secondary-fill { fill: #F2F4F7; }',
    '.hoverable:hover .paginator-primary-fill { fill: #1F1F22; }',
    '.hoverable:hover .paginator-secondary-fill { fill: #E4E8EB; }',
    '.hoverable:disabled .paginator-primary-fill { fill: #D0D7DD; }',
    '.hoverable.disabled .paginator-primary-fill { fill: #D0D7DD; }',
    '.hoverable:disabled .paginator-secondary-fill { fill: #F2F4F7; }',
    '.hoverable.disabled .paginator-secondary-fill { fill: #F2F4F7; }',
    '.shop-fill { fill: #B2B8BF; }',
    '.hoverable.active .shop-fill { fill: #198CFE; }',
    '.headerkebab-fill { fill: #1F1F22; }',
    '.hoverable:hover .headerkebab-fill { fill: #1F1F22; }',
    '.hoverable:disabled .headerkebab-fill { fill: #D0D7DD; }',
    '.hoverable.disabled .headerkebab-fill { fill: #D0D7DD; }',
    '.offerlike-fill { fill: #1F1F22; }',
    '.hoverable:hover .offerlike-fill { fill: #21A19A; }',
    '.hoverable.active .offerlike-fill { fill: #107F8C; }',
    '.offerdislike-fill { fill: #1F1F22; }',
    '.hoverable:hover .offerdislike-fill { fill: #DB1237; }',
    '.hoverable.active .offerdislike-fill { fill: #C11030; }',
    '.sort-fill { fill: #565B62; }',
    '.hoverable:hover .sort-fill { fill: #7D838A; }',
    '.caretdown-fill { fill: #1F1F22; }',
    '.hoverable:disabled .caretdown-fill { fill: #D0D7DD; }',
    '.hoverable.disabled .caretdown-fill { fill: #D0D7DD; }',
    '.widgetcarousel-fill { fill: #565B62; }',
    '.hoverable:hover .widgetcarousel-fill { fill: #1F1F22; }',
    '.like-fill { fill: #B2B8BF; }',
    '.hoverable:hover .like-fill { fill: #21A19A; }',
    '.hoverable:active .like-fill { fill: #107F8C; }',
    '.dislike-fill { fill: #B2B8BF; }',
    '.hoverable:hover .dislike-fill { fill: #DB1237; }',
    '.hoverable:active .dislike-fill { fill: #C11030; }',
    '.caretside-fill { fill: #B2B8BF; }',
    '.hoverable:hover .caretside-fill { fill: #7D838A; }',
    '.hoverable:disabled .caretside-fill { fill: #D0D7DD; }',
    '.hoverable.disabled .caretside-fill { fill: #D0D7DD; }',
    '.replacement-fill { fill: #1F1F22; }',
    '.hoverable:hover .replacement-fill { fill: #1F1F22; }',
    '.hoverable:disabled .replacement-fill { fill: #D0D7DD; }',
    '.hoverable.disabled .replacement-fill { fill: #D0D7DD; }',
    '.localdelete-fill { fill: #B2B8BF; }',
    '.hoverable:hover .localdelete-fill { fill: #7D838A; }',
    '.hoverable:disabled .localdelete-fill { fill: #D0D7DD; }',
    '.hoverable.disabled .localdelete-fill { fill: #D0D7DD; }',
].join(' ');

/**
 * Генерирует css файл стилей.
 *
 * @param {string} destinationFolder Путь до папки, в которую будут генериться стили.
 */
async function generateCss(destinationFolder) {
    try {
        const cssFolder = path.resolve(destinationFolder, 'css');
        const filePath = path.resolve(cssFolder, 'icons.css');

        createFolderIfNotExists(destinationFolder);
        createFolderIfNotExists(cssFolder);

        await writeFile(filePath, STYLES);
        console.log('Успешно сформирован файл стилей');
    } catch (err) {
        console.error('В ходе формирования файла стилей произошла ошибка.', err.message);
        process.exit(1);
    }
}

module.exports = {
    generateCss
};
