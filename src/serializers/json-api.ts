import pickBy from 'lodash.pickby';

// @TODO (zzarcon): Implement 'included' support after relationships
export const JSONApiSerializer = (record: any, type: any = null) => {
  const id = record.id;
  const included: any[] = [];
  const relationships = {};
  const serializedRecord = pickBy(
    record,
    (_value: any, key: string) => key !== 'id'
  );

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
