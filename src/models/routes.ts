import { Request } from 'express';

export interface RequestBody<T> extends Request {
  body: T;
}

export interface RequestParams<T> extends Request {
  params: T & Request['params'];
}

export interface RequestBodyAndParams<T, K> extends Request {
  body: T;
  params: K & Request['params'];
}

/** Authenticated request */
type Auth = {
  userId: number;
}
export interface AuthRequest extends Request {
  body: Auth;
}
export interface AuthRequestBody<T> extends Request {
  body: Auth & T;
}
export interface AuthRequestParams<T> extends Request {
  body: Auth;
  params: T & Request['params'];
}
export interface AuthRequestBodyAndParams<T, K> extends Request {
  body: Auth & T;
  params: K & Request['params'];
}
