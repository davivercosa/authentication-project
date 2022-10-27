import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const secret: Secret = process.env.JWT_SECRET!;

export default function (req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (authorization === undefined) {
    res.status(401);
    res.json({
      status: 'error',
      message: 'Request without authorization token',
    });
    return;
  }

  const tokenToBeAuthenticated = authorization.split(' ')[1];

  jwt.verify(tokenToBeAuthenticated, secret, (error, data) => {
    if (error) {
      res.status(401);
      res.json({
        status: 'error',
        message:
          error.name === 'JsonWebTokenError'
            ? 'User unauthorized'
            : 'Token expired',
      });

      return;
    }

    res.status(200);
    next();
  });
}
