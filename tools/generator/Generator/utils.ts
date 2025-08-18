import {hash} from '../utils/hash';

/**
 * Содержимое будущего файла model.ts.
 */
export const getModelSrc = () =>
    "export interface IIconProps extends Omit<React.SVGAttributes<SVGSVGElement>, \"children\"> {}";

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

interface IProps {
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

export const ThemeProvider: React.FC<IProps> = ({ children, theme, scopeRef = { current: document.documentElement } }) => {
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
