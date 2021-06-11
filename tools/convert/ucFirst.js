/**
 * Преобразует строку к написанию с заглавной буквы.
 */
function ucFirst(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}

module.exports = {
    ucFirst
};
