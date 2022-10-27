import { Request, Response } from 'express';
import RequestManager from '../services/RequestManager';

import { authenticationSchema } from '../interfaces/Login/authentication.dto';
import { Login } from '../interfaces/Login/iLogin';

import LoginModel from '../models/LoginModel';

import jwt, { Secret } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const secret: Secret = process.env.JWT_SECRET!;

class LoginController {
  async signUp(req: Request, res: Response) {
    const verificationResp = RequestManager.verify(req, authenticationSchema);

    if (verificationResp.status === 'error') {
      res.status(400);
      res.json({ status: 'error', message: verificationResp.message });

      return;
    }

    const userInfo = <Login>verificationResp.message;

    const registrationResp = await LoginModel.register(userInfo);

    if (registrationResp.status === 'error') {
      res.status(registrationResp.code!);

      delete registrationResp.code;

      res.json(registrationResp);

      return;
    }

    res.status(200);
    res.json(registrationResp);
  }

  async signIn(req: Request, res: Response) {
    const verificationResp = RequestManager.verify(req, authenticationSchema);

    if (verificationResp.status === 'error') {
      res.status(400);
      res.json({ status: 'error', message: verificationResp.message });

      return;
    }

    const userInfo = <Login>verificationResp.message;

    const authenticationResp = await LoginModel.auth(userInfo);

    if (authenticationResp.status === 'error') {
      res.status(authenticationResp.code!);

      delete authenticationResp.code;

      res.json(authenticationResp);

      return;
    }

    jwt.sign({}, secret, { expiresIn: '8h' }, (error, token) => {
      if (error) {
        res.status(500);
        res.json({ status: 'error', message: 'Internal server error 😣' });

        return;
      }

      res.status(200);
      res.json({ status: 'success', message: `${token}` });
    });
  }
}

export default new LoginController();
