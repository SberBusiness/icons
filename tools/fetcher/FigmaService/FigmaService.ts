// FigmaService.ts - отвечает только за взаимодействие с API Figma
import axios, { AxiosInstance } from 'axios';
import https from 'https';
import { IFigmaComponentsResponse, IFigmaFileVersionsResponse, IFigmaImagesResponse } from './types';
import { IFigmaComponent, IFigmaImagesMap } from '../types';

export class FigmaService {
    private readonly api: AxiosInstance;

    constructor(private readonly token: string, private readonly fileKey: string) {
        this.api = axios.create({
            baseURL: 'https://api.figma.com/',
            headers: { 'X-FIGMA-TOKEN': token },
            httpsAgent: new https.Agent({ keepAlive: true }),
        });
    }

    async getFileUpdateDate(): Promise<Date> {
        const res = await this.request<IFigmaFileVersionsResponse>(`/v1/files/${this.fileKey}/versions`);
        return new Date(res.versions[0].created_at);
    }

    async getComponents(): Promise<IFigmaComponent[]> {
        const res = await this.request<IFigmaComponentsResponse>(`/v1/files/${this.fileKey}/components`);
        if (res.error || res.status !== 200) {
            throw new Error(`Figma API error, status ${res.status}`);
        }
        return res.meta.components;
    }

    async getImagesUrls(ids: string[], format = 'svg'): Promise<IFigmaImagesMap> {
        const idsParam = ids.join(',');
        const res = await this.request<IFigmaImagesResponse>(
            `/v1/images/${this.fileKey}?ids=${idsParam}&format=${format}`
        );
        if (res.err) {
            throw new Error('Figma images API error');
        }
        return res.images;
    }

    async downloadImage(url: string): Promise<string> {
        return this.request(url, { responseType: 'text' });
    }

    private async request<T>(url: string, config?: any): Promise<T> {
        const retries = 3;
        for (let i = 0; i < retries; i++) {
            try {
                const response = await this.api.get(url, config);
                return response.data;
            } catch (error) {
                if (i < retries - 1) {
                    await this.delay(1000 * (i + 1));
                    continue;
                }
                throw new Error(`Request failed after ${retries} attempts: ${error.message}`);
            }
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
