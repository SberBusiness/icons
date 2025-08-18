import {EIconAttributes} from './enums';

export const possibleTokens = {
    [EIconAttributes.category]: [
        // Icons
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
    [EIconAttributes.state]: ['active', 'default', 'disabled', 'hover'],
    [EIconAttributes.size]: ['16', '20', '24', '32', '48', '64', '96', '128'],
    [EIconAttributes.theme]: ['lm', 'dm'],
};
