/** Меняет первый символ строки на заглавный. */
export const capitalizeFirstLetter = (str: string) => {
    if (str.length === 0) {
        return str;
    } else {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

/** Преобразует kebab-case к camelCase. */
export const camelize = (src: string): string =>
    src
        .split('-')
        .map((item, i) => (i !== 0 ? capitalizeFirstLetter(item) : item))
        .join('');
