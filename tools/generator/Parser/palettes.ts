import { EIconState, EIconTheme } from "../../enums";
import ICON_COLOR_MAP, { EColorPaletteName } from "./colors";

const ICON_FILL_PALETTES = [
    // 0
    {
        [EIconTheme.lm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.BRAND][40],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.BRAND][50],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.BRAND][30],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.DARK_NEUTRAL_ALPHA][90],
        },
        [EIconTheme.dm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.BRAND][60],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.BRAND][70],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.BRAND][40],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][90],
        },
    },
    // 1
    {
        [EIconTheme.lm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.ERROR][40],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.ERROR][50],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.ERROR][30],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.DARK_NEUTRAL_ALPHA][90],
        },
        [EIconTheme.dm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.ERROR][60],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.ERROR][70],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.ERROR][40],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][90],
        },
    },
    // 2
    {
        [EIconTheme.lm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.WARNING][40],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.WARNING][40],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.ERROR][40],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.DARK_NEUTRAL_ALPHA][90],
        },
        [EIconTheme.dm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.WARNING][60],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.WARNING][60],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.WARNING][60],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][90],
        },
    },
    // 3
    {
        [EIconTheme.lm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.INFO][40],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.INFO][40],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.INFO][40],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.DARK_NEUTRAL_ALPHA][90],
        },
        [EIconTheme.dm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.INFO][60],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.INFO][60],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.INFO][60],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][90],
        },
    },
    // 4
    {
        [EIconTheme.lm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.SYSTEM][40],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.SYSTEM][40],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.SYSTEM][40],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.DARK_NEUTRAL_ALPHA][90],
        },
        [EIconTheme.dm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.SYSTEM][60],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.SYSTEM][60],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.SYSTEM][60],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][90],
        },
    },
    // 5
    {
        [EIconTheme.lm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.DARK_NEUTRAL_ALPHA][60],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.DARK_NEUTRAL_ALPHA][0],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.DARK_NEUTRAL_ALPHA][0],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.DARK_NEUTRAL_ALPHA][90],
        },
        [EIconTheme.dm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][70],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][0],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][0],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][90],
        },
    },
    // 6
    {
        [EIconTheme.lm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][70],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][0],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][0],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][90],
        },
        [EIconTheme.dm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.DARK_NEUTRAL_ALPHA][60],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.DARK_NEUTRAL_ALPHA][0],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.DARK_NEUTRAL_ALPHA][0],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.DARK_NEUTRAL_ALPHA][90],
        },
    },
    // 7
    {
        [EIconTheme.lm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][0],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][0],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][0],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.DARK_NEUTRAL_ALPHA][90],
        },
        [EIconTheme.dm]: {
            [EIconState.default]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][0],
            [EIconState.hover]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][0],
            [EIconState.active]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][0],
            [EIconState.disabled]: ICON_COLOR_MAP[EColorPaletteName.NEUTRAL_ALPHA][90],
        },
    },
];

export default ICON_FILL_PALETTES;
