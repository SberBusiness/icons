
// index.ts
import { FigmaService } from './FigmaService/FigmaService';
import { IconStorageService } from './IconStorageService/IconStorageService';
import { IconSyncService } from './IconSyncService/IconSyncService';
import { figmaToken, figmaIconsFileKey } from '../consts';

(async () => {
    try {
        if (!figmaToken || !figmaIconsFileKey) {
            throw new Error('FIGMA_TOKEN or FIGMA_ICONS_FILE_KEY environment variables are not set');
        }

        const figmaApi = new FigmaService(figmaToken, figmaIconsFileKey);
        const storage = new IconStorageService();
        const syncService = new IconSyncService(figmaApi, storage);

        const result = await syncService.sync();

        console.log('Sync completed:');
        console.log(`Added: ${result.added}`);
        console.log(`Modified: ${result.modified}`);
        console.log(`Unchanged: ${result.unchanged}`);
    } catch (error) {
        console.error('Sync failed:', error.message);
        process.exit(1);
    }
})();
