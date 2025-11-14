import { EIconCategory } from '../../enums';
import {EIconAttributes} from './enums';

const possibleTokens = {
    [EIconAttributes.category]: Object.keys(EIconCategory),
    [EIconAttributes.style]: ['stroke', 'filled', 'other'],
    // [EIconAttributes.state]: ['active', 'default', 'disabled', 'hover'],
    [EIconAttributes.size]: ['16', '20', '24', '32', '48', '64', '84', '96', '128'],
    [EIconAttributes.theme]: ['lm', 'dm'],
};

const g1 = possibleTokens[EIconAttributes.category].join('|');
const g2 = possibleTokens[EIconAttributes.style].join('|');
// const g3 = possibleTokens[EIconAttributes.state].join('|');
const g4 = possibleTokens[EIconAttributes.size].join('|');
const g5 = possibleTokens[EIconAttributes.theme].join('|');

// export const legacyIconNameRegExp = new RegExp(
//     `^ic_(${g1})_([0-9a-zA-Z]+)_(${g3})_(${g4})_(${g5})_w$`
// );

export const singleColorIconNameRegExp = new RegExp(
    `^(?<type>sc)_(?<category>${g1})_(?<name>[0-9a-zA-Z]+)_(?<style>${g2})_(?<size>${g4})$`,
);

export const multiColorIconNameRegExp = new RegExp(
    `^(?<type>mc)_(?<category>${g1})_(?<name>[0-9a-zA-Z]+)_(?<size>${g4})(_(?<theme>${g5}))?$`
);
