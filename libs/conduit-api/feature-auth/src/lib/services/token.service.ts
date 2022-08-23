import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  generateToken(userId: string, username: string, email: string): string {
    const payload = {
      userId,
      username,
      email,
    };

    return this.jwtService.sign(payload);
  }
}
