/**
 * Реализация matchAll.
 */
export const matchAll = (str: string, re: RegExp): string[] => {
    const result = [];
    let match = re.exec(str);
    while (match) {
        result.push(match);
        match = re.exec(str);
    }
    return result;
};
