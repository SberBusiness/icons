import {Config, optimize} from 'svgo';
import {ITokenizedIcon} from 'types';
import {mapSelectors, selectorsOrder, SVGOConfig, UNIQUE_ID_MARKER} from './consts';
import {
    generateSingleColorIconCode,
    generateMultiColorIconWithThemeCode,
    generateMultiColorIconWithoutThemeCode,
} from './utils';
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
// Версия библиотеки в id исключает коллизии между копиями пакета разных версий на одной странице.
const versionHash = hash(version);

const makeClassName = (strForHash: string): string => hash(strForHash + '|' + version);

// Префикс id: имя и размер иконки, хеш версии библиотеки.
// Разделитель между именем и размером исключает совпадения вида a1 + 2 и a + 12.
const getIdPrefix = ({name, size}: ITokenizedIcon): string => `${versionHash}-${name}-${size}-`;

const hasIdRegExp = /\sid="/;

// Следующие регулярки с флагом g (хранят lastIndex): использовать только в replace/matchAll, не в test/exec.
// Пробел перед id исключает совпадения с атрибутами вида data-test-id.
const idAttrRegExp = /(?<=\s)id="([^"]+)"/g;
// href, xlink:href, xlinkHref
const hrefAttrRegExp = /(?<=\s)((?:xlink:?)?href)="#([^"]+)"/gi;
// Одна кавычка вокруг ссылки: ' или её сущности (&quot;, &apos;, &#39;, &#x27;; SVGO сериализует двойные как &quot;).
const urlQuotePattern = String.raw`(?:&(?:quot|apos|#39|#x27);|')`;
// Начало ссылки: url(#, url('#, url(&quot;#.
const urlOpenPattern = String.raw`url\(\s*${urlQuotePattern}?#`;
// Только атрибуты со ссылками url(#...): имя="...url(#id)...", чтобы не перебирать цвета вида fill="#FFFFFF".
const urlAttrRegExp = new RegExp(String.raw`\b([a-zA-Z:-]+)="([^"]*${urlOpenPattern}[^"]*)"`, 'g');
// Группа с id ленивая, чтобы закрывающая кавычка (в т.ч. &quot;) не попала в id.
const urlRefRegExp = new RegExp(String.raw`${urlOpenPattern}([^)]+?)${urlQuotePattern}?\s*\)`, 'g');

/**
 * Трансформер получает в себя инстанс парсера, от которого в дальнейшем получает
 * сырую коллекцию иконок, трансформирует её в react компоненты, попутно собирая коллекцию стилей.
 */
export class ReactTransformer implements ITransformer {
    private readonly tokenizer = new Tokenizer();
    protected iconsTransformedData: IIconTransformedData[];
    private classNames: IClassNames = {};
    private palettesClasses = [];

    constructor(protected readonly parser: IParser) {}

