import {possibleTokens} from './consts';
import {EIconAttributes} from './enums';
import {capitalize} from '../stringUtils';
import {EIconState, EIconType, EIconTypeName} from '../../enums';
import {ITokenizedIcon, ITokenizedIconName} from '../../types';

/**
 * Собирает регулярное выражение имени иконки.
 */
const generateTokensRegex = () => {
    const g1 = `${EIconType.ic}|${EIconType.il}`;
    const g2 = possibleTokens[EIconAttributes.category].join('|');
    const g3 = possibleTokens[EIconAttributes.state].join('|');
    const g4 = possibleTokens[EIconAttributes.size].join('|');
    const g5 = possibleTokens[EIconAttributes.channel].join('|');

    return new RegExp(`^(${g1})_(${g2})_([0-9a-z]+)_(?:(?<=${EIconType.ic}.*)(${g3})_|(?<=${EIconType.il}.*))(${g4})_(${g5})$`);
};

export class Tokenizer {
    static readonly tokensRegex = generateTokensRegex();

    isValid = (name: string): boolean => Tokenizer.tokensRegex.test(name);

    /**
     * Токенизирует имя иконки в полноценный объект с описанием.
     */
    tokenize = (iconSrcName: string): ITokenizedIcon => {
        const match = this.matchRegex(iconSrcName);
        const tokenizedIconName = this.mapIconTokens(match);

        // У иллюстраций в имени не указывается состояние, добавляем.
        if (tokenizedIconName.type === EIconType.il) {
            tokenizedIconName.state = EIconState.default;
        }

        const iconType = EIconTypeName[tokenizedIconName.type];
        const componentName = `${capitalize(tokenizedIconName.name)}${capitalize(tokenizedIconName.category)}${capitalize(iconType)}${tokenizedIconName.size}`;
        const srcName = iconSrcName;

        return {
            ...tokenizedIconName,
            componentName,
            srcName,
        };
    };

    /**
     * Разбивает имя иконки на токены по регулярке.
     */
    private matchRegex = (iconSrcName: string): RegExpMatchArray => {
        const match = iconSrcName.match(Tokenizer.tokensRegex);
        if (!match) {
            throw new Error(`Не удалось токенизировать имя иконки ${iconSrcName}.`);
        }
        return match;
    };

    /**
     * Мапит токены в объект.
     */
    private mapIconTokens = (match: RegExpMatchArray): ITokenizedIconName => ({
        [EIconAttributes.type]: match[1],
        [EIconAttributes.category]: match[2],
        [EIconAttributes.name]: match[3],
        [EIconAttributes.state]: match[4],
        [EIconAttributes.size]: match[5],
        [EIconAttributes.channel]: match[6]
    });
}
