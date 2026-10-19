import rimraf from 'rimraf';
import {generationPath, publicationPath} from '../consts';

function throwIfErrorOccurred(err) {
    if (err) {
        throw new Error(err);
    }
}

rimraf(generationPath, throwIfErrorOccurred);
rimraf(publicationPath, throwIfErrorOccurred);
