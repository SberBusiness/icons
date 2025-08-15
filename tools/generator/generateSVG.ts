import {Parser} from './Parser/Parser';
import {SVGTransformer} from './Transformer/SVGTransformer';
import {SVGGenerator} from './Generator/SVGGenerator';
import {srcPaths} from '../consts';
import {getDirectories} from '../utils/fsUtils';

const folders = getDirectories(srcPaths['icons']);

const parser = new Parser(folders);
const svgTransformer = new SVGTransformer(parser);
const svgGenerator = new SVGGenerator(svgTransformer);

svgGenerator.generate().catch((error) => {
    console.log(error);
    process.exit(1);
});
