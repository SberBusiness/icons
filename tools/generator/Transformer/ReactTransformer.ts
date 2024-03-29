import SVGO from 'svgo';
import {initialStyles, mapSelectors, selectorsOrder, SVGOConfig} from './consts';
import {getPackageVersion} from './utils/getPackageVersion';
import {IClassNames, IIconRawData, IIconTransformedData, IParser, ITransformer} from '../types';
import {hash} from '../utils/hash';
import {deprecationMap} from '../../deprecationMap';
import {EIconState, EIconType} from '../../enums';
import {camelize} from '../../utils/stringUtils';
import {Tokenizer} from '../../utils/Tokenizer/Tokenizer';

/**
 * Трансформер получает в себя инстанс парсера, от которого в дальнейшем получает
 * сырую коллекцию иконок, трансформирует её в react компоненты, попутно собирая коллекцию стилей.
 */
export class ReactTransformer implements ITransformer {
    private readonly tokenizer = new Tokenizer();
    private iconsTransformedData: IIconTransformedData[];
    private classNames: IClassNames = {};

    constructor(private readonly parser: IParser) {}

    transform = async (): Promise<void> => {
        const iconsRawData = await this.parser.getIconsRawData();
        this.iconsTransformedData = this.collectClassNames(iconsRawData);
        this.iconsTransformedData = await Promise.all(this.iconsTransformedData.map(this.transformIcon));
    };

    getIconsData = () => this.iconsTransformedData;

    /** Возвращает css стили. */
    getStyles = (): string => {
        const mappedStyles = Object.keys(this.classNames).map(
            (className) =>
                this.classNames[className].map(({state, color}) => ({
                    state: state as EIconState,
                    style: `${mapSelectors[state](className)} { fill: ${color}; }`
                }))
        );

        // Преобразует массив с массивами в плоский массив
        const flatMappedStyles = mappedStyles.reduce((acc, arr) => acc.concat(arr), []);

        const flatMappedStylesWithInitial = initialStyles.concat(flatMappedStyles);

        return selectorsOrder.map(state => {
            const styles = flatMappedStylesWithInitial.filter(mappedStyle => mappedStyle.state === state).map(mappedStyle => mappedStyle.style).join(' ');

            if (state === EIconState.hover) {
                return this.wrapHoverStyles(styles);
            }

            return styles;
        }).join(' ');
    };

    private wrapHoverStyles = (styles) =>
        `@media (hover: hover) and (pointer: fine), only screen and (-ms-high-contrast:active), (-ms-high-contrast:none) { ${styles} }`;

    /**
     * Перебирает данные иконок, добавляет мапу соответсвия цветов к css классу.
     * Как сайд-эффект собирает мапу classNames.
     *
     * @param iconsRawData Данные об иконках от парсера.
     */
    private collectClassNames = (iconsRawData: IIconRawData[]): IIconTransformedData[] => {
        return iconsRawData.map(({src, states, tokenized}) => {
            const iconStates = Object.keys(states).sort();
            let classMap;

            if (iconStates.length > 1) {
                classMap = {};
                const paths = states[EIconState.default].length;
                for (let i = 0; i < paths; ++i) {
                    const strForHash = iconStates.reduce(
                        (str, state) => str + state + states[state][i],
                        ''
                    );

                    const version = getPackageVersion();

                    const className = hash(version + strForHash);
                    if (!this.classNames[className]) {
                        this.classNames[className] = iconStates.map(state => ({
                            state,
                            color: states[state][i]
                        }));
                    }

                    const hex = states[EIconState.default][i];
                    classMap[hex] = className;
                }
            }

            return {
                classMap,
                src,
                tokenized,
            };
        });
    };

    /**
     * Трансформирует содержимое svg иконки от исходного состояния до готового к генерации.
     *
     * @param iconData
     */
    private transformIcon = async (iconData: IIconTransformedData): Promise<IIconTransformedData> => {
        const src = await this.transformSVG(iconData);
        return {
            ...iconData,
            src
        }
    };

