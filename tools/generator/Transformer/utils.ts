import {IIconTransformedSVG} from './types';
import {iconThemeToEnumMap} from './consts';

export const generateSingleColorIconCode = (componentName: string, src: string, comment: string) =>
    `import React from "react";
import {ISingleColorIconProps} from "./types";
import {useTheme} from "./ThemeProvider";
import getPathClassName from "./utils/getPathClassName";
${comment}
const ${componentName} = React.forwardRef<SVGSVGElement, ISingleColorIconProps>(({paletteIndex, ...restProps}, ref) => {
    const pathClassName = getPathClassName(paletteIndex, useTheme());
    return ${src};
});

export default ${componentName};`;

export const generateMultiColorIconWithThemeCode = (
    componentName: string,
    svgs: IIconTransformedSVG[],
    comment: string
) =>
    `import React from "react";
import {IMultiColorIconProps} from "./types";
import {useTheme, EIconsTheme} from "./ThemeProvider";
${comment}
const ${componentName} = React.forwardRef<SVGSVGElement, IMultiColorIconProps>((props, ref) => {
    const theme = useTheme();
    switch (theme) {
${svgs.map((svg) => `        case EIconsTheme.${iconThemeToEnumMap[svg.theme]}:\n            return ${svg.src};`).join('\n')}
    }
});

export default ${componentName};`;

export const generateMultiColorIconWithoutThemeCode = (componentName: string, src: string, comment: string) =>
    `import React from "react";
import {IMultiColorIconProps} from "./types";
${comment}
const ${componentName} = React.forwardRef<SVGSVGElement, IMultiColorIconProps>((props, ref) => {
    return ${src};
});

export default ${componentName};`;
