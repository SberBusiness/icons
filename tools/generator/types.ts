import {EIconState} from '../enums';
import {ITokenizedIcon} from '../types';

export interface IParser {
    getIconsRawData: () => Promise<IIconRawData[]>;
}

export interface ITransformer {
    transform: () => Promise<void>;
    getIconsData: () => IIconTransformedData[];
    getStyles: () => string;
}

/**
 * Мапа состояний иконки.
 * Значение хранит в себе массив цветов.
 */
export type TIconState = {
    [key in EIconState]?: string[];
}

/**
 * Интерфейс сырых данных иконки, получаемый от парсера и передаваемый в трансформер.
 */
export interface IIconRawData {
    src: string;
    states: TIconState;
    tokenized: ITokenizedIcon;
}

/**
 * Интерфейс мапы css классов.
 * В качестве ключей выступает хэш цвет, значение - имя css класса.
 */
export interface IClassMap {
    [key: string]: string;
}

/**
 * Интерфейс иконки для промежуточных трансформаций и
 * возвращаемый в качестве готового к генерации объекта иконки.
 */
export interface IIconTransformedData {
    classMap: IClassMap;
    src: string;
    tokenized: ITokenizedIcon;
}

/**
 * Интерфейс css классов. В качестве ключей выступает имя css класса.
 */
export interface IClassNames {
    [key: string]: Array<{
        state: string,
        color: string
    }>;
}
