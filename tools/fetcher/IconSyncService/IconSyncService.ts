// IconSyncService.ts - основной сервис синхронизации
import pLimit from 'p-limit';
import { IFigmaComponent, IIconData } from '../types';
import { FigmaService } from '../FigmaService/FigmaService';
import { IconStorageService, SyncResult } from '../IconStorageService/IconStorageService';
import { Tokenizer } from '../../utils/Tokenizer/Tokenizer';

export class IconSyncService {
    private readonly limit = pLimit(100);
    private readonly tokenizer = new Tokenizer();

    constructor(
        private readonly figmaApi: FigmaService,
        private readonly storage: IconStorageService
    ) {}

    async sync(): Promise<SyncResult> {
        const lastSyncDate = this.storage.getLastSyncDate();
        const fileUpdateDate = await this.figmaApi.getFileUpdateDate();

        if (fileUpdateDate <= lastSyncDate) {
            console.log('Figma file has not changed since last sync');
            return { added: 0, modified: 0, unchanged: 0 };
        }

        const components = await this.getUpdatedComponents(lastSyncDate);
        if (components.length === 0) {
            console.log('No icon changes since last sync');
            return { added: 0, modified: 0, unchanged: 0 };
        }

        const iconsData = await this.downloadIconsData(components);
        const result = await this.storage.saveIcons(iconsData);

        this.updateVersionIfNeeded(result);
        this.storage.saveLastSyncDate(fileUpdateDate);

        return result;
    }

    private async getUpdatedComponents(since: Date): Promise<IFigmaComponent[]> {
        const components = await this.figmaApi.getComponents();
        return components
            .map(component => ({
                ...component,
                name: component.name.split('/').pop(),
            }))
            .filter(({ name }) => this.tokenizer.isValid(name))
            .filter(({ updated_at }) => new Date(updated_at) > since);
    }

    private async downloadIconsData(components: IFigmaComponent[]): Promise<IIconData[]> {
        const chunks = this.chunkComponents(components);
        const allIconsData: IIconData[] = [];

        for (const chunk of chunks) {
            const iconsData = await this.processChunk(chunk);
            allIconsData.push(...iconsData);
        }

        return allIconsData;
    }

    private async processChunk(components: IFigmaComponent[]): Promise<IIconData[]> {
        const ids = components.map(c => c.node_id);
        const imagesMap = await this.figmaApi.getImagesUrls(ids);

        const promises = components.map(({ name, node_id }) =>
            this.limit(async (): Promise<IIconData> => {
                const url = imagesMap[node_id];
                const src = await this.figmaApi.downloadImage(url);
                const tokens = this.tokenizer.tokenize(name);

                return {
                    category: tokens.category,
                    fileName: `${name}.svg`,
                    src,
                };
            })
        );

        return Promise.all(promises);
    }

    private chunkComponents(components: IFigmaComponent[]): IFigmaComponent[][] {
        const CHUNK_SIZE = 120; // Based on URL length limits
        const chunks: IFigmaComponent[][] = [];

        for (let i = 0; i < components.length; i += CHUNK_SIZE) {
            chunks.push(components.slice(i, i + CHUNK_SIZE));
        }

        return chunks;
    }

    private updateVersionIfNeeded(result: SyncResult): void {
        if (result.added > 0) {
            this.storage.updatePackageVersion('minor');
            console.log(`Added ${result.added} icons - minor version update`);
        } else if (result.modified > 0) {
            this.storage.updatePackageVersion('patch');
            console.log(`Modified ${result.modified} icons - patch version update`);
        }
    }
}

