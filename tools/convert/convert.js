var fs = require('fs');
var path = require('path');
var {tokenizeIconName} = require('./tokenizeIconName');
var {ucFirst} = require('./ucFirst');
var SVGO = require('svgo');
var {createFolderIfNotExists, getSvgDirectoryListing, isDirectoryExists} = require('../utils/fsUtils');
var {replaceColorsWithClassNames} = require('./replaceColorsWithClassNames');
const {deprecationMap} = require('../consts');

/**
 * Минифицирует SVG-иконку и возвращает текст с помощью svgo.
 *
 * @param path Путь до иконки.
 */
function getMinifiedSVG (path) {
    var svgoInstance = new SVGO({
        plugins: [{
            cleanupAttrs: true,
        }, {
            removeDoctype: true,
        }, {
            removeXMLProcInst: true,
        }, {
            removeComments: true,
        }, {
            removeMetadata: true,
        }, {
            removeTitle: true,
        }, {
            removeDesc: true,
        }, {
            removeUselessDefs: true,
        }, {
            removeEditorsNSData: true,
        }, {
            removeEmptyAttrs: true,
        }, {
            removeHiddenElems: true,
        }, {
            removeEmptyText: true,
        }, {
            removeEmptyContainers: true,
        }, {
            removeViewBox: false,
        }, {
            cleanupEnableBackground: true,
        }, {
            convertStyleToAttrs: true,
        }, {
            convertColors: true,
        }, {
            convertPathData: true,
        }, {
            convertTransform: true,
        }, {
            removeUnknownsAndDefaults: true,
        }, {
            removeNonInheritableGroupAttrs: true,
        }, {
            removeUselessStrokeAndFill: true,
        }, {
            removeUnusedNS: true,
        }, {
            cleanupIDs: true,
        }, {
            cleanupNumericValues: true,
        }, {
            moveElemsAttrsToGroup: true,
        }, {
            moveGroupAttrsToElems: true,
        }, {
            collapseGroups: true,
        }, {
            removeRasterImages: false,
        }, {
            mergePaths: true,
        }, {
            convertShapeToPath: true,
        }, {
            sortAttrs: true,
        }, {
            removeDimensions: true,
        }, {
            removeAttrs: {attrs: '(xmlns)'},
        }],
    });

    return new Promise(function (resolve, reject) {
        fs.readFile(path, 'utf-8', function(err, svgData) {
            if (err) {
                reject(err);
                return;
            }


            svgoInstance.optimize(svgData).then(function(result) {
                resolve(result.data);
            }, reject);
        });
    });
}

/**
 * Преобразование атрибутов к reactjs-нотации.
 * @param {string} src Контент svg.
 */
function reactifyAttrs(src) {
    return src.replace(/([a-zA-Z\-]+=)/gim, function(toCamelize) {
        return toCamelize.split('-').map(function(item, index){
            if (index !== 0) {
                return ucFirst(item);
            } else {
                return item;
            }
        }).join('');
    });
}

/**
 * @param {string} src Исходник свг.
 * @param {string} iconName Имя иконки.
 */
