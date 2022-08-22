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

  constructor(
    private withUsername: string,
    private withEmail: string,
    private withPassword: string
  ) {
    this.username = this.withUsername;
    this.email = this.withEmail;
    this.password = this.withPassword;
  }
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsDefined()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  password?: string;

  constructor(private withEmail: string, private withPassword: string) {
    this.email = this.withEmail;
    this.password = this.withPassword;
  }
}

export class RegisterUserRequest {
  @ValidateNested()
  @Type(() => RegisterUserDto)
  @IsDefined()
  user?: RegisterUserDto;

  constructor(
    private username: string,
    private email: string,
    private password: string
  ) {
    this.user = new RegisterUserDto(this.username, this.email, this.password);
  }
}

export class LoginUserRequest {
  @ValidateNested()
  @Type(() => LoginUserDto)
  @IsDefined()
  user?: LoginUserDto;

  constructor(private email: string, private password: string) {
    this.user = new LoginUserDto(this.email, this.password);
  }
}
