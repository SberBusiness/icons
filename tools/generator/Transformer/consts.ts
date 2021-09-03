import {EIconState} from '../../enums';

export const mapSelectors = {
    [EIconState.default]: (className) => `.${className}`,
    [EIconState.hover]: (className) => `.hoverable:hover .${className}, .hoverable:focus .${className}`,
    [EIconState.active]: (className) => `.hoverable.active .${className}`,
    [EIconState.disabled]: (className) => `.hoverable:disabled .${className}, .hoverable.disabled .${className}`,
};

export const selectorsOrder: string[] = [
    EIconState.default,
    EIconState.hover,
    EIconState.active,
    EIconState.disabled,
];

export const initialStyles = [
    '.table-icon .service-fill { fill: #D0D7DD; }',
    'tr:hover .table-icon .service-fill { fill: #B2B8BF; }',
    'button:hover:not(:disabled) .table-icon .service-fill { fill: #7D838A; }',
].join(' ');

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
