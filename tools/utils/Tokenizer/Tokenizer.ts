import {possibleTokens} from './consts';
import {EIconAttributes} from './enums';
import {capitalize} from '../stringUtils';
import {ITokenizedIcon, ITokenizedIconName} from '../../types';

/** Собирает регулярное выражение имени иконки. */
const generateTokensRegexOld = (): RegExp => {
    const g1 = possibleTokens[EIconAttributes.category].join('|');
    const g2 = possibleTokens[EIconAttributes.state].join('|');
    const g3 = possibleTokens[EIconAttributes.size].join('|');
    const g4 = possibleTokens[EIconAttributes.theme].join('|');

    return new RegExp(
        `^(?<type>ic)_(?<category>${g1})_(?<name>[0-9a-zA-Z]+)_(?<state>${g2})_(?<size>${g3})_(?<theme>${g4})$`
    );
};

/** Собирает регулярное выражение имени иконки. */
const generateTokensRegexNew = (): RegExp => {
    const g1 = possibleTokens[EIconAttributes.category].join('|');
    const g2 = possibleTokens[EIconAttributes.style].join('|');
    const g3 = possibleTokens[EIconAttributes.size].join('|');

    return new RegExp(
        `^(?<type>sc)_(?<category>${g1})_(?<name>[0-9a-zA-Z]+)_(?<style>${g2})_(?<size>${g3})$`
    );
};

// /** Собирает регулярное выражение имени иконки. */
// const generateTokensRegexes = (): RegExp[] => {
//     const g1 = possibleTokens[EIconAttributes.category].join('|');
//     const g2 = possibleTokens[EIconAttributes.state].join('|');
//     const g3 = possibleTokens[EIconAttributes.size].join('|');
//     const g4 = possibleTokens[EIconAttributes.theme].join('|');

//     return [
//         new RegExp(
//             `^(?<type>ic)_(?<category>${g1})_(?<name>[0-9a-zA-Z]+)_(?<state>${g2})_(?<size>${g3})_(?<theme>${g4})$`
//         ),
//         new RegExp(
//             `^(?<type>il)_(?<category>${g1})_(?<name>[0-9a-zA-Z]+)_(?<size>${g3})_(?<theme>${g4})$`
//         ),
//     ];
// };

export class Tokenizer {
    static readonly tokensRegexOld = generateTokensRegexOld();
    static readonly tokensRegexNew = generateTokensRegexNew();

    isValid = (name: string): boolean => Tokenizer.tokensRegexOld.test(name) || Tokenizer.tokensRegexNew.test(name);

    /**
     * Токенизирует имя иконки в полноценный объект с описанием.
     */
    tokenize = (iconSrcName: string): ITokenizedIcon => {
        const match = this.matchRegex(iconSrcName);
        const tokenizedIconName = this.mapIconTokens(match);

        const iconType = 'icon';
        let componentName = "";
        const srcName = iconSrcName;

        if (tokenizedIconName.type === 'ic') {
            componentName = `${capitalize(tokenizedIconName.name)}${capitalize(tokenizedIconName.category)}${capitalize(iconType)}${tokenizedIconName.size}`;
        } else {
            componentName = `${capitalize(tokenizedIconName.name)}${capitalize(tokenizedIconName.style)}${capitalize(tokenizedIconName.category)}${capitalize(iconType)}${tokenizedIconName.size}`;
        }

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
        const match = iconSrcName.match(Tokenizer.tokensRegexOld) || iconSrcName.match(Tokenizer.tokensRegexNew);

        if (!match) {
            throw new Error(`Не удалось токенизировать имя иконки ${iconSrcName}.`);
        }
        return match;
    };

    /**
     * Мапит токены в объект.
     */
    private mapIconTokens = (match: RegExpMatchArray): ITokenizedIconName => ({
        [EIconAttributes.type]: match.groups.type,
        [EIconAttributes.category]: match.groups.category,
        [EIconAttributes.name]: match.groups.name,
        [EIconAttributes.size]: match.groups.size,
        [EIconAttributes.state]: match.groups.state,
        [EIconAttributes.theme]: match.groups.theme,
        [EIconAttributes.style]: match.groups.style,
    });
}
