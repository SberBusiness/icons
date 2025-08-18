import {EIconTheme} from 'enums';
import {IClassMap} from 'generator/types';
import {ITokenizedIcon} from 'types';

/**
 * Интерфейс отдельной темы иконки для промежуточных трансформаций.
 */
export interface IIconTransitionDataTheme {
    theme: EIconTheme;
    src: string;
    classMap: IClassMap;
}

/**
 * Интерфейс иконки для промежуточных трансформаций.
 */
export interface IIconTransitionData {
    tokenized: ITokenizedIcon;
    themes: Array<IIconTransitionDataTheme>;
}

/**
 * Интерфейс иконки с трансформированным SVG.
 */
export interface IIconTransformedSVG {
    theme: EIconTheme;
    src: string;
}
