import crc32 from 'crc-32';

/**
 * Основная функция для хеширования имени класса.
 * Подчеркивание необходимо, т.к. в CSS имя не может начинаться с цифры.
 */
export const hash = (data: string): string => {
    return '_' + (crc32.str(data) >>> 0).toString(36);
};
