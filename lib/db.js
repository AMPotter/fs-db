const { mkdirp } = require('./promisified');
const join = require('path').join;
const Store = require('./store');

module.exports = class Db {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }

    getStore(name) {
        const storeDir = join(this.rootDir, name);
        return mkdirp(storeDir)
            .then(() => {
                return new Store(storeDir);
            });
    }
};