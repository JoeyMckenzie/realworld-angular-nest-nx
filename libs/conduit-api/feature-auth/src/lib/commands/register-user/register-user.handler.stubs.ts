import { User } from '@prisma/client';
import {
  AuthenticationResponse,
  RegisterUserRequest,
} from '@realworld-angular-nest-nx/global';
import { RegisterUserCommand } from './register-user.command';

const user: User = {
  id: 'stub-id',
  createdAt: new Date(),
  updatedAt: new Date(),
  username: 'stub-username',
  email: 'stub-email',
  password: 'stub-password',
  image: 'stub-image',
  bio: 'stub-bio',
};

const response: AuthenticationResponse = {
  user: {
    bio: user.bio,
    email: user.email,
    image: user.image,
    username: user.username,
    token: 'stub-token',
  },
};

const request = new RegisterUserRequest(
  user.username,
  user.email,
  user.password
);

const command = new RegisterUserCommand(request);

const stubs = {
  user,
  request,
  response,
  command,
};

export default stubs;
