import {ReactTransformer} from './ReactTransformer';
import {IIconTransformedData, ITransformer} from '../types';

/**
 * Трансформер получает в себя инстанс парсера, от которого в дальнейшем получает
 * сырую коллекцию иконок, трансформирует её в во все те же SVG иконки, но с указанием
 * classnames, попутно собирая коллекцию стилей.
 */
export class SVGTransformer extends ReactTransformer implements ITransformer {
    /**
     * Трансформирует svg в svg, подставляя классы.
     */
    protected transformSVG = async (iconData: IIconTransformedData): Promise<string> => {
        const optimizedSrc = await this.optimizeSVG(iconData.src);
        return [
            this.makeUniqueIds,
            this.insertDimensions,
            this.replaceColorsWithClassNames,
        ].reduce((memo, transformer) =>
            transformer(memo, iconData), optimizedSrc);
    };
}
