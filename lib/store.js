const { readFile, writeFile, readdir, unlink } = require('./promisified');
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {
    constructor(root) {
        this.root = root;
    }

    getFileName(id) {
        return path.join(this.root, `${id}.json`);
    }

    save(item) {
        const id = item._id = shortid.generate();
        const filename = this.getFileName(id);
        const serialized = JSON.stringify(item);
        return writeFile(filename, serialized)
            .then(() => JSON.parse(serialized));
    }

    get(id) {
        const filename = this.getFileName(id);
        return readFile(filename, 'utf8')
            .then(data => JSON.parse(data))
            .catch(err => {
                if(err.code === 'ENOENT') return null;
                throw err;
            });
    }

    getAll() {
        return readdir(this.root)
            .then(files => {
                return files.map(file => path.basename(file, '.json'));
            })
            .then(ids => {
                return Promise.all(
                    ids.map(id => this.get(id))
                );
            });
    }

    remove(id) {
        const filename = this.getFileName(id);
        return unlink(filename)
            .then(() => {
                return { removed: true };
            })
            .catch(err => {
                if(err.code === 'ENOENT') return { removed: false };
                throw err;
            });
    }
};