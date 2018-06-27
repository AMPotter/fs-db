const assert = require('assert');
const join = require('path').join;
const { rimraf, mkdirp } = require('../lib/promisified');

const Store = require('../lib/store');

describe('store', () => {

    const TEST_DIR = join(__dirname, 'data');

    let store = null;
    beforeEach(() => {
        return rimraf(TEST_DIR)
            .then(() => mkdirp(TEST_DIR))
            .then(() => store = new Store(TEST_DIR));
    });

    it('saves and gets an item', () => {
        let saved = null;
        store.save({ name: 'garfield' })
            .then(_saved => {
                saved = _saved;
                assert.ok(saved._id);
                assert.equal(saved.name, 'garfield');

                return store.get(saved._id);
            })
            .then(got => {
                assert.deepEqual(got, saved);
            });
    });

    it('returns null for a non-existent id', () => {
        return store.get('bad id')
            .then(item => {
                assert.strictEqual(item, null);
            });
    });

    it('removes an item by id', () => {
        let saved = null;
        return store.save({ name: 'garfield' })
            .then(_saved => {
                saved = _saved;
                return store.remove(saved._id);
            })
            .then(status => {
                assert.deepEqual(status, { removed: true });
                return store.get(saved._id);
            })
            .then(got => {
                assert.strictEqual(got, null);
            });
    });

    it('returns false status when removing non-existent id', () => {
        return store.remove('bad id')
            .then(status => {
                assert.deepEqual(status, { removed: false });
            });
    });

    it('returns empty array when no items', () => {
        return store.getAll()
            .then(items => {
                assert.deepEqual(items, []);
            });
    });

    it('return all saved items', () => {
        const toSave = [
            { name: 'garfield' },
            { name: 'lassie' },
            { name: 'tweety' }
        ];

        let saved = null;
        return Promise.all(toSave.map(item => store.save(item)))
            .then(_saved => {
                saved = _saved;
                saved.sort((a, b) => a._id < b._id ? -1 : 1);
                return store.getAll();
            })
            .then(all => {
                assert.deepEqual(all, saved);
            });
    });
});