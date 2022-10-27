import { prisma } from '../database/prisma';
import bcrypt from 'bcrypt';
import { Login } from '../interfaces/Login/iLogin';
import { ApiResponse } from '../interfaces/Shared/response';

class LoginModel {
  async register(userInfo: Login): Promise<ApiResponse> {
    try {
      const isEmailRegistered = await prisma.users.findUnique({
        where: {
          email: userInfo.email,
        },
      });

      if (isEmailRegistered !== null) {
        return {
          status: 'error',
          message: 'E-mail already registered on database 😓',
          code: 406,
        };
      }

      const hashedPassword = await bcrypt.hash(userInfo.password, 10);

      await prisma.users.create({
        data: {
          email: userInfo.email,
          password: hashedPassword,
        },
      });

      return {
        status: 'success',
        message:
          'Thank you for your registration! Hope you enjoy our platform 🥰',
      };
    } catch (error) {
      const err = error as Error;

      console.log(err);

      return { status: 'error', message: err, code: 500 };
    }
  }

  async auth(userInfo: Login): Promise<ApiResponse> {
    try {
      const isEmailRegistered = await prisma.users.findUnique({
        where: {
          email: userInfo.email,
        },
      });

      if (isEmailRegistered === null) {
        return {
          status: 'error',
          message: 'E-mail or password not found on database 😕',
          code: 404,
        };
      }

      const isPasswordCorrect = await bcrypt.compare(
        userInfo.password,
        isEmailRegistered.password,
      );

      if (!isPasswordCorrect) {
        return {
          status: 'error',
          message: 'E-mail or password not found on database 😕',
          code: 404,
        };
      }

      return { status: 'success', message: 'Welcome to our platform! 🤩' };
    } catch (error) {
      const err = error as Error;

      console.log(err);

      return { status: 'error', message: err, code: 500 };
    }
  }
}

export default new LoginModel();
