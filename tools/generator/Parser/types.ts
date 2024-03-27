import {IIconRawData} from '../types';
import {DeepPartial} from '../../types';

/**
 * Интефрейс для промежуточного сбора данных об иконках.
 * В качестве ключей выступает уникальное имя будущего компонента иконки.
 */
export interface IIconsRawDataMap {
    [key: string]: DeepPartial<IIconRawData>;
}
