import { Test, TestingModule } from '@nestjs/testing';
import { KnightsController } from './knights.controller';
import { KnightsService } from './knights.service';
import { CreateKnightDto } from './dto/create-knight.dto';
import { UpdateKnightDto } from './dto/update-knight.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('KnightsController', () => {
  let controller: KnightsController;
  let service: KnightsService;

  const mockKnightsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    markAsHero: jest.fn(),
    updateNickname: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KnightsController],
      providers: [
        {
          provide: KnightsService,
          useValue: mockKnightsService,
        },
      ],
    }).compile();

    controller = module.get<KnightsController>(KnightsController);
    service = module.get<KnightsService>(KnightsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getKnights', () => {
    it('deve retornar uma lista de cavaleiros', async () => {
      const mockKnights = [{ name: 'Arthur', nickname: 'King' }];
      mockKnightsService.findAll.mockResolvedValue(mockKnights);

      const result = await controller.getKnights('');
      expect(result).toEqual(mockKnights);
      expect(service.findAll).toHaveBeenCalledWith('');
    });

    it('deve lançar InternalServerErrorException se ocorrer um erro', async () => {
      mockKnightsService.findAll.mockRejectedValue(new Error('Erro inesperado'));

      await expect(controller.getKnights('')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getKnight', () => {
    it('deve retornar um cavaleiro pelo ID', async () => {
      const mockKnight = { name: 'Arthur', nickname: 'King' };
      mockKnightsService.findOne.mockResolvedValue(mockKnight);

      const result = await controller.getKnight('1');
      expect(result).toEqual(mockKnight);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('deve lançar NotFoundException se o cavaleiro não for encontrado', async () => {
      mockKnightsService.findOne.mockRejectedValue(new NotFoundException('Cavaleiro não encontrado'));

      await expect(controller.getKnight('999')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar InternalServerErrorException para outros erros', async () => {
      mockKnightsService.findOne.mockRejectedValue(new Error('Erro inesperado'));

      await expect(controller.getKnight('1')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createKnight', () => {
    it('deve criar um novo cavaleiro', async () => {
      const mockCreateDto: CreateKnightDto = {
        name: 'Lancelot',
        nickname: 'Brave Knight',
        birthday: '1990-01-01',
        weapons: [],
        attributes: {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        keyAttribute: 'strength',
      };

      mockKnightsService.create.mockResolvedValue({ id: '1', ...mockCreateDto });

      const result = await controller.createKnight(mockCreateDto);
      expect(result).toEqual({ id: '1', ...mockCreateDto });
      expect(service.create).toHaveBeenCalledWith(mockCreateDto);
    });

    it('deve lançar InternalServerErrorException se ocorrer um erro', async () => {
      mockKnightsService.create.mockRejectedValue(new Error('Erro inesperado'));

      await expect(controller.createKnight({} as CreateKnightDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteKnight', () => {
    it('deve marcar o cavaleiro como herói (deletar)', async () => {
      mockKnightsService.markAsHero.mockResolvedValue({ message: 'Cavaleiro marcado como herói' });

      const result = await controller.deleteKnight('1');
      expect(result).toEqual({ message: 'Cavaleiro marcado como herói' });
      expect(service.markAsHero).toHaveBeenCalledWith('1');
    });

    it('deve lançar NotFoundException se o cavaleiro não for encontrado', async () => {
      mockKnightsService.markAsHero.mockRejectedValue(new NotFoundException('Cavaleiro não encontrado'));

      await expect(controller.deleteKnight('999')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar InternalServerErrorException para outros erros', async () => {
      mockKnightsService.markAsHero.mockRejectedValue(new Error('Erro inesperado'));

      await expect(controller.deleteKnight('1')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateKnight', () => {
    it('deve atualizar o apelido de um cavaleiro', async () => {
      const mockUpdateDto: UpdateKnightDto = { nickname: 'Heroic Knight' };
      mockKnightsService.updateNickname.mockResolvedValue({
        id: '1',
        nickname: 'Heroic Knight',
      });

      const result = await controller.updateKnight('1', mockUpdateDto);
      expect(result).toEqual({ id: '1', nickname: 'Heroic Knight' });
      expect(service.updateNickname).toHaveBeenCalledWith('1', mockUpdateDto.nickname);
    });

    it('deve lançar NotFoundException se o cavaleiro não for encontrado', async () => {
      mockKnightsService.updateNickname.mockRejectedValue(
        new NotFoundException('Cavaleiro não encontrado'),
      );

      await expect(controller.updateKnight('999', { nickname: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar InternalServerErrorException para outros erros', async () => {
      mockKnightsService.updateNickname.mockRejectedValue(new Error('Erro inesperado'));

      await expect(controller.updateKnight('1', { nickname: 'Test' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
