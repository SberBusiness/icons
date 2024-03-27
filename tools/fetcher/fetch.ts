import {FigmaFetcher} from './FigmaFetcher/FigmaFetcher';
import {FigmaService} from './FigmaService/FigmaService';

const figmaService = new FigmaService();
const figmaFetcher = new FigmaFetcher(figmaService);

figmaFetcher.fetch().catch((error) => {
    console.log(error);
    process.exit(1);
});
