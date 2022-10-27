import { Request } from 'express';
import { Schema } from 'joi';
import { Login } from '../interfaces/Login/iLogin';
import { RequestManagerResponse } from '../interfaces/Shared/response';

class RequestManager {
  private normalize(body: JSON): Login {
    let stringBody = JSON.stringify(body);

    for (let index = 0; index < stringBody.length; index++) {
      if (stringBody[index] === ':') {
        const startOfKeyIndex = stringBody.lastIndexOf('"', index - 2) + 1;
        const endOfKeyIndex = index - 2;

        let key = '';
        let keyUpper = '';

        for (let index = startOfKeyIndex; index <= endOfKeyIndex; index++) {
          key += stringBody[index];
          keyUpper += stringBody[index].toUpperCase();
        }

        stringBody = stringBody.replace(
          `"${key}":`,
          `"${this.unidecode(keyUpper.split(' ').join(''))}":`,
        );
      }
    }

    return JSON.parse(stringBody);
  }

  private unidecode(string: string): string {
    return string
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  verify(req: Request, schema: Schema): RequestManagerResponse {
    const normalizedRequestBody = this.normalize(req.body);

    const { error } = schema.validate(normalizedRequestBody);

    if (error) {
      return { status: 'error', message: error };
    }

    const message = <Login>normalizedRequestBody;

    return { status: 'success', message };
  }
}

export default new RequestManager();
