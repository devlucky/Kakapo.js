import _ from 'lodash';

const updateRecord = (record, collectionName, store) => {
  const originalRecord = _.find(store.get(collectionName), { id: record.id });
  return _.assign(originalRecord, record);
};

export const recordFactory = (record, collectionName, store) => {
  const recordExtension = {
    save() {
      return updateRecord(this, collectionName, store);
    },
  };

  return Object.assign({}, record, recordExtension);
};
