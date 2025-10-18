import {Config} from 'svgo';
import {EIconState, EIconTheme} from '../../enums';

export const iconThemeToEnumMap = {
    [EIconTheme.lm]: 'LIGHT',
    [EIconTheme.dm]: 'DARK',
};

export const mapSelectors = {
    [EIconState.default]: (className: string) => `.${className}`,
    [EIconState.hover]: (className: string) => `.hoverable:hover .${className}`,
    // :enabled не работает с ссылками, поэтому используем :not(:disabled)
    [EIconState.active]: (className: string) =>
        `.hoverable:not(:disabled):active .${className}, .hoverable.active .${className}`,
    [EIconState.disabled]: (className: string) =>
        `.hoverable:disabled .${className}, .hoverable.disabled .${className}`,
};

export const selectorsOrder: string[] = [EIconState.default, EIconState.hover, EIconState.active, EIconState.disabled];

export const SVGOConfig: Config = {
    plugins: [
        'cleanupAttrs',
        'cleanupEnableBackground',
        'cleanupIds',
        'cleanupNumericValues',
        'collapseGroups',
        {
            name: 'convertColors',
            params: {
                currentColor: false,
                names2hex: true,
                rgb2hex: true,
                shorthex: false,
                shortname: false,
            },
        },
        'convertPathData',
        'convertShapeToPath',
        'convertStyleToAttrs',
        'convertTransform',
        'mergePaths',
        'moveElemsAttrsToGroup',
        'moveGroupAttrsToElems',
        'removeComments',
        'removeDesc',
        'removeDoctype',
        'removeEditorsNSData',
        'removeEmptyAttrs',
        'removeEmptyContainers',
        'removeEmptyText',
        'removeHiddenElems',
        'removeMetadata',
        'removeNonInheritableGroupAttrs',
        'removeTitle',
        'removeUnknownsAndDefaults',
        'removeUnusedNS',
        'removeUselessStrokeAndFill',
        'removeUselessDefs',
        'removeXMLNS',
        'removeXMLProcInst',
        'sortAttrs',
    ],
};