function makeIdsUnique(src, iconName) {
    var matches = src.match(/id="(.*?)"/g);


    if (Array.isArray(matches)) {
        return matches.map(function(match) {
            return match.split("=").pop().replace(/"/g, "");
        }).reduce(function(src, id) {
            var newId = `${id}_${iconName}`;

            return src.replace(new RegExp(id, "gim"), newId);
        }, src);
    } else {
        return src;
    }
}

/**
 * Сгенерировать код компонента на основании svg.
 *
 * @param {string} svgSrc Строка с svg.
 * @param {Object} tokenized Параметры иконки.
 * @param {boolean} [isDeprecated] флаг deprecated иконки.
 * @return {string} Код tsx-компонента.
 */
function generateSvgComponentCode(svgSrc, tokenized, isDeprecated) {
    let deprecationMessage = '';
    if (isDeprecated) {
        deprecationMessage += ' * @deprecated';
        if (deprecationMap[tokenized.iconName]) {
            const replacerTokenized = tokenizeIconName(deprecationMap[tokenized.iconName]);
            deprecationMessage += ` use ${replacerTokenized.componentName}`;
        }
        deprecationMessage += '\n';
    }

    return `import * as React from 'react';
import {IIconProps} from './models';
/**
${deprecationMessage} * icon_source: ${tokenized.iconName}.svg
 */
export function ${tokenized.componentName}(props: IIconProps) {
    return (
        ${svgSrc}
    );
}
`;
}

/**
 *  Вставить размеры в код svg.
 */
function insertSize(src, tokenized) {
    return src.replace("<svg", `<svg width="${tokenized.size}" height="${tokenized.size}"`);
}

/**
 *  Добавить класс и data-test-id в код svg.
 *  Добавить focusable="false" для фикса фокуса по svg в ie
 *  Не добавит data-test-id, если props['data-test-id'] === undefined.
 */
function insertExtra(src, tokenized) {
    if (tokenized.type === 'ic') {
        return src.replace("><", ` className={\`svg-icon \${props.table ? 'table-icon ' : ''}\${props.className || ''}\`} data-test-id={props['data-test-id']} name="${tokenized.componentName}" focusable="false" aria-hidden="true"><`);
    } else if (tokenized.type === 'il') {
        return src.replace("><", ` className={\`svg-illustration \${props.className || ''}\`} data-test-id={props['data-test-id']} name="${tokenized.componentName}" focusable="false" aria-hidden="true"><`);
    } else {
        throw new Error(`Неопределенный тип иконки ${tokenized.iconName}.`);
    }
}

/**
 * Сформировать содержимое tsx файла для компонента иконки.
 *
 * @param {string} iconPath Путь до иконки.
 * @param {Object} tokenized Параметры иконки.
 * @param {boolean} [isDeprecated] флаг deprecated иконки.
 * @return {string} Контент файла tsx-компонента с иконкой.
 */
function getComponentSrcFromIcon(iconPath, tokenized, isDeprecated) {
    return new Promise(function(resolve, reject) {
        getMinifiedSVG(iconPath)
            .then(function(svgSrc) {
                var transformedSvgSource = [
                        reactifyAttrs,
                        function(src) {
                            return replaceColorsWithClassNames(src, tokenized);
                        },
                        function(src) {
                            return makeIdsUnique(src, tokenized.name);
                        },
                        function(src) {
                            return insertSize(src, tokenized);
                        },
                        function(src) {
                            return insertExtra(src, tokenized);
                        }
                    ].reduce(
                        function(memo, transformer) {
                            return transformer(memo);
                        },
                        svgSrc
                );

                resolve(generateSvgComponentCode(transformedSvgSource, tokenized, isDeprecated));
            }, reject).catch(reject);
    });
}

/**
 * Записать контент файла компонента.
 *
 * @param {string} tokenized Имя компонента с иконкой.
 * @param {string} destinationFolder Папка назначения.
 * @param {string} componentCode Код компонента.
 */
function createComponentAtDestination(tokenized, destinationFolder, componentCode) {
    var filePath = path.resolve(destinationFolder, tokenized.componentFileName);

    return new Promise(function(resolve, reject) {
        fs.writeFile(filePath, componentCode, {encoding: 'utf-8'}, function(err) {
            if (err) {
                reject(err);
                return;
            } else {
                resolve();
            }
        });
    });
}

/**
 * Преобразовать исходники иконок к tsx компонента.
 *
 * @param {string} iconSourceName Путь до иконки.
 * @param {string} sourceFolderPath Путь к папке с иконками.
 * @param {string} destinationFolderPath Путь к папке, в которую будут генериться компоненты.
 * @param {boolean} [isDeprecated] флаг deprecated иконки.
 */
async function convertIcon(iconSourceName, sourceFolderPath, destinationFolderPath, isDeprecated) {
    const tokenized = tokenizeIconName(path.basename(iconSourceName, '.svg'));
    try {
        const componentCode = await getComponentSrcFromIcon(path.resolve(sourceFolderPath, iconSourceName), tokenized, isDeprecated);
        return await createComponentAtDestination(tokenized, destinationFolderPath, componentCode);
    } catch (e) {
        console.error(`Произошла ошибка при трансформации ${iconSourceName}.`, e);
        process.exit(1);
    }
}

/**
 * Преобразовать исходники иконок к tsx компонента.
 *
 * @param {string} sourceFolderPath Путь к папке с иконками.
 * @param {string} destinationFolderPath Путь к папке, в которую будут генериться компоненты.
 */
async function convertSourceIconsToTSXComponents(sourceFolderPath, destinationFolderPath) {
    createFolderIfNotExists(destinationFolderPath);
    try {
        const promises = [];

        const pathsList = await getSvgDirectoryListing(sourceFolderPath);
        pathsList.forEach((iconSourceName) => {
            promises.push(convertIcon(iconSourceName, sourceFolderPath, destinationFolderPath));
        });

        const deprecatedFolderPath = path.resolve(sourceFolderPath, 'deprecated');
        if (isDirectoryExists(deprecatedFolderPath)) {
            const deprecatedPathsList = await getSvgDirectoryListing(deprecatedFolderPath);
            deprecatedPathsList.forEach((iconSourceName) => {
                promises.push(convertIcon(iconSourceName, deprecatedFolderPath, destinationFolderPath, true));
            });
        }

        await Promise.all(promises)
            .then(() => {
                console.log(`Успешно сформировано ${pathsList.length} компонентов`);
            })
            .catch((e) => {
                console.error("Произошла ошибка при формировании tsx компонентов.", e);
                process.exit(1);
            });
    } catch (e) {
        console.log('Возникла ошибка в ходе чтения директории с svg исходниками иконок.', e);
        process.exit(1);
    }
}

module.exports = {
    convertSourceIconsToTSXComponents: convertSourceIconsToTSXComponents
};
