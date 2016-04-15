import _ from 'lodash';

const updateRecord = (collectionName, record, store) => {
  const originalRecord = _.find(store[collectionName], {id: record.id});
  return Object.assign(originalRecord, record);
};

export const recordFactory = (record, collectionName, store) => {
  record.save = function() {
    return updateRecord(collectionName, this, store);
  };

  return record;
};
