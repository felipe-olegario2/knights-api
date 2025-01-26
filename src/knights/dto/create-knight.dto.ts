import { ApiProperty } from '@nestjs/swagger';

export class CreateKnightDto {
  @ApiProperty({ example: 'Arthur', description: 'Nome do cavaleiro' })
  name: string;

  @ApiProperty({ example: 'King', description: 'Apelido do cavaleiro' })
  nickname: string;

  @ApiProperty({ example: '1985-12-25', description: 'Data de nascimento (YYYY-MM-DD)' })
  birthday: string;

  @ApiProperty({
    example: [
      { name: 'sword', mod: 3, attr: 'strength', equipped: true },
    ],
    description: 'Lista de armas do cavaleiro',
  })
  weapons: {
    name: string;
    mod: number;
    attr: string;
    equipped: boolean;
  }[];

  @ApiProperty({
    example: {
      strength: 15,
      dexterity: 10,
      constitution: 12,
      intelligence: 8,
      wisdom: 14,
      charisma: 13,
    },
    description: 'Atributos do cavaleiro',
  })
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };

  @ApiProperty({ example: 'strength', description: 'Atributo principal do cavaleiro' })
  keyAttribute: string;
}
