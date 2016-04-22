//TODO: Implement 'included' support after relationships
export const JSONApiSerializer = (record = {}, type = null) => {
  const id = record.id;
  const relationships = {};
  const included = [];

  delete record.id;

  return {
    data: {
      id,
      attributes: record,
      relationships,
      type
    },
    included
  };
};