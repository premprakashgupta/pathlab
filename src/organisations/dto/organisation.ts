
import { IsEmail, IsNotEmpty } from 'class-validator';

export class OrganisationDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  shortName: string;

  @IsNotEmpty()
  image:string;

  @IsNotEmpty()
  phone:number;

  @IsNotEmpty()
  address:string;
}

