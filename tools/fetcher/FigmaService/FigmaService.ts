import axios from 'axios';
import axiosRetry from 'axios-retry';
import https from 'https';
import {IFigmaComponentsResponse, IFigmaFileVersionsResponse, IFigmaImagesResponse} from './types';
import {IFigmaComponent, IFigmaImagesMap, IFigmaService} from '../types';
import {figmaToken, figmaIconsFileKey} from '../../consts';

axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay
});

const apiUrl = 'https://api.figma.com/';

export class FigmaService implements IFigmaService {
    private readonly api;

    constructor() {
        this.api = axios.create({
            baseURL: apiUrl,
            timeout: 15 * 1000,
            headers: {'X-FIGMA-TOKEN': figmaToken},
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
    }

    /**
     * Получает дату обновления файла figma.
     */
    getFigmaFileUpdateDate = async (): Promise<string> => {
        const res = await this.get<IFigmaFileVersionsResponse>(`/v1/files/${figmaIconsFileKey}/versions`);
        return res.versions[0].created_at;
    };

    /**
     * Получает список компонентов из файла figma.
     */
    getFigmaComponents = async (): Promise<IFigmaComponent[]> => {
        const res = await this.get<IFigmaComponentsResponse>(`/v1/files/${figmaIconsFileKey}/components`);
        if (res.error || res.status !== 200) {
            throw new Error(`Ошибка в ответе от figma get component api, статус ${res.status}.`);
        }
        return res.meta.components;
    };

    /**
     * Получает список ссылок на иконки компонентов figma.
     *
     * @param ids Строка перечисленных через запятую id компонентов.
     * @param format Формат картинки.
     */
    getFigmaImagesUrls = async (ids: string, format = 'svg'): Promise<IFigmaImagesMap> => {
        const res = await this.get<IFigmaImagesResponse>(`/v1/images/${figmaIconsFileKey}?ids=${ids}&format=${format}`);
        if (res.err) {
            throw new Error(`Ошибка в ответе от figma get image api.`);
        }
        return res.images;
    };

    /**
     * Получает контент иконки (svg, png, jpg, gif) по ссылке.
     *
     * @param url
     */
    getIconSrc = async (url: string): Promise<string> => this.get(url);

    private get = <T>(url: string): Promise<T> =>
        this.api.get(url)
            .then(res => res.data)
            .catch(e => {
                throw new Error(`Ошибка запроса: ${e.message}`)
            });
}
