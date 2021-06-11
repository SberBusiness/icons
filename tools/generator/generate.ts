import {Parser} from './Parser/Parser';
import {Transformer} from './Transformer/Transformer';
import {Generator} from './Generator/Generator';
import {srcPaths} from '../consts';
import {getDirectories} from '../utils/fsUtils';
import {getTarget} from '../utils/processUtils';

const folders = getDirectories(srcPaths[getTarget(process.argv)]);

const parser = new Parser(folders);
const transformer = new Transformer(parser);
const generator = new Generator(transformer);

generator
    .generate()
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
