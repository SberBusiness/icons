import {EIconAttributes} from './enums';
import {capitalizeFirstLetter} from '../stringUtils';
import {ITokenizedIcon, ITokenizedIconName} from '../../types';
import {singleColorIconNameRegExp, multiColorIconNameRegExp} from './consts';

export class Tokenizer {
    isValid = (name: string): boolean => singleColorIconNameRegExp.test(name) || multiColorIconNameRegExp.test(name);

    /** Токенизирует имя иконки в полноценный объект с описанием. */
    tokenizeIcon = (srcName: string, tokenizedName: ITokenizedIconName): ITokenizedIcon => {
        let componentName = this.createComponentName(tokenizedName);

        return {
            ...tokenizedName,
            srcName,
            componentName
        };
    };

    /** Создаёт токенизированное имя иконки. */
    tokenizeIconName = (name: string): ITokenizedIconName | null => {
        const result = name.match(singleColorIconNameRegExp) || name.match(multiColorIconNameRegExp);

        if (result === null) {
            return null;
        }

        return this.createTokenizedIconName(result);
    };

    /** Создаёт итоговое имя компонента. */
    createComponentName = (tokenizedName: ITokenizedIconName): string => {
        const {type, category, name, style, size} = tokenizedName;
        let componentName = capitalizeFirstLetter(name);

        if (type === 'sc') {
            componentName += `${capitalizeFirstLetter(style)}${capitalizeFirstLetter(category)}Icon${size}`;
        } else {
            componentName += `${capitalizeFirstLetter(category)}Icon${size}`;
        }

        return componentName;
    };

    /** Мапит токены в объект. */
    private createTokenizedIconName = (match: RegExpMatchArray): ITokenizedIconName => ({
        [EIconAttributes.type]: match.groups.type,
        [EIconAttributes.category]: match.groups.category,
        [EIconAttributes.name]: match.groups.name,
        [EIconAttributes.style]: match.groups.style,
        // [EIconAttributes.state]: match.groups.state,
        [EIconAttributes.size]: match.groups.size,
        [EIconAttributes.theme]: match.groups.theme,
    });
}
