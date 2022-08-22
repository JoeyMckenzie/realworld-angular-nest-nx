import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  generateHashedPasswordWithSalt(password: string): {
    salt: string;
    password: string;
  } {
    const salt = crypto
      .randomBytes(+process.env.PASSWORD_SALT_LENGTH)
      .toString('hex');

    const hashedPassword = this.generateHash(password, salt);

    return {
      salt,
      password: hashedPassword,
    };
  }

  validatePassword(
    passwordAttempt: string,
    storedPassword: string,
    salt: string
  ): boolean {
    return storedPassword === this.generateHash(passwordAttempt, salt);
  }

  private generateHash(password: string, salt: string): string {
    return crypto
      .pbkdf2Sync(
        password,
        salt,
        +process.env.PASSWORD_ITERATIONS,
        +process.env.PASSWORD_KEY_LENGTH,
        'sha512'
      )
      .toString('hex');
  }
}
