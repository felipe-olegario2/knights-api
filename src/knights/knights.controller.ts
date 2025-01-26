import { Controller, Get, Post, Param, Delete, Put, Body, Query, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { KnightsService } from './knights.service';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateKnightDto } from './dto/create-knight.dto';
import { UpdateKnightDto } from './dto/update-knight.dto';

@Controller('knights')
export class KnightsController {
  constructor(private readonly knightsService: KnightsService) {}

  @ApiQuery({ name: 'filter', required: false, description: 'Filtrar por tipo de cavaleiro (heroes)' })
  @Get()
  async getKnights(@Query('filter') filter: string) {
    try {
      return await this.knightsService.findAll(filter);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch knights.');
    }
  }

  @Get(':id')
  async getKnight(@Param('id') id: string) {
    try {
      return await this.knightsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch knight.');
    }
  }

  @Post()
  @ApiBody({ type: CreateKnightDto })
  async createKnight(@Body() knight: CreateKnightDto) {
    try {
      return await this.knightsService.create(knight);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create knight.');
    }
  }

  @Delete(':id')
  async deleteKnight(@Param('id') id: string) {
    try {
      return await this.knightsService.markAsHero(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete knight.');
    }
  }

  @Put(':id')
  @ApiBody({ type: UpdateKnightDto })
  async updateKnight(@Param('id') id: string, @Body() updateKnightDto: UpdateKnightDto) {
    try {
      return await this.knightsService.updateNickname(id, updateKnightDto.nickname);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update nickname.');
    }
  }
}