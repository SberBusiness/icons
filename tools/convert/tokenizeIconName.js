const {ucFirst} = require('./ucFirst');

// Разделитель частей в имени файла.
const DEFAULT_TOKEN_SEPARATOR = '_';


// Атрибуты иконки, закодированные в названии.
const ICON_ATTRIBUTES_FROM_NAME = {
    type: 'type',
    category: 'category',
    name: 'name',
    state: 'state',
    size: 'size',
    channel: 'channel',
};

const ICON_ATTRIBUTES_POSSIBLE_VALUES = {};

// Допустимые значения для атрибута "канал"
ICON_ATTRIBUTES_POSSIBLE_VALUES[ICON_ATTRIBUTES_FROM_NAME.channel] = [
    'd', // СББ Desktop
    'w', // SBBOL Web
    'a', // Mobile Android
    'i', // Mobile IOS
];

// Допустимые значения для атрибута "тип иконки"
ICON_ATTRIBUTES_POSSIBLE_VALUES[ICON_ATTRIBUTES_FROM_NAME.type] = [
    'ic', // icons
    'il', // illustration
];

// Допустимые значения для атрибута "Категория"
ICON_ATTRIBUTES_POSSIBLE_VALUES[ICON_ATTRIBUTES_FROM_NAME.category] = [
    // icons
    'acc',  // accent
    'mrk',  // marketing
    'prd',  // product
    'prdx', // product исключения из общего поведения
    'srv',  // service (Служебные иконки)
    'srvx', // service исключения из общего поведения
    'nav',  // Navigation
    'sts',  // Statuses
    'brd',  // Payment System
    'cht',  // Chat
    'ani',  // Animated
    // illustrations
    'scr',  // Screen
    'scrmrkt',  // Screen Market
    'scrsyst',  // Screen System
];

// Допустимые значения для атрибута "размер" (все иконки полагаются квадратными)
ICON_ATTRIBUTES_POSSIBLE_VALUES[ICON_ATTRIBUTES_FROM_NAME.size] = [
    '16',
    '20',
    '24',
    '32',
    '48',
    '64',
    '96',
    '128',
];

// Допустимые значения для атрибута "состояние"
ICON_ATTRIBUTES_POSSIBLE_VALUES[ICON_ATTRIBUTES_FROM_NAME.state] = [
    'disabled',
    'default',
    'active',
    'hover',
];

const TOKENS_REGEX = generateTokensRegex();

/**
 * Формирует регулярное выражение на основе возможных значений токенов.
 *
 * @returns {RegExp}
 */
function generateTokensRegex() {
    const g1 = ICON_ATTRIBUTES_POSSIBLE_VALUES[ICON_ATTRIBUTES_FROM_NAME.type].join('|');
    const g2 = ICON_ATTRIBUTES_POSSIBLE_VALUES[ICON_ATTRIBUTES_FROM_NAME.category].join('|');
    const g3 = ICON_ATTRIBUTES_POSSIBLE_VALUES[ICON_ATTRIBUTES_FROM_NAME.state].join('|');
    const g4 = ICON_ATTRIBUTES_POSSIBLE_VALUES[ICON_ATTRIBUTES_FROM_NAME.size].join('|');
    const g5 = ICON_ATTRIBUTES_POSSIBLE_VALUES[ICON_ATTRIBUTES_FROM_NAME.channel].join('|');

    return new RegExp(`^(${g1})_(${g2})_([0-9a-z]+)_(${g3})?_?(${g4})_(${g5})$`);
}

/**
 * Проверяет имя на валидность.
 *
 * @param {string} name
 * @returns {boolean}
 */
function isNameValid(name) {
    return TOKENS_REGEX.test(name);
}

/**
 * Токенизирует имя иконки.
 *
 * @param {string} iconName Полне имя иконки в формате ic_srv_copy_default_20_w.
 * @param {string} [separator]
 */