    transform = async (): Promise<void> => {
        const iconsRawData = await this.parser.getIconsRawData();
        const transitionData = this.collectClassNames(iconsRawData);
        this.iconsTransformedData = transitionData.map(this.transformIcon);
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

                const className = makeClassName(strForHash);

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

                        const className = makeClassName(strForHash);

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
     */
    private transformIcon = ({tokenized, themes}: IIconTransitionData): IIconTransformedData => {
        // Для иконок без темы в компонент попадает только первая тема, остальные трансформировать незачем.
        const neededThemes = tokenized.type === 'sc' || tokenized.theme === undefined ? themes.slice(0, 1) : themes;
        const transformedSVGs = neededThemes.map((theme) => this.transformSVG(theme, tokenized));

        return {
            tokenized,
            src: this.generateSvgComponentCode(tokenized, transformedSVGs),
        };
    };

    /**
     * Трансформирует svg к React компоненту.
     */
    protected transformSVG = (
        {classMap, src, theme}: IIconTransitionDataTheme,
        tokenized: ITokenizedIcon
    ): IIconTransformedSVG => {
        const reactifiedSrc = this.reactifyInlineStyles(this.reactifyAttrs(this.optimizeSVG(src)));
        const withIdsSrc = this.makeInstanceUniqueIds(reactifiedSrc, tokenized);
        const transformedSrc = this.replaceColorsWithClassNames(
            this.insertExtra(withIdsSrc, tokenized),
            tokenized,
            classMap
        );

        return {theme, src: transformedSrc};
    };

    /**
     * Оптимизирует и минифицирует svg библиотекой SVGO.
     */
    protected optimizeSVG = (src: string, config: Config = SVGOConfig): string => optimize(src, config).data;

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
     * Переименовывает id и ссылки на них вида url(#id) и href="#id" в атрибутах.
     * Ссылки внутри инлайн стилей не обрабатываются (SVGO выносит стили в атрибуты через convertStyleToAttrs).
     *
     * @param prefix Префикс, добавляемый к каждому id.
     * @param dynamic Префикс содержит JS выражение: значения атрибутов выводятся как шаблонные строки `{`...`}`.
     */
    private replaceIds = (src: string, prefix: string, dynamic: boolean): string => {
        // Большинство иконок без id: не запускаем regex-проходы зря.
        if (!hasIdRegExp.test(src)) {
            return src;
        }

        const makeId = (id: string) => `${prefix}${id}`;
        const makeAttr = (attr: string, value: string) => (dynamic ? `${attr}={\`${value}\`}` : `${attr}="${value}"`);
        const ids = new Set<string>();
        const withIds = src.replace(idAttrRegExp, (_, id) => {
            ids.add(id);
            return makeAttr('id', makeId(id));
        });

        return withIds
            .replace(hrefAttrRegExp, (match, attr, id) => (ids.has(id) ? makeAttr(attr, `#${makeId(id)}`) : match))
            .replace(urlAttrRegExp, (match, attr, value) => {
                const newValue = value.replace(urlRefRegExp, (ref, id) => (ids.has(id) ? `url(#${makeId(id)})` : ref));

                return newValue === value ? match : makeAttr(attr, newValue);
            });
    };

    /**
     * Приводит id к значениям, уникальным в пределах набора иконок (для статичных svg).
     */
    protected makeUniqueIds = (src: string, tokenized: ITokenizedIcon): string =>
        this.replaceIds(src, getIdPrefix(tokenized), false);

    /**
     * Приводит id к значениям, уникальным для каждого экземпляра компонента.
     * Добавляет к id значение хука useUniqueId, иначе при нескольких одинаковых иконках на странице
     * url(#id) ссылается на элемент первой из них
     * (и, если она скрыта через display: none, градиенты/маски/фильтры остальных не отрисовываются).
     * Имя, размер иконки и хеш версии библиотеки сохраняются в id: значение хука не уникально между разными
     * React-корнями и копиями пакета, а так коллизия возможна только между одинаковыми иконками одной версии
     * и ни на что не влияет.
     */
    protected makeInstanceUniqueIds = (src: string, tokenized: ITokenizedIcon): string =>
        this.replaceIds(src, `${getIdPrefix(tokenized)}${UNIQUE_ID_MARKER}-`, true);

    /**
     *  Добавляет data-test-id и название компонента.
     *  Также добавляет focusable="false" для фикса фокуса по svg в ie.
     *  Добавляет aria-hidden="true".
     */
    private insertExtra = (src: string, {type, componentName}: ITokenizedIcon): string => {
        const commonProps = `name="${componentName}" focusable="false" aria-hidden="true"`;

        if (type === 'sc') {
            return src.replace('><', ` ${commonProps} {...restProps} ref={ref}><`);
        } else {
            return src.replace('><', ` ${commonProps} {...props} ref={ref}><`);
        }
    };

    /** Подменяет fill и fill-opacity именем класса. */
    protected replaceColorsWithClassNames = (src: string, tokenized: ITokenizedIcon, classMap: IClassMap): string => {
        if (!classMap) {
            return src;
        } else if (tokenized.type === 'sc') {
            return src.replace(/fill="(?!none)([^"]+)"(?: fillOpacity="[^"]+")?/g, () => 'className={pathClassName}');
        } /* else {
            return src.replace(
                /fill="(?!none)([^"]+)"(?: fillOpacity="[^"]+")?/g,
                (match, color, opacity) => {
                    const key = opacity ? `${color}${opacity}` : color;
                    return `className="${classMap[key]}"`;
                }
            );
        } */

        return src;
    };

    /** Обворачивает svg в React компонент. */
    private generateSvgComponentCode = (
        {type, componentName, theme, srcName}: ITokenizedIcon,
        transformedSVGs: IIconTransformedSVG[]
    ): string => {
        let comment = '';

        if (srcName in deprecationMap) {
            let newComponentName = '';

            if (deprecationMap[srcName]) {
                const newTokenizedIconName = this.tokenizer.tokenizeIconName(deprecationMap[srcName]);
                if (newTokenizedIconName === null) {
                    throw Error(`Не удалось распарсить имя иконки ${srcName} в deprecationMap.`);
                }
                newComponentName = this.tokenizer.createComponentName(newTokenizedIconName);
            }
            comment = `\n/** @deprecated${newComponentName ? ` use ${newComponentName} instead.` : ''} */`;
        }

        // Есть id, зависящие от значения хука useUniqueId (см. makeInstanceUniqueIds).
        const withUniqueId = transformedSVGs.some(({src}) => src.includes(UNIQUE_ID_MARKER));

        if (type === 'sc') {
            return generateSingleColorIconCode(componentName, transformedSVGs[0].src, comment, withUniqueId);
        } else if (theme === undefined) {
            return generateMultiColorIconWithoutThemeCode(componentName, transformedSVGs[0].src, comment, withUniqueId);
        } else {
            return generateMultiColorIconWithThemeCode(componentName, transformedSVGs, comment, withUniqueId);
        }
    };
}
