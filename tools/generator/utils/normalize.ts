import {colorsNames} from 'svgo/plugins/_collections';

export const normalizeFillOpacity = (opacity: string) => {
    if (opacity[0] === "1") {
        return undefined;
    }
    return opacity.replace(/^0\./, '.').replace(/0+$/, '');
}

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
    color.replace(/#[0-9A-F]{3}$/i, (match) => match.replace(/([0-9A-F])/gi, '$1$1'));

/**
 * Нормализует цвета к long hex записи в верхнем регистре.
 *
 * @param color Цвет в именованной или hex записи.
 */
export const normalizeFillColor = (color: string): string => convertShortHex(convertNameToHex(color)).toUpperCase();
