import _ from 'lodash';

const updateRecord = (record, collectionName, recordStore) => {
  const originalRecord = _.find(recordStore.get(collectionName), { id: record.id });
  return _.assign(originalRecord, record);
};

export const recordFactory = (record, collectionName, recordStore) => {
  const recordExtension = {
    save() {
      return updateRecord(this, collectionName, recordStore);
    },
  };

  return Object.assign({}, record, recordExtension);
};
