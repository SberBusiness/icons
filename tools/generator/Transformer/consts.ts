import {EIconState} from '../../enums';

export const mapSelectors = {
    [EIconState.default]: (className) => `.${className}`,
    [EIconState.hover]: (className) => `.hoverable:hover .${className}`,
    // :enabled не работает с ссылками, поэтому используем :not(:disabled)
    [EIconState.active]: (className) => `.hoverable:not(:disabled):active .${className}, .hoverable.active .${className}`,
    [EIconState.disabled]: (className) => `.hoverable:disabled .${className}, .hoverable.disabled .${className}`,
};

export const selectorsOrder: string[] = [
    EIconState.default,
    EIconState.hover,
    EIconState.active,
    EIconState.disabled,
];

export const initialStyles = [
    {state: EIconState.default, style: '.table-icon .service-fill { fill: #D0D7DD; }'},
    {state: EIconState.hover, style: 'tr:hover button:enabled .table-icon .service-fill { fill: #B2B8BF; }'},
    {state: EIconState.hover, style: 'tr:hover button:enabled:hover .table-icon .service-fill { fill: #7D838A; }'},
    {state: EIconState.active, style: 'tr.selected button:enabled .table-icon .service-fill { fill: #B2B8BF; }'},
];

export const SVGOConfig = {
    plugins: [
        {cleanupAttrs: true},
        {removeDoctype: true},
        {removeXMLProcInst: true},
        {removeComments: true},
        {removeMetadata: true},
        {removeTitle: true},
        {removeDesc: true},
        {removeUselessDefs: true},
        {removeEditorsNSData: true},
        {removeEmptyAttrs: true},
        {removeHiddenElems: true},
        {removeEmptyText: true},
        {removeEmptyContainers: true},
        {removeViewBox: false},
        {cleanupEnableBackground: true},
        {convertStyleToAttrs: true},
        {convertColors: true},
        {convertPathData: true},
        {convertTransform: true},
        {removeUnknownsAndDefaults: true},
        {removeNonInheritableGroupAttrs: true},
        {removeUselessStrokeAndFill: true},
        {removeUnusedNS: true},
        {cleanupIDs: true},
        {cleanupNumericValues: true},
        {moveElemsAttrsToGroup: true},
        {moveGroupAttrsToElems: true},
        {collapseGroups: true},
        {removeRasterImages: false},
        {mergePaths: true},
        {convertShapeToPath: true},
        {sortAttrs: true},
        {removeDimensions: true},
        {removeAttrs: {attrs: '(xmlns)'}},
    ]
};
