import {IIconRawData} from '../types';

// TODO вынести в утилитарные типы
type DeepPartial<T> = T extends object ? {
    [K in keyof T]?: DeepPartial<T[K]>
} : T;

/**
 * Интефрейс для промежуточного сбора данных об иконках.
 * В качестве ключей выступает уникальное имя будущего компонента иконки.
 */
export interface IIconsRawDataMap {
    [key: string]: DeepPartial<IIconRawData>;
}
