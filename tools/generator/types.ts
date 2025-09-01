import {EIconState, EIconTheme} from '../enums';
import {ITokenizedIcon} from '../types';

export interface IParser {
    getIconsRawData: () => Promise<IIconRawData[]>;
}

export interface ITransformer {
    transform: () => Promise<void>;
    getIconsData: () => IIconTransformedData[];
    getPaletteClasses: () => any;
    getStyles: () => string;
}

/**
 * Свойства заливки.
 * Включает в себя цвет и прозрачность.
 */
export interface IFillProps {
    color: string;
    opacity?: string;
}

/**
 * Мапа состояний иконки.
 * Значение хранит в себе массив свойств заливки.
 */
export type TIconState = {
    [key in EIconState]?: IFillProps[];
};

/**
 * Интерфейс сырых данных иконки, получаемый от парсера и передаваемый в трансформер.
 */
export interface IIconRawData {
    tokenized: ITokenizedIcon;
    themes: {
        [theme in EIconTheme]: {
            src: string;
            states: TIconState;
        };
    };
}

/**
 * Интерфейс мапы css классов.
 * В качестве ключей выступает хэш цвет, значение - имя css класса.
 */
export interface IClassMap {
    [key: string]: string;
}

/**
 * Интерфейс иконки готовой к генерации.
 */
export interface IIconTransformedData {
    tokenized: ITokenizedIcon;
    /** Содержимое готового React компонента иконки */
    src: string;
}

export interface IIconFill {
    color: string;
    opacity?: string;
}

/**
 * Интерфейс css классов. В качестве ключей выступает имя css класса.
 */
export interface IClassNames {
    [key: string]: Array<{
        state: string;
        color: string;
        opacity?: string;
    }>;
}
