import {Parser} from './Parser/Parser';
import {ReactTransformer} from './Transformer/ReactTransformer';
import {ReactGenerator} from './Generator/ReactGenerator';
import {srcPaths} from '../consts';
import {getDirectories} from '../utils/fsUtils';
import {ETarget, getTarget} from '../utils/envUtils';

const target = getTarget();
const folders = getDirectories(srcPaths[target]);

const parser = new Parser(folders);
const reactTransformer = new ReactTransformer(parser);
const reactGenerator = new ReactGenerator(reactTransformer);

(
    target === ETarget.icons
        ? reactGenerator.generateIcons()
        : reactGenerator.generateIllustrations()
)
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
