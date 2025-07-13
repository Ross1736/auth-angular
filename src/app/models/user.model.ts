import { HttpHeaders } from '@angular/common/http';

export interface IFormUser {
  email: string;
  password: string;
}

export interface IUser {
  user_id: string;
  email: string;
  created: string;
  updated: string;
  token: string;
}

export interface IResponsePostUser {
  message: string;
  status: number;
  user: IUser;
}

export interface IHttpResponsePostUser {
  status: number;
  message: string;
  user: Omit<IUser, 'token'>;
}

export interface IHttpResponsePostLoginUser {
  status: number;
  message: string;
  user: IUser;
}

export interface IResponseVerifySession {
  message: string;
  status: number;
  user: Omit<IUser, 'email' | 'created' | 'updated' | 'token'>;
}

export interface IPatchRecoveryPassword {
  email: string;
  password: string;
  code: string;
}

export interface IResponsePostRecoveryPassword {
  message: string;
  status: number;
  user: Omit<IUser, 'user_id' | 'created' | 'updated' | 'token'>;
}

export interface IErrorResponse {
  message: string;
  status: number;
}

export interface IHttpErrorResponse {
  error: IErrorResponse;
  headers: HttpHeaders;
}
