import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Knight } from './interfaces/knight.interface';
import { CreateKnightDto } from './dto/create-knight.dto';

@Injectable()
export class KnightsService {
  constructor(@InjectModel('Knight') private readonly knightModel: Model<Knight>) {}

  private calculateMod(value: number): number {
    if (value <= 8) return -2;
    if (value <= 10) return -1;
    if (value <= 12) return 0;
    if (value <= 15) return 1;
    if (value <= 18) return 2;
    return 3;
  }

  private calculateAttack(knight: CreateKnightDto): number {
    const keyMod = this.calculateMod(knight.attributes[knight.keyAttribute]);
    const equippedWeapon = knight.weapons.find((weapon) => weapon.equipped);
    const weaponMod = equippedWeapon ? equippedWeapon.mod : 0;
    return 10 + keyMod + weaponMod;
  }

  private calculateExperience(birthday: string): number {
    const age = new Date().getFullYear() - new Date(birthday).getFullYear();
    if (age <= 7) return 0;
    return Math.floor((age - 7) * Math.pow(22, 1.45));
  }

  async findAll(filter?: string) {
    try {
      
      if (filter === 'heroes') {
        const knights = await this.knightModel.find({isHero: true});
        return knights.map((knight) => ({
          ...knight.toObject(),
          exp: this.calculateExperience(knight.birthday),
          attack: this.calculateAttack(knight)
        }));
      }

      const knights = await this.knightModel.find();

      return knights.map((knight) => ({
        ...knight.toObject(),
        exp: this.calculateExperience(knight.birthday),
        attack: this.calculateAttack(knight)
      }));
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch knights.');
    }
  }

  async findOne(id: string) {
    try {
      const knight = await this.knightModel.findById(id);

      if (!knight) {
        throw new NotFoundException(`Knight with ID ${id} not found.`);
      }

      return {
        ...knight.toObject(),
        exp: this.calculateExperience(knight.birthday),
        attack: this.calculateAttack(knight)
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch knight.');
    }
  }

  async create(knight: CreateKnightDto) {
    try {
      const newKnight = new this.knightModel(knight);
      return newKnight.save();
    } catch (error) {
      
      throw new InternalServerErrorException(`Failed to create knight: ${error}`);
    }
  }

  async markAsHero(id: string) {
    try {
      const knight = await this.knightModel.findByIdAndUpdate(
        id,
        { isHero: true },
        { new: true },
      );
      if (!knight) {
        throw new NotFoundException(`Knight with ID ${id} not found.`);
      }
      return knight;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to mark knight as hero.');
    }
  }

  async updateNickname(id: string, nickname: string) {
    try {
      const knight = await this.knightModel.findByIdAndUpdate(id, { nickname }, { new: true });
      if (!knight) {
        throw new NotFoundException(`Knight with ID ${id} not found.`);
      }
      return knight;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update nickname.');
    }
  }
}