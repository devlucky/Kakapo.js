import _ from 'lodash';

const updateRecord = (record, collectionName, store) => {
  const originalRecord = _.find(store[collectionName], {id: record.id});
  return _.assign(originalRecord, record);
};

export const recordFactory = (record, collectionName, store) => {
  record.save = function() {
    return updateRecord(this, collectionName, store);
  };

  return record;
};
