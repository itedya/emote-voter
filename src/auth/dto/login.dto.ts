import { IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: "Podaj atrybut username (Nick)." })
  @IsString({ message: "Atrybut username (Nick) musi być ciągiem znaków." })
  @Length(3, 64, { message: "Atrybut username (Nick) musi mieć od 3 do 64 znaków." })
  username: string;

  @IsNotEmpty({ message: "Podaj atrybut password (Hasło)." })
  @IsString({ message: "Atrybut password (Hasło) musi być ciągiem znaków." })
  @Length(8, 255, { message: "Atrybut password (Hasło) musi mieć od 3 do 64 znaków." })
  password: string;
}
