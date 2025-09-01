import {EIconAttributes} from './enums';

export const possibleTokens = {
    [EIconAttributes.category]: [
        'acc', // Accent
        'ani', // Animated
        'brd', // Brand
        'ill', // Illustrative
        'mrk', // Marketing
        'nav', // Navigation
        'prd', // Product
        'prdx', // Product exclusions
        'srv', // Service
        'srvx', // Service exclusions
        'sts', // Status
    ],
    [EIconAttributes.size]: ['16', '20', '24', '32', '48', '64', '96', '128'],
    [EIconAttributes.state]: ['active', 'default', 'disabled', 'hover'],
    [EIconAttributes.theme]: ['lm', 'dm'],
    [EIconAttributes.style]: ['stroke', 'filled'],
};
