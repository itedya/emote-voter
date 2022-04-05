import { OmitType } from '@nestjs/swagger';
import { SevenTVAccountDto } from './seventv-account.dto';

export class CreateSevenTVAccountDto extends OmitType(SevenTVAccountDto, [
  'id',
  'user',
  'createdAt',
  'updatedAt',
] as const) {}
