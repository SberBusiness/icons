import { EIconTheme } from "enums";
import { IClassMap } from "generator/types";
import { ITokenizedIcon } from "types";

/**
 * Интерфейс иконки для промежуточных трансформаций.
 */
export interface IIconTransitionData {
    tokenized: ITokenizedIcon;
    themes: Array<{
        themeName: EIconTheme;
        src: string;
        classMap: IClassMap;
    }>
}
