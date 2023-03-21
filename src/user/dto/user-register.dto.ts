import { IsString, IsNotEmpty, IsEnum, MinLength } from 'class-validator';

export class UserRegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(['standard', 'admin'])
  @IsString()
  role: 'standard' | 'admin';
}