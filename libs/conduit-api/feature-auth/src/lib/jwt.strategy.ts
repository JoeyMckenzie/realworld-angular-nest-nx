import { Strategy, JwtFromRequestFunction } from 'passport-jwt';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: extractFromCustomTokenHeader(),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_SECRET,
    });
  }

  validate(payload: { userId: string; username: string; email: string }) {
    return {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
    };
  }
}

function extractFromCustomTokenHeader(): JwtFromRequestFunction {
  return ({ headers }): string => {
    const authorizationHeader = headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Token')) {
      return '';
    }

    const tokenizedHeader = authorizationHeader.split(' ');

    if (tokenizedHeader.length !== 2) {
      return '';
    }

    return tokenizedHeader[1];
  };
}
