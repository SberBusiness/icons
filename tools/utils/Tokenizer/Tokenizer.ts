import {possibleTokens} from './consts';
import {EIconAttributes} from './enums';
import {capitalize} from '../stringUtils';
import {ITokenizedIcon, ITokenizedIconName} from '../../types';

/**
 * Собирает регулярное выражение имени иконки.
 */
const generateTokensRegex = () => {
    const g1 = possibleTokens[EIconAttributes.category].join('|');
    const g2 = possibleTokens[EIconAttributes.state].join('|');
    const g3 = possibleTokens[EIconAttributes.size].join('|');
    const g4 = possibleTokens[EIconAttributes.theme].join('|');

    return new RegExp(
        `^ic_(${g1})_([0-9a-zA-Z]+)_(${g2})_(${g3})_(${g4})$`
    );
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

        const iconType = 'icon';
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
        [EIconAttributes.category]: match[1],
        [EIconAttributes.name]: match[2],
        [EIconAttributes.state]: match[3],
        [EIconAttributes.size]: match[4],
        [EIconAttributes.theme]: match[5],
    });
}
