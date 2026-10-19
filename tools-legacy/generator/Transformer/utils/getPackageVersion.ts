import {ETarget, getTarget} from '../../../utils/envUtils';

export const getPackageVersion = () => {
    const target = getTarget();

    const {version} =
        target === ETarget.icons ? require('../../../../packages/icons/package') : require('../../../../packages/illustrations/package');

    return version;
};
