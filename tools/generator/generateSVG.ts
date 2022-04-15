import {Parser} from './Parser/Parser';
import {SVGTransformer} from './Transformer/SVGTransformer';
import {SVGGenerator} from './Generator/SVGGenerator';
import {srcPaths} from '../consts';
import {getDirectories} from '../utils/fsUtils';
import {getTarget} from '../utils/processUtils';

const target = getTarget(process.argv);
const folders = getDirectories(srcPaths[target]);

const parser = new Parser(folders);
const svgTransformer = new SVGTransformer(parser);
const svgGenerator = new SVGGenerator(svgTransformer);

(
    target === 'icons'
        ? svgGenerator.generateIcons()
        : svgGenerator.generateIllustrations()
)
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
