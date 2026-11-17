import crc32 from 'crc-32';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Хеширует строку (CRC32) для имён классов и идентификаторов.
 * Результат состоит только из букв a-z, т.к. в CSS они не могут начинаться с цифры.
 */
export const hash = (data: string): string => {
    let n = crc32.str(data) >>> 0;
    let result = '';

    do {
        result = ALPHABET[n % 26] + result;
        n = Math.floor(n / 26);
    } while (n > 0);

    return result;
};
