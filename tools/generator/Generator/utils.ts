import { iconThemeToEnumMap } from '../Transformer/consts';
import {hash} from '../utils/hash';

/**
 * Содержимое будущего файла типов.
 */
export const getTypesSrc = () =>
    "export interface ISingleColorIconProps extends Omit<React.SVGAttributes<SVGSVGElement>, \"children\"> {\n\
    /** Индекс цветовой палитры для изменения заливки иконки. */\n\
    paletteIndex?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;\n\
}\n\
export interface IMultiColorIconProps extends Omit<React.SVGAttributes<SVGSVGElement>, \"children\"> {}";

export const getThemeProviderSrc = () =>
    `import React, { RefObject, createContext, useContext, useEffect, useState } from "react";

export enum EIconsTheme {
    LIGHT = "LIGHT",
    DARK = "DARK",
}

interface IThemeContext {
    theme: EIconsTheme;
}

const initialContext: IThemeContext = {
    theme: EIconsTheme.LIGHT
};

const ThemeContext = createContext<IThemeContext>(initialContext);

interface IThemeProviderProps {
    theme: EIconsTheme;
    scopeRef?: RefObject<HTMLElement>;
}

export const useTheme = () => {
    const {theme} = useContext(ThemeContext);

    return theme;
};

const themeClassnames = {
    [EIconsTheme.LIGHT]: "icons-light${hash("light")}",
    [EIconsTheme.DARK]: "icons-dark${hash("dark")}",
}

export const ThemeProvider: React.FC<IThemeProviderProps> = ({ children, theme, scopeRef = { current: document.documentElement } }) => {
    const [value, setValue] = useState<IThemeContext>({theme: EIconsTheme.LIGHT});

    useEffect(() => {
        if (!(theme in EIconsTheme)) {
            theme = EIconsTheme.LIGHT;
        }

        setValue({ theme });
        scopeRef.current?.classList.add(themeClassnames[theme]);

        return () => {
            scopeRef.current?.classList.remove(themeClassnames[theme]);
        };
    }, [theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};`;

export const getUtilsSrc = (paletteClasses) => `import {EIconsTheme} from "../ThemeProvider";

const themeToClassNamePalettes = [
${paletteClasses.map((palette) => {
        let str = '    {\n';
        for (const theme in palette) {
            str += `        [EIconsTheme.${iconThemeToEnumMap[theme]}]: "${palette[theme]}",\n`
        }
        str += '    },\n';
        return str;
    }).join("")}];

const getPathClassName = (paletteIndex: number, theme: EIconsTheme) => themeToClassNamePalettes[paletteIndex][theme];

export default getPathClassName;`;
