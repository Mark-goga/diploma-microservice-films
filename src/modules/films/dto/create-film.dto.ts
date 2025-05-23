import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateFilmDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsDateString()
  releaseDate: string;

  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  genre: string[];

  @IsString()
  @IsNotEmpty()
  backGroundImageKey: string;

  @IsString()
  @IsNotEmpty()
  avatarImageKey: string;

  @IsNumber()
  @IsNotEmpty()
  estimation: number;
}
