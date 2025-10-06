import {optimize} from 'svgo';
import {ITokenizedIcon} from 'types';
import {iconThemeToEnumMap, mapSelectors, selectorsOrder, SVGOConfig} from './consts';
import {getPackageVersion} from './utils/getPackageVersion';
import {IClassMap, IClassNames, IIconRawData, IIconTransformedData, IParser, ITransformer} from '../types';
import {hash} from '../utils/hash';
import {deprecationMap} from '../../deprecationMap';
import {EIconState} from '../../enums';
import {camelize} from '../../utils/stringUtils';
import {Tokenizer} from '../../utils/Tokenizer/Tokenizer';
import {IIconTransformedSVG, IIconTransitionData, IIconTransitionDataTheme} from './types';
import ICON_FILL_PALETTES from '../Parser/palettes';

const version = getPackageVersion();

/**
 * Трансформер получает в себя инстанс парсера, от которого в дальнейшем получает
 * сырую коллекцию иконок, трансформирует её в react компоненты, попутно собирая коллекцию стилей.
 */
export class ReactTransformer implements ITransformer {
    private readonly tokenizer = new Tokenizer();
    private iconsTransformedData: IIconTransformedData[];
    private classNames: IClassNames = {};
    private palettesClasses = [];

    constructor(private readonly parser: IParser) {}

    transform = async (): Promise<void> => {
        const iconsRawData = await this.parser.getIconsRawData();
        const transitionData = this.collectClassNames(iconsRawData);
        this.iconsTransformedData = await Promise.all(transitionData.map(this.transformIcon));
    };

    getIconsData = () => this.iconsTransformedData;

    getPaletteClasses = () => this.palettesClasses;

    /** Возвращает css стили. */
    getStyles = (): string => {
        const mappedStyles = Object.keys(this.classNames).map((className) =>
            this.classNames[className].map(({state, color, opacity}) => ({
                state: state as EIconState,
                style: `${mapSelectors[state](className)} { fill: ${color};${opacity ? ` fill-opacity: ${opacity};` : ''} }`,
            }))
        );

        // Преобразует массив с массивами в плоский массив
        const flatMappedStyles = mappedStyles.reduce((acc, arr) => acc.concat(arr), []);

        return selectorsOrder
            .map((state) => {
                const styles = flatMappedStyles
                    .filter((mappedStyle) => mappedStyle.state === state)
                    .map((mappedStyle) => mappedStyle.style)
                    .join(' ');

                if (state === EIconState.hover) {
                    return this.wrapHoverStyles(styles);
                }

                return styles;
            })
            .join(' ');
    };

    private wrapHoverStyles = (styles: string) =>
        `@media (hover: hover) and (pointer: fine), only screen and (-ms-high-contrast:active), (-ms-high-contrast:none) { ${styles} }`;

    private updateClassNamesFromPalettes = () => {
        ICON_FILL_PALETTES.map((palette) => {
            let themeMap = {};

            for (const theme in palette) {
                const iconStates = Object.keys(palette[theme]).sort();
                const strForHash = iconStates.reduce((str, state) => {
                    const props = palette[theme][state];
                    const opacity = props.opacity || '';
                    return str + state + props.color + opacity;
                }, '');

                const className = hash(strForHash + '|' + version);

                themeMap[theme] = className;

                if (!this.classNames[className]) {
                    this.classNames[className] = iconStates.map((state) => ({
                        state,
                        color: palette[theme][state].color,
                        opacity: palette[theme][state].opacity,
                    }));
                }
            }

            this.palettesClasses.push(themeMap);
        });
    };

    /**
     * Перебирает данные иконок, добавляет мапу соответсвия цветов к css классу.
     * Как сайд-эффект собирает мапу classNames.
     *
     * @param iconsRawData Данные об иконках от парсера.
     */
    private collectClassNames = (iconsRawData: IIconRawData[]): IIconTransitionData[] => {
        this.updateClassNamesFromPalettes();
        return iconsRawData.map(({themes, tokenized}) => {
            const newThemes = Object.keys(themes).map((theme) => {
                const {src, states} = themes[theme];

                const iconStates = Object.keys(states).sort();
                let classMap: IClassMap;

                if (iconStates.length > 1) {
                    classMap = {};
                    const paths = states[EIconState.default].length;
                    for (let i = 0; i < paths; i++) {
                        const strForHash = iconStates.reduce((str, state) => {
                            const props = states[state][i];
                            const opacity = props.opacity || '';
                            return str + state + props.color + opacity;
                        }, '');

                        const className = hash(strForHash + '|' + version);

                        if (!this.classNames[className]) {
                            this.classNames[className] = iconStates.map((state) => ({
                                state,
                                color: states[state][i].color,
                                opacity: states[state][i].opacity,
                            }));
                        }

                        const defaultProps = states[EIconState.default][i];
                        const compositeKey = defaultProps.opacity
                            ? `${defaultProps.color}${defaultProps.opacity}`
                            : defaultProps.color;
                        classMap[compositeKey] = className;
                    }
                }

                return {
                    theme: Number(theme),
                    src,
                    classMap,
                };
            });

            return {
                themes: newThemes,
                tokenized,
            };
        });
    };

