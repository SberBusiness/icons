export interface IFigmaService {
    getFigmaFileUpdateDate: () => Promise<string>;
    getFigmaComponents: () => Promise<IFigmaComponent[]>;
    getFigmaImagesUrls: (ids: string) => Promise<IFigmaImagesMap>;
    getIconSrc: (url: string) => Promise<string>;
}

/**
 * Интерфейс figma компонента.
 */
export interface IFigmaComponent {
    node_id: string,
    name: string,
    description: string,
    created_at: string,
    updated_at: string,
}

/**
 * Интерфейс данных иконки.
 */
export interface IIconData {
    category: string,
    fileName: string,
    src: string,
}

/**
 * Интерфейс мапы id компонентов и ссылок на иконки этих компонентов.
 */
export interface IFigmaImagesMap {
    [key: string]: string;
}
