const updateRecord = (collectionName, record, database) => {
  const originalRecord = database.find(collectionName, {id: record.id});
  return Object.assign(originalRecord, record);
};

export const recordFactory = (record, collectionName, database) => {
  record.save = () => updateRecord(collectionName, record, database);

  return record;
};
