export enum ETarget {
    icons = 'icons',
    illustrations = 'illustrations'
}

/** Получает из process.env параметр целевого модуля. */
export const getTarget = () => {
    const target = process.env.TARGET as ETarget;
    if (!(target in ETarget)) {
        throw new Error('Не указана или неверно указана целевая библиотека.');
    }
    return target;
};
