/**
 * Меняет первый символ строки на заглавный.
 */
export const capitalize = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);

/**
 * Преобразует kebab-case к camelCase.
 */
export const camelize = (src: string): string =>
    src
        .split('-')
        .map((item, i) => (i !== 0 ? capitalize(item) : item))
        .join('');
