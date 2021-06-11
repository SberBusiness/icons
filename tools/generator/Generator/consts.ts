/**
 * Содержимое будущего файла model.ts.
 */
export const modelSrc =
`/**
 * @prop {string} [className]
 * @prop {string} [data-test-id]
 * @prop {never} [style] Инлайн-стили запрещены.
 * @prop {boolean} [table] Включение табличного поведения иконки с двойным ховером.
 */
export interface IIconProps {
    className?: string;
    'data-test-id'?: string;
    style?: never;
    table?: boolean;
}
`;
