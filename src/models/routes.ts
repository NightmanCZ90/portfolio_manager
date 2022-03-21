export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}
export interface TypedRequestParams<T> extends Express.Request {
  params: T;
}
export interface TypedRequestBodyAndParams<T, K> extends Express.Request {
  body: T;
  params: K;
}