    /**
     * Трансформирует содержимое svg иконки от исходного состояния до готового к генерации.
     *
     * @param iconData
     */
    private transformIcon = async ({tokenized, themes}: IIconTransitionData): Promise<IIconTransformedData> => {
        const transformedThemes = await Promise.all(themes.map((theme) => this.transformSVG(theme, tokenized)));

        let src: string;

        if (tokenized.type === 'sc' || tokenized.type === 'mc') {
            src = transformedThemes[0].src;
        } /* else {
            src = transformedThemes
                .map(({theme, src}) => `case EIconsTheme.${iconThemeToEnumMap[theme]}:\n            return ${src};`)
                .join('\n        ');
        } */

        const reactSrc = this.generateSvgComponentCode(src, tokenized);

        return {
            tokenized,
            src: reactSrc,
        };
    };

    /**
     * Трансформирует svg к React компоненту.
     */
    protected transformSVG = async (
        {classMap, src, theme}: IIconTransitionDataTheme,
        tokenized: ITokenizedIcon
    ): Promise<IIconTransformedSVG> => {
        const optimizedSrc = await this.optimizeSVG(src);
        const transformedSrc = [
            this.replaceColorsWithClassNames,
            this.reactifyAttrs,
            this.reactifyInlineStyles,
            this.makeUniqueIds,
            this.insertExtra,
        ].reduce((acc, transformer) => transformer(acc, tokenized, classMap), optimizedSrc);

        return {
            theme,
            src: transformedSrc,
        };
    };

    /**
     * Оптимизирует и минифицирует svg библиотекой SVGO.
     */
    protected optimizeSVG = async (src: string): Promise<string> => {
        return optimize(src, SVGOConfig).data;
    };

    /**
     * Преобразует атрибуты к react-нотации.
     */
    private reactifyAttrs = (src: string): string => src.replace(/([a-zA-Z\-]+=)/gim, camelize);

    /**
     * Преобразует инлайн стили к объекту.
     */
    private reactifyInlineStyles = (src: string): string =>
        src.replace(
            /style="(.*?)"/g,
            (match, styles) =>
                `style={{${styles
                    .split(';')
                    .map((style) => style.replace(/(.*?):\s*(.*)/, (m, prop, value) => `${camelize(prop)}: '${value}'`))
                    .join(',')}}}`
        );

    /**
     * Приводит id к уникальным значениям.
     */
    protected makeUniqueIds = (src: string, {name, size}: ITokenizedIcon): string => {
        const matches = src.match(/id="(.*?)"/g);

        if (Array.isArray(matches)) {
            return matches
                .map((match) => match.split('=').pop().replace(/"/g, ''))
                .reduce(
                    (src, id) =>
                        src
                            .replace(new RegExp(`id="${id}"`, 'gim'), `id="${id}_${name}${size}"`)
                            .replace(new RegExp(`(?:^|\\W)#${id}(?:$|\\W)`, 'g'), `(#${id}_${name}${size})`),
                    src
                );
        } else {
            return src;
        }
    };

    /**
     *  Добавляет data-test-id и название компонента.
     *  Также добавляет focusable="false" для фикса фокуса по svg в ie.
     *  Добавляет aria-hidden="true".
     */
    private insertExtra = (src: string, {type, componentName}: ITokenizedIcon): string => {
        const commonProps = `name="${componentName}" focusable="false" aria-hidden="true"`;

        if (type === 'sc') {
            return src.replace('><',` ${commonProps} {...restProps} ref={ref}><`);
        } else {
            return src.replace('><',` ${commonProps} {...props} ref={ref}><`);
        }
    };

    /** Подменяет fill и fill-opacity именем класса. */
    protected replaceColorsWithClassNames = (src: string, tokenized: ITokenizedIcon, classMap: IClassMap): string => {
        if (!classMap) {
            return src;
        } else if (tokenized.type === 'sc') {
            return src.replace(
                /fill="(?!none)(#[0-9A-F]+)"(?: fill-opacity="(\.[0-9]+)")?/g,
                () => 'className={pathClassName}'
            );
        } /* else if (tokenized.type === 'ic') {
            return src.replace(
                /fill="(?!none)(#[0-9A-F]+)"(?: fill-opacity="(\.[0-9]+)")?/g,
                (match, color, opacity) => {
                    const key = opacity ? `${color}${opacity}` : color;
                    return `className="${classMap[key]}"`;
                }
            );
        } */
    };

    /** Обворачивает svg в React компонент. */
    private generateSvgComponentCode = (src: string, {type, componentName, srcName}: ITokenizedIcon): string => {
        let comment = '';
        if (srcName in deprecationMap) {
            let newComponentName = "";

            if (deprecationMap[srcName]) {
                const newTokenizedIconName = this.tokenizer.tokenizeIconName(deprecationMap[srcName]);
                if (newTokenizedIconName === null) {
                    throw Error(`Не удалось распарсить имя иконки ${srcName} в deprecationMap.`)
                }
                newComponentName = this.tokenizer.createComponentName(newTokenizedIconName);
            }
            comment = `\n** @deprecated${newComponentName ? ` use ${newComponentName}` : ''}*/`;
        }

        if (type === 'sc') {
            return `import React from "react";
import {ISingleColorIconProps} from "./types";
import {useTheme} from "./ThemeProvider";
import getPathClassName from "./utils/getPathClassName";
${comment}
const ${componentName} = React.forwardRef<SVGSVGElement, ISingleColorIconProps>(({paletteIndex, ...restProps}, ref) => {
    const pathClassName = getPathClassName(paletteIndex, useTheme());
    return ${src};
});
export default ${componentName};`;
        } else if (type === 'mc') {
            return `import React from "react";
import {IMultiColorIconProps} from "./types";
${comment}
const ${componentName} = React.forwardRef<SVGSVGElement, IMultiColorIconProps>((props, ref) => {
    return ${src};
});
export default ${componentName};`
        } else {
            return;
        }
    }
}
