import { ApiProperty } from '@nestjs/swagger';

export class UpdateKnightDto {
  @ApiProperty({ example: 'Braveheart', description: 'Novo apelido do cavaleiro' })
  nickname: string;
}
