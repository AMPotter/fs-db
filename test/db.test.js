const assert = require('assert');
const join = require('path').join;
const { rimraf, readdir } = require('../lib/promisified');

const Db = require('../lib/db');
const Store = require('../lib/store');

describe('db', () => {

    const TEST_DIR = join(__dirname, 'data');

    let db = null;
    beforeEach(() => {
        return rimraf(TEST_DIR)
            .then(() => {
                db = new Db(TEST_DIR);
            });
    });

    it('returns a Store', () => {
        return db.getStore('cats')
            .then(store => {
                assert.ok(store instanceof Store);
            });
    });

    it('creates a subdirectory per store', () => {
        const names = ['cats', 'buildings', 'payments'];

        return Promise.all(names.map(name => db.getStore(name)))
            .then(() => {
                return readdir(TEST_DIR);
            })
            .then(files => {
                names.sort();
                assert.deepEqual(files, names);
            });
    });
});