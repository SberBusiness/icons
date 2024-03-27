import {Config} from 'svgo';
import {EIconState, EIconTheme} from '../../enums';

export const iconThemeToEnumMap = {
    [EIconTheme.lm]: 'LIGHT',
    [EIconTheme.dm]: 'DARK',
};

export const mapSelectors = {
    [EIconState.default]: (className) => `.${className}`,
    [EIconState.hover]: (className) => `.hoverable:hover .${className}`,
    // :enabled не работает с ссылками, поэтому используем :not(:disabled)
    [EIconState.active]: (className) =>
        `.hoverable:not(:disabled):active .${className}, .hoverable.active .${className}`,
    [EIconState.disabled]: (className) => `.hoverable:disabled .${className}, .hoverable.disabled .${className}`,
};

export const selectorsOrder: string[] = [EIconState.default, EIconState.hover, EIconState.active, EIconState.disabled];

export const initialStyles = [
    {state: EIconState.default, style: '.table-icon .service-fill { fill: #D0D7DD; }'},
    {state: EIconState.hover, style: 'tr:hover button:enabled .table-icon .service-fill { fill: #B2B8BF; }'},
    {state: EIconState.hover, style: 'tr:hover button:enabled:hover .table-icon .service-fill { fill: #7D838A; }'},
    {state: EIconState.active, style: 'tr.selected button:enabled .table-icon .service-fill { fill: #B2B8BF; }'},
];

export const SVGOConfig: Config = {
    plugins: [
        'cleanupAttrs',
        'cleanupEnableBackground',
        'cleanupIds',
        'cleanupNumericValues',
        'collapseGroups',
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
    ],
};
