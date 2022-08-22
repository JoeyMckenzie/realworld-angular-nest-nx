import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsDefined,
  IsEmail,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  username?: string;

  @IsNotEmpty()
  @IsEmail()
  @IsDefined()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  password?: string;
}

export class RegisterUserRequest {
  @ValidateNested()
  @Type(() => RegisterUserDto)
  @IsDefined()
  user?: RegisterUserDto;
}
