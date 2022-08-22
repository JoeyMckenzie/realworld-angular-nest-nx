import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  generateToken(userId: string, username: string, email: string): string {
    if (!process.env.TOKEN_SECRET) {
      throw new HttpException(
        'Signing key was found, please verify the secret.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: userId,
        exp: exp.getTime() / 1000,
        username,
        email,
      },
      process.env.TOKEN_SECRET
    );
  }
}
