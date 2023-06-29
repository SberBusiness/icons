import {ETarget, getTarget} from '../../../utils/envUtils';

export const getPackageVersion = () => {
    const target = getTarget();

    const {version} = target === ETarget.icons
        ? require('../../../../icons/package')
        : require('../../../../illustrations/package');

    return version;
};
