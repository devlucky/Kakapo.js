export const recordFactory = (record, collectionName, database) => {
  record.save = () => {
    database._update(collectionName, record);
  };

  return record;
};
