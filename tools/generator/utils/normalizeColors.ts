import {colorsNames} from 'svgo/plugins/_collections';

/**
 * Преобразует цвета в именованной записи к hex значению.
 *
 * @param color Цвет в именованной записи, например "white".
 */
const convertNameToHex = (color: string): string => colorsNames[color] || color;

/**
 * Преобразует short hex в long hex.
 *
 * @param color Цвет в short hex записи, например "#fff".
 */
const convertShortHex = (color: string): string =>
    color.replace(/#[0-9A-F]{3}$/i, match => match.replace(/([0-9A-F])/gi,'$1$1'));

/**
 * Нормализует цвета к long hex записи в верхнем регистре.
 *
 * @param color Цвет в именованной или hex записи.
 */
export const normalizeColor = (color: string): string => convertShortHex(convertNameToHex(color)).toUpperCase();
