//TODO: Makes sense to suport 'included'? If yes it must happen after relationships
export const JSONApiSerializer = (record = {}) => {
  const relationships = {};

  Object.keys(record).forEach({

  });

  return {
    data: {
      id: null,
      attributes: record,
      relationships: relationships,
      type: 'user'
    }
  };
};