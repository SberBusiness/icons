const copy = require('copy');
const path = require('path');
const {DEFAULT_GENERATED_PATH, PUBLISH_FOLDER_PATH, RAW_SVGS} = require('../consts');
const {createFolderIfNotExists} = require('../utils/fsUtils');

function createCallback(message) {
    return function (err) {
        if (err) {
            throw new Error(err);
        }
        console.log(message);
    }
}

createFolderIfNotExists(PUBLISH_FOLDER_PATH);

copy('./package.json', PUBLISH_FOLDER_PATH, {}, createCallback('package.json successfully copied'));

copy(RAW_SVGS, PUBLISH_FOLDER_PATH, {}, createCallback('raw svg successfully copied'))

copy(path.join(DEFAULT_GENERATED_PATH, './*.js'), PUBLISH_FOLDER_PATH, {}, createCallback('js successfully copied'));

copy(path.join(DEFAULT_GENERATED_PATH, './*.d.ts'), PUBLISH_FOLDER_PATH, {}, createCallback('d.ts successfully copied'));

copy(path.join(DEFAULT_GENERATED_PATH, './css/icons.css'), path.join(PUBLISH_FOLDER_PATH, './css'), { flatten: true }, createCallback('icons.css successfully copied'));
