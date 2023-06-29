import {Parser} from './Parser/Parser';
import {SVGTransformer} from './Transformer/SVGTransformer';
import {SVGGenerator} from './Generator/SVGGenerator';
import {srcPaths} from '../consts';
import {getDirectories} from '../utils/fsUtils';
import {ETarget, getTarget} from '../utils/envUtils';

const target = getTarget();
const folders = getDirectories(srcPaths[target]);

const parser = new Parser(folders);
const svgTransformer = new SVGTransformer(parser);
const svgGenerator = new SVGGenerator(svgTransformer);

(
    target === ETarget.icons
        ? svgGenerator.generateIcons()
        : svgGenerator.generateIllustrations()
)
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
