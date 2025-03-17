const fmix32 = (h: number) => {
    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;

    return h;
};

const rotl32 = (x: number, r: number) => (x << r) | (x >>> (32 - r));

/**
 * Простая и быстрая хеш-функция общего назначения, разработанная Остином Эпплби.
 * Не является криптографически-безопасной, возвращает 32-разрядное беззнаковое число.
 *
 * @param key Строка для хеширования.
 * @param len Длина строки.
 * @param seed Стартовое число.
 * @return Хэш в виде числа.
 */
const murmurhash3 = (key: string, len: number, seed: number) => {
    let h1 = seed;
    let k1: number;

    const c1 = 0xcc9e2d51;
    const c2 = 0x1b873593;

    const remainder = len & 3;
    const bytes = len - remainder;

    let i = 0;

    while (i < bytes) {
        k1 =
            (key.charCodeAt(i++) & 0xff) |
            ((key.charCodeAt(i++) & 0xff) << 8) |
            ((key.charCodeAt(i++) & 0xff) << 16) |
            ((key.charCodeAt(i++) & 0xff) << 24);

        k1 = Math.imul(k1, c1);
        k1 = rotl32(k1, 15);
        k1 = Math.imul(k1, c2);

        h1 ^= k1;
        h1 = rotl32(h1, 13);
        h1 = Math.imul(h1, 5) + 0xe6546b64;
    }

    k1 = 0;

    switch (remainder) {
        case 3:
            k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        case 2:
            k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1:
            k1 ^= key.charCodeAt(i) & 0xff;

            k1 = Math.imul(k1, c1);
            k1 = rotl32(k1, 15);
            k1 = Math.imul(k1, c2);
            h1 ^= k1;
    }

    h1 ^= len;

    h1 = fmix32(h1);

    return h1 >>> 0;
};

/**
 * Основная функция для хеширования имени класса.
 * Подчеркивание необходимо, т.к. в CSS имя не может начинаться с цифры.
 */
export const hash = (key: string, seed = 0): string => {
    return '_' + murmurhash3(key, key.length, seed).toString(36);
};
