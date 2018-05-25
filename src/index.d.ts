import { ListIterateeCustom } from "lodash";

export type RouterOptions = {
  readonly host: string;
  readonly requestDelay: number;
};

export type RequestHeaders = { [header: string]: string };
export type RequestParams = { [param: string]: string };
export type RequestQuery = { [queryParam: string]: string };

export type Request = {
  readonly body: any | null;
  readonly headers: RequestHeaders;
  readonly params: RequestParams;
  readonly query: RequestQuery;
};

export type Headers = {
  readonly [header: string]: string;
};

export class Response {
  constructor(code: number, body: any, headers: Headers);
}

export type RequestHandler<M extends DatabaseSchema> = (
  request: Request,
  database: Database<M>
) => Response;

export class Router<M extends DatabaseSchema = {}> {
  constructor(options?: RouterOptions);
  get(url: string, handler: RequestHandler<M>): void;
  post(url: string, handler: RequestHandler<M>): void;
  put(url: string, handler: RequestHandler<M>): void;
  head(url: string, handler: RequestHandler<M>): void;
  register(method: string, path: string, handler: RequestHandler<M>): void;
}

export class Server {
  use(entity: Router | Database<any>): void;
}

export type CollectionItemFactory<T extends Object> = () => T;

export type DatabaseSchema = {
  [collectionName: string]: Object;
};

export type RecordId = number;

export type Record<T extends Object> = {
  readonly id: RecordId;
  readonly data: T;
};

export class Database<M extends DatabaseSchema> {
  all<K extends keyof M>(collectionName: K): Record<M[K]>;

  belongsTo<K extends keyof M>(
    collectionName: K,
    conditions: ListIterateeCustom<M[K], boolean>
  ): () => Record<M[K]>;

  create<K extends keyof M>(collectionName: K, size: number): Record<M[K]>[];

  delete<K extends keyof M>(
    collectionName: K,
    id: RecordId
  ): Record<M[K]> | null;

  find<K extends keyof M>(
    collectionName: K,
    conditions: ListIterateeCustom<M[K], boolean>
  ): Record<M[K]>[];

  findOne<K extends keyof M>(
    collectionName: K,
    conditions: ListIterateeCustom<M[K], boolean>
  ): Record<M[K]>;

  first<K extends keyof M>(collectionName: K): Record<M[K]>;

  last<K extends keyof M>(collectionName: K): Record<M[K]>;

  push<K extends keyof M>(collectionName: K, data: M[K]): Record<M[K]>;

  register<K extends keyof M>(
    collectionName: K,
    factory?: CollectionItemFactory<M[K]>
  ): void;

  reset(): void;

  update<K extends keyof M>(
    collectionName: K,
    id: RecordId,
    data: Partial<M[K]>
  ): Record<M[K]>;
}
