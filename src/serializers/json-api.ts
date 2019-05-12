import { pickBy } from 'lodash';

// @TODO (zzarcon): Implement 'included' support after relationships
export const JSONApiSerializer = (record: any, type: any = null) => {
  const id = record.id;
  const included: any[] = [];
  const relationships = {};
  const serializedRecord = pickBy(record, (value, key) => key !== "id");

  return {
    data: {
      id,
      attributes: serializedRecord,
      relationships,
      type
    },
    included
  };
};
