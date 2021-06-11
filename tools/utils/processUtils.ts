/** Получает из process параметр целевого модуля. */
export const getTarget = (argv: string[]): string => {
    const commands = ['icons', 'illustrations'];
    const target = argv[2];
    if (!commands.includes(target)) {
        throw new Error('Не указана целевая библиотека.');
    }
    return target;
};
