var {PRIMARY_FILL_COLORS, SECONDARY_FILL_COLORS, LINK_FILL_COLORS} = require('../consts');

/**
 * Заменить fill=#HEX на соотвествующий className.
 *
 * @param {string} src Строка свг.
 * @param tokenized
 */
function replaceColorsWithClassNames(src, tokenized) {
    const {type, name, category} = tokenized;

    if (type === 'il') {
        return src;
    }

    return src.replace(/fill="#[0-9a-fA-F]{3,6}"/g, function(match) {
        var colorHex = match.split("=").pop().replace(/"/g, "").toUpperCase();

        /**
         * Так как статусные и маркетинговые иконки статичны, сейчас нет смысла добавлять им какой-то класс,
         * при будущей автогенерации классов эта конструкция пропадет.
         * TODO убрать исключения при автогенерации
         */
        if (category === 'prd') {
            return "className=\"product-fill\"";
        }
        if (category === 'prdx' && name === 'shop') {
            return "className=\"shop-fill\"";
        }
        if (category === 'srvx') {
            if (name === 'headerkebab') {
                return "className=\"headerkebab-fill\"";
            }
            if (name === 'sortincrease' || name === 'sortdecrease') {
                return "className=\"sort-fill\"";
            }
            if (name === 'caretdown') {
                return "className=\"caretdown-fill\"";
            }
            if (name === 'caretleft' || name === 'caretright') {
                return "className=\"primary-fill caretside-fill\"";
            }
            if (name.startsWith('widgetcarousel') && colorHex === '#565B62') {
                return "className=\"widgetcarousel-fill\"";
            }
            if (name === 'replacement') {
                return "className=\"replacement-fill\"";
            }
            if (name === 'localdelete') {
                return "className=\"localdelete-fill\"";
            }
            return match;
        }
        if (category === 'mrk' || category === 'ani' || category === 'brd' || category === 'acc') {
            return match;
        }
        if (category === 'sts') {
            if (colorHex === '#1F1F22' && name === 'offerlike') {
                return "className=\"offerlike-fill\"";
            }
            if (colorHex === '#1F1F22' && name === 'offerdislike') {
                return "className=\"offerdislike-fill\"";
            }
            // deprecated primary-fill
            if (colorHex === '#B2B8BF' && (name === 'like')) {
                return "className=\"primary-fill like-fill\"";
            }
            // deprecated primary-fill
            if (colorHex === '#B2B8BF' && (name === 'dislike')) {
                return "className=\"primary-fill dislike-fill\"";
            }
            return match;
        }
        if (category === 'nav' && (name === 'paginatorleft' || name === 'paginatorright')) {
            if (colorHex === '#565B62' ) {
                return "className=\"paginator-primary-fill\"";
            } else if (colorHex === '#F2F4F7' ) {
                return "className=\"paginator-secondary-fill\"";
            } else {
                throw new Error(`Найден неописанный цвет для fill - ${colorHex}.\nВся строка - ${src}`);
            }
        }

        if (PRIMARY_FILL_COLORS.includes(colorHex)) {
            return "className=\"primary-fill\"";
        } else if (SECONDARY_FILL_COLORS.includes(colorHex)) {
            return "className=\"secondary-fill\"";
        } else if (LINK_FILL_COLORS.includes(colorHex)) {
            return "className=\"link-fill\"";
        } else {
            throw new Error(`Найден неописанный цвет для fill - ${colorHex}.\nВся строка - ${src}`);
        }
    });
}

module.exports = {
    replaceColorsWithClassNames: replaceColorsWithClassNames
};

