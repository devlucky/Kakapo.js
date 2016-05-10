import _ from 'lodash';

// @TODO (zzarcon): Implement 'included' support after relationships
export const JSONApiSerializer = (record = {}, type = null) => {
  const id = record.id;
  const included = [];
  const relationships = {};
  const serializedRecord = _.pickBy(record, (value, key) => key !== 'id');

  return {
    data: {
      id,
      attributes: serializedRecord,
      relationships,
      type,
    },
    included,
  };
};