function tokenizeIconName(iconName, separator = DEFAULT_TOKEN_SEPARATOR) {
    const match = iconName.match(TOKENS_REGEX);
    if (!match) {
        throw new Error(`Не удалось токенизировать имя иконки ${iconName}.`);
    }

    const iconAttributes = {
        [ICON_ATTRIBUTES_FROM_NAME.type]: match[1],
        [ICON_ATTRIBUTES_FROM_NAME.category]: match[2],
        [ICON_ATTRIBUTES_FROM_NAME.name]: match[3],
        [ICON_ATTRIBUTES_FROM_NAME.state]: match[4],
        [ICON_ATTRIBUTES_FROM_NAME.size]: match[5],
        [ICON_ATTRIBUTES_FROM_NAME.channel]: match[6]
    };

    if (iconAttributes.type === 'ic') {
        if (!iconAttributes.state) {
            throw new Error(`Не удалось токенизировать имя иконки ${iconName}. У иконки должно быть состояние.`);
        }

        /**
         * У иконок в категориях имена уникальные, но между категориями они могут пересекаться, поэтому
         * название категории тоже попадает в конечное наименование
         */
        const mrkExclusionNames = ['certificatebasic', 'certificateexpress', 'certificatequalified'];
        const srvInclusionNames = [
            'nodocs',
            'noletters',
            'nothingfound',
            'carouselright',
            'carouselleft',
            'headerkebab',
            'arrowcircleright',
            'other',
            'plug',
            'truck',
            'notice',
        ];
        const srvxInclusionNames = [
            'sort',
            'sortincrease',
            'sortdecrease',
            'caretdown',
            'caretdownwhite',
            'widgetcarouselleft',
            'widgetcarouselright',
            'replacement',
            'localdelete',
        ];
        const prdInclusionNames = [
            'mail',
            'cash',
            'rub',
            'document',
            'spasibobusiness',
            'cfa',
            'motorpool',
            'orders',
            'staff',
            'exchangecurrency',
            'cargosearch',
            'sberryadom',
            'buyequipment',
            'buyofgoods',
            'buyrealestate',
            'constructionandrepair',
            'businessenvironment',
            'taxfree',
            'notice',
            'furthernotice',
        ];
        const stsInclusionNames = [
            'oninfoerror',
            'oninfowait',
            'oninfowarning',
        ];
        iconAttributes.componentName = (
            (iconAttributes.category === 'mrk' && !mrkExclusionNames.includes(iconAttributes.name)) ||
            (iconAttributes.category.startsWith('srv') && srvInclusionNames.includes(iconAttributes.name)) ||
            (iconAttributes.category === 'srvx' && srvxInclusionNames.includes(iconAttributes.name)) ||
            (iconAttributes.category === 'brd') ||
            (iconAttributes.category === 'acc') ||
            (iconAttributes.category === 'prd' && (prdInclusionNames.includes(iconAttributes.name) || iconAttributes.size === '32')) ||
            (iconAttributes.category === 'prdx') ||
            (iconAttributes.category === 'sts' && stsInclusionNames.includes(iconAttributes.name))
        )
            ? `${ucFirst(iconAttributes.name)}${ucFirst(iconAttributes.category)}Icon${iconAttributes.size}`
            : `${ucFirst(iconAttributes.name)}Icon${iconAttributes.size}`;
    }

    if (iconAttributes.type === 'il') {
        if (iconAttributes.state) {
            throw new Error(`Не удалось токенизировать имя иконки ${iconName}. У иллюстрации не должно быть состояния.`);
        }

        iconAttributes.componentName = `${ucFirst(iconAttributes.name)}${ucFirst(iconAttributes.category)}Illustration${iconAttributes.size}`;
    }

    iconAttributes.iconName = iconName;
    iconAttributes.componentFileName = `${iconAttributes.componentName}.tsx`;

    return iconAttributes;
}

module.exports = {
    isNameValid,
    tokenizeIconName
};
