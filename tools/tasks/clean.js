const rimraf = require('rimraf');
const {DEFAULT_GENERATED_PATH, PUBLISH_FOLDER_PATH} = require('../consts');

function throwIfErrorOccurred(err) {
    if (err) {
        throw new Error(err);
    }
}

rimraf(DEFAULT_GENERATED_PATH, throwIfErrorOccurred);
rimraf(PUBLISH_FOLDER_PATH, throwIfErrorOccurred);
