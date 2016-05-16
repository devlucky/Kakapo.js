import _ from 'lodash';

/**
 * Returns record updated according to changes on it's instance.
 *
 * @param {Object} record - instance of record with changes
 * @param {string} collectionName - name of record's collection
 * @param {Object} recordStore - database's store with records
 *
 * @returns {Object}
 * @private
 */
const updateRecord = (record, collectionName, recordStore) => {
  const originalRecord = _.find(recordStore.get(collectionName), { id: record.id });
  return _.assign(originalRecord, record);
};

/**
 * Returns record's copy with multiple useful methods assigned to it.
 *
 * @param {Object} record - record to extend with new methods
 * @param {string} collectionName - name of record's collection
 * @param {Object} recordStore - database's store with records
 *
 * @returns {Object}
 * @private
 */
export const recordFactory = (record, collectionName, recordStore) => {
  const recordExtension = {
    /**
     * Returns record updated via *updateRecord*.
     *
     * @returns {Object}
     * @private
     */
    save() {
      return updateRecord(this, collectionName, recordStore);
    },

    delete() {
      const collection = recordStore.get(collectionName);
      const record = _.find(collection, {id: this.id});
      const index = collection.indexOf(record);

      collection.splice(index, 1);
    }
  };

  return Object.assign({}, record, recordExtension);
};
