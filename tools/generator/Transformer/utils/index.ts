import {IIconTransformedSVG} from '../types';
import {iconThemeToEnumMap, UNIQUE_ID_VAR} from '../consts';

const getUniqueIdImport = (withUniqueId: boolean) =>
    withUniqueId ? '\nimport useUniqueId from "./utils/useUniqueId";' : '';

const getUniqueIdDeclaration = (withUniqueId: boolean) =>
    withUniqueId ? `\n    const ${UNIQUE_ID_VAR} = useUniqueId();` : '';

export const generateSingleColorIconCode = (
    componentName: string,
    src: string,
    comment: string,
    withUniqueId: boolean
) =>
    `import React from "react";
import {ISingleColorIconProps} from "./types";
import {useTheme} from "./ThemeProvider";
import getPathClassName from "./utils/getPathClassName";${getUniqueIdImport(withUniqueId)}
${comment}
const ${componentName} = React.forwardRef<SVGSVGElement, ISingleColorIconProps>(({paletteIndex, ...restProps}, ref) => {
    const pathClassName = getPathClassName(paletteIndex, useTheme());${getUniqueIdDeclaration(withUniqueId)}
    return ${src};
});

export default ${componentName};`;

export const generateMultiColorIconWithThemeCode = (
    componentName: string,
    svgs: IIconTransformedSVG[],
    comment: string,
    withUniqueId: boolean
) =>
    `import React from "react";
import {IMultiColorIconProps} from "./types";
import {useTheme, EIconsTheme} from "./ThemeProvider";${getUniqueIdImport(withUniqueId)}
${comment}
const ${componentName} = React.forwardRef<SVGSVGElement, IMultiColorIconProps>((props, ref) => {
    const theme = useTheme();${getUniqueIdDeclaration(withUniqueId)}
    switch (theme) {
${svgs.map((svg) => `        case EIconsTheme.${iconThemeToEnumMap[svg.theme]}:\n            return ${svg.src};`).join('\n')}
    }
});

export default ${componentName};`;

export const generateMultiColorIconWithoutThemeCode = (
    componentName: string,
    src: string,
    comment: string,
    withUniqueId: boolean
) =>
    `import React from "react";
import {IMultiColorIconProps} from "./types";${getUniqueIdImport(withUniqueId)}
${comment}
const ${componentName} = React.forwardRef<SVGSVGElement, IMultiColorIconProps>((props, ref) => {${getUniqueIdDeclaration(withUniqueId)}
    return ${src};
});

export default ${componentName};`;
