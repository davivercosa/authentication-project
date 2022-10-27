import Joi from 'joi';
import { Login } from '../Login/iLogin';

type ResponseStatus = 'success' | 'error';

export interface ApiResponse {
  status: ResponseStatus;
  message: string | Error;
  code?: number;
}

export interface RequestManagerResponse {
  status: string;
  message: Joi.ValidationError | Login;
}