    /**
     * Трансформирует svg к React компоненту.
     */
    protected transformSVG = async (iconData: IIconTransformedData): Promise<string> => {
        const optimizedSrc = await this.optimizeSVG(iconData.src);
        return [
            this.reactifyAttrs,
            this.reactifyInlineStyles,
            this.makeUniqueIds,
            this.insertDimensions,
            this.insertClassName,
            this.insertExtra,
            this.replaceColorsWithClassNames,
            this.generateSvgComponentCode,
        ].reduce((memo, transformer) =>
            transformer(memo, iconData), optimizedSrc);
    };

    /**
     * Оптимизирует и минифицирует svg библиотекой SVGO.
     */
    protected optimizeSVG = async (src: string): Promise<string> => {
        const svgo = new SVGO(SVGOConfig);
        return (await svgo.optimize(src)).data;
    };

    /**
     * Преобразует атрибуты к react-нотации.
     */
    private reactifyAttrs = (src: string): string => src.replace(/([a-zA-Z\-]+=)/gim, camelize);

    /**
     * Преобразует инлайн стили к объекту.
     */
    private reactifyInlineStyles = (src: string): string => src.replace(
        /style="(.*?)"/g,
        (match, styles) => `style={{${
            styles
                .split(';')
                .map(style => style.replace(/(.*?):\s*(.*)/, (m, prop, value) => `${camelize(prop)}: '${value}'`))
                .join(',')
        }}}`);

    /**
     * Приводит id к уникальным значениям.
     */
    protected makeUniqueIds = (src: string, {tokenized: {name}}: IIconTransformedData): string => {
        const matches = src.match(/id="(.*?)"/g);

        if (Array.isArray(matches)) {
            return matches
                .map((match) => match.split('=').pop().replace(/"/g, ''))
                .reduce(
                    (src, id) =>
                        src
                            .replace(new RegExp(`id="${id}"`, 'gim'), `id="${id}_${name}"`)
                            .replace(new RegExp(`(?:^|\\W)#${id}(?:$|\\W)`, 'g'), `(#${id}_${name})`)
                    , src);
        } else {
            return src;
        }
    };

    /**
     *  Добавляет атрибуты высоты и ширины.
     */
    protected insertDimensions = (src: string, {tokenized: {size}}: IIconTransformedData): string =>
        src.replace('<svg', `<svg width="${size}" height="${size}"`);


    /**
     *  Добавляет класс компонента.
     */
    private insertClassName = (src: string, {tokenized: {type}}: IIconTransformedData): string => {
        const tableIconClassName = type === EIconType.ic ? `\${props.table ? 'table-icon ' : ''}` : '';
        return src.replace('><', ` className={\`${tableIconClassName}\${props.className || ''}\`}><`);
    };

    /**
     *  Добавляет data-test-id и название компонента.
     *  Также добавляет focusable="false" для фикса фокуса по svg в ie.
     *  Добавляет aria-hidden="true".
     */
    private insertExtra = (src: string, {tokenized: {componentName}}: IIconTransformedData): string =>
        src.replace(
            '><',
            ` data-test-id={props['data-test-id']} name="${componentName}" focusable="false" aria-hidden="true"><`
        );

    /**
     * Подменяет hex цвета именами классов.
     */
    protected replaceColorsWithClassNames = (src: string, {
        classMap,
        tokenized: {category}
    }: IIconTransformedData): string =>
        classMap
            ? src.replace(/fill="(#[A-F0-9]{6})"/g, (match, hex) => `className="${classMap[hex]}${category === 'srv' ? ' service-fill' : ''}"`)
            : src;

    /**
     * Обворачивает svg в React компонент.
     */
    private generateSvgComponentCode = (src: string, {
        tokenized: {
            componentName,
            srcName
        }
    }: IIconTransformedData): string => {
        let comment = '';
        if (srcName in deprecationMap) {
            const replacementComponent = deprecationMap[srcName] && this.tokenizer.tokenize(deprecationMap[srcName]).componentName;
            comment = `
/**
 * @deprecated${replacementComponent ? ` use ${replacementComponent}` : ''}
 */`;
        }

        return `import * as React from 'react';
import {IIconProps} from './models';
${comment}
export function ${componentName}(props: IIconProps) {
    return (
        ${src}
    );
}
`;
    };
}
