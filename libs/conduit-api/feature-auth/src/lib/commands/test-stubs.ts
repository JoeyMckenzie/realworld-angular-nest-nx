import { User } from '@prisma/client';
import { AuthenticationResponse } from '@realworld-angular-nest-nx/global';

export const user: User = {
  id: 'stub-id',
  createdAt: new Date(),
  updatedAt: new Date(),
  username: 'stub-username',
  email: 'stub-email',
  password: 'stub-password',
  salt: 'stub-salt',
  image: 'stub-image',
  bio: 'stub-bio',
};

export const response = {
  user: {
    bio: user.bio,
    email: user.email,
    image: user.image,
    username: user.username,
    token: 'stub-token',
  },
} as AuthenticationResponse;

export const mockUserService = {
  getUserByEmailOrUsername: jest.fn(),
  createUser: jest.fn(),
};

export const mockAuthService = {
  generateHashedPasswordWithSalt: jest.fn(),
  validatePassword: jest.fn(),
};

export const mockTokenService = {
  generateToken: jest.fn(),
};
