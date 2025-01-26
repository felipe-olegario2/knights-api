export interface Knight {
    _id?: string; // Adicionado para suportar IDs retornados pelo MongoDB
    name: string;
    nickname: string;
    birthday: string;
    weapons: Weapon[];
    attributes: Attributes;
    keyAttribute: string;
    isHero?: boolean; // Opcional porque pode não estar presente ao criar um novo cavaleiro
  }
  
  export interface Weapon {
    name: string;
    mod: number;
    attr: string;
    equipped: boolean;
  }
  
  export interface Attributes {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  }
  