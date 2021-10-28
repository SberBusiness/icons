import {Parser} from './Parser/Parser';
import {Transformer} from './Transformer/Transformer';
import {Generator} from './Generator/Generator';
import {srcPaths} from '../consts';
import {getDirectories} from '../utils/fsUtils';
import {getTarget} from '../utils/processUtils';

const target = getTarget(process.argv);
const folders = getDirectories(srcPaths[target]);

const parser = new Parser(folders);
const transformer = new Transformer(parser);
const generator = new Generator(transformer);

(
    target === 'icons'
        ? generator.generateIcons()
        : generator.generateIllustrations()
)
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
