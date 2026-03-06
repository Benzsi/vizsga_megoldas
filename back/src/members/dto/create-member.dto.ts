import { members_gender } from "generated/prisma/enums";
import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(members_gender)
  @IsOptional()
  gender?: members_gender;

  @IsDateString()
  @IsNotEmpty()
  birth_date: string;
}