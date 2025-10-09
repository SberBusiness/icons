// IconStorageService.ts - отвечает за работу с файловой системой и версионирование
import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { IIconData } from '../types';
import { EIconCategory } from '../../enums';
import { modulesPaths, srcPaths, lastSuccessfulFetchPath } from '../../consts';
import { createFolderIfNotExists, isPathExists, readFile, writeFile } from '../../utils/fsUtils';

export interface SyncResult {
    added: number;
    modified: number;
    unchanged: number;
}

export class IconStorageService {
    private readonly iconsPackagePath = path.resolve(modulesPaths.icons, 'package.json');

    async saveIcons(iconsData: IIconData[]): Promise<SyncResult> {
        const result: SyncResult = { added: 0, modified: 0, unchanged: 0 };

        for (const { src, category, fileName } of iconsData) {
            const categoryPath = path.resolve(srcPaths.icons, EIconCategory[category]);
            createFolderIfNotExists(categoryPath);

            const filePath = path.resolve(categoryPath, fileName);
            const status = await this.saveIconFile(filePath, src);
            result[status]++;
        }

        return result;
    }

    getLastSyncDate(): Date {
        if (!isPathExists(lastSuccessfulFetchPath)) {
            return new Date(0); // epoch start if no previous sync
        }
        const json = readFileSync(lastSuccessfulFetchPath, 'utf-8');
        const date = JSON.parse(json)?.date;
        return date ? new Date(date) : new Date(0);
    }

    saveLastSyncDate(date: Date): void {
        const json = JSON.stringify({ date: date.toISOString() });
        writeFileSync(lastSuccessfulFetchPath, json);
    }

    updatePackageVersion(changeType: 'minor' | 'patch'): void {
        const packageJson = JSON.parse(readFileSync(this.iconsPackagePath, 'utf-8'));
        const version = this.calculateNewVersion(packageJson.version, changeType);
        packageJson.version = version;
        writeFileSync(this.iconsPackagePath, JSON.stringify(packageJson, null, 4) + '\n');
    }

    private async saveIconFile(filePath: string, newContent: string): Promise<'added' | 'modified' | 'unchanged'> {
        if (!isPathExists(filePath)) {
            await writeFile(filePath, newContent);
            return 'added';
        }

        const currentContent = await readFile(filePath);
        if (currentContent !== newContent) {
            await writeFile(filePath, newContent);
            return 'modified';
        }

        return 'unchanged';
    }

    private calculateNewVersion(currentVersion: string, changeType: 'minor' | 'patch'): string {
        if (/alpha|beta/.test(currentVersion)) {
            return currentVersion.replace(/\d+$/, (ver) => `${parseInt(ver) + 1}`);
        }

        const [major, minor, patch] = currentVersion.split('.').map(Number);

        if (changeType === 'minor') {
            return `${major}.${minor + 1}.0`;
        } else {
            return `${major}.${minor}.${patch + 1}`;
        }
    }
}
