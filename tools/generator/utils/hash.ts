/** Алфавит для кодировок в base64. */
const b64a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

/**
 * Преобразует массив байт в base64, используется для создания хэшей для css-классов на основе массива байт.
 * Не добавляет конечные знаки "=", так как для css-хэшей они не нужны.
 *
 * @param ba Входящий массив байт.
 * @returns Base64-представление массива без дополнения конечными знаками "=".
 */
const ba2b64 = (ba: number[]): string => {
    let a = 0,
        b = 0,
        c = 0,
        result = '',
        i = 0,
        n = ba.length,
        m = n % 3;

    n -= m;
    while (i < n) {
        a = ba[i++];
        b = ba[i++];
        c = ba[i++];
        result +=
            b64a[a >> 2] +
            b64a[((a << 4) & 63) | (b >> 4)] +
            b64a[((b << 2) & 63) | (c >> 6)] +
            b64a[c & 63];
    }

    if (m === 1) {
        a = ba[i];
        result +=
            b64a[a >> 2] +
            b64a[(a << 4) & 63]
    } else if (m === 2) {
        a = ba[i++];
        b = ba[i];
        result +=
            b64a[a >> 2] +
            b64a[((a << 4) & 63) | (b >> 4)] +
            b64a[(b << 2) & 63]
    }
    return result;
};

/**
 * Реализация простого и достаточно смешанного алгоритма Adler23. Здесь используется для генерации хэшей css-классов.
 * От SHA отказался, так как от этого SHA-хэша используется только кусок, а Adler32-хэш в шесть символов base64 влезает весь
 * и при этом стоек к коллизиям при длине строки до 256 символов.
 *
 * @param array Массив байт для хэширования.
 * @return Хэш в виде массива байт.
 */
const adler32 = (array: number[]): number[] => {
    let s1 = 1,
        s2 = 0;

    for (let i = 0, l = array.length; i < l; i++) {
        s1 = (s1 + array[i]) % 65521;
        s2 = (s2 + s1) % 65521;
    }

    return [s2 >> 16 & 0xFF, s2 & 0xFF, s1 >> 16 & 0xFF, s1 & 0xFF]
};

/**
 * Функция перевода строки в массив байт (не поддерживает unicode).
 */
const str2ba = (str: string): number[] => {
    let out = [];
    let p = 0;
    for (let i = 0, n = str.length; i < n; i++) {
        out[p++] = str.charCodeAt(i);
    }
    return out;
};

/**
 * Хэширующая функция, используемая для создания base64-хэшей имён классов css.
 */
export const hash = (str: string): string => ba2b64(adler32(str2ba(str)));
