import {IFigmaComponent, IFigmaImagesMap} from '../types';

/** Интерфейс ответа от api figma получения версий файла. */
export interface IFigmaFileVersionsResponse {
    versions: Array<{created_at: string}>;
}

/** Интерфейс ответа от api figma получения компонентов из файла. */
export interface IFigmaComponentsResponse {
    error: boolean;
    status: number;
    meta: {
        components: IFigmaComponent[];
    }
}

/** Интерфейс ответа от api figma получения иконок компонентов. */
export interface IFigmaImagesResponse {
    err: boolean;
    images: IFigmaImagesMap;
}
