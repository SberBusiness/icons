import {Parser} from './Parser/Parser';
import {ReactTransformer} from './Transformer/ReactTransformer';
import {ReactGenerator} from './Generator/ReactGenerator';
import {srcPaths} from '../consts';
import {getDirectories} from '../utils/fsUtils';

const folders = getDirectories(srcPaths['icons']);

const parser = new Parser(folders);
const reactTransformer = new ReactTransformer(parser);
const reactGenerator = new ReactGenerator(reactTransformer);

reactGenerator.generate().catch((error) => {
    console.log(error);
    process.exit(1);
});
