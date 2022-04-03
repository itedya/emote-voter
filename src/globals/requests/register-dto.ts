import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Nazwa użytkownika nie może być pusta!' })
  @IsString({ message: 'Nazwa użytkownika musi być ciągiem znaków.' })
  @Length(3, 16, { message: 'Nazwa użytkownika może mieć od 3 do 16 znaków.' })
  username: string;

  @IsNotEmpty({ message: 'Hasło nie może być puste!' })
  @IsString({ message: 'Hasło musi być ciągiem znaków.' })
  @Length(8, 128, { message: 'Hasło musi mieć od 8 do 128 znaków.' })
  password: string;
}
