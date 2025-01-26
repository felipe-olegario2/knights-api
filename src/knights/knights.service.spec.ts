import { Test, TestingModule } from '@nestjs/testing';
import { KnightsService } from './knights.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('KnightsService', () => {
  let service: KnightsService;
  let mockKnightModel;

  const mockKnight = {
    _id: '1',
    name: 'Arthur',
    nickname: 'King',
    birthday: '1985-12-25',
    weapons: [
      { name: 'Sword', mod: 3, attr: 'strength', equipped: true },
    ],
    attributes: {
      strength: 15,
      dexterity: 10,
      constitution: 12,
      intelligence: 8,
      wisdom: 14,
      charisma: 13,
    },
    keyAttribute: 'strength',
    attack: 18,
    exp: 5000,
  };

  beforeEach(async () => {
    mockKnightModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      save: jest.fn(),
      create: jest.fn().mockImplementation((knight) => ({
        ...knight,
        save: jest.fn().mockResolvedValue({ ...knight, _id: '1' }),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KnightsService,
        {
          provide: getModelToken('Knight'),
          useValue: mockKnightModel,
        },
      ],
    }).compile();

    service = module.get<KnightsService>(KnightsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar todos os cavaleiros', async () => {
      mockKnightModel.find.mockResolvedValue([mockKnight]);

      const result = await service.findAll();
      expect(result).toEqual([
        {
          ...mockKnight,
          exp: expect.any(Number),
        },
      ]);
      expect(mockKnightModel.find).toHaveBeenCalled();
    });

    it('deve retornar apenas heróis quando o filtro for "heroes"', async () => {
      mockKnightModel.find.mockResolvedValue([mockKnight]);

      const result = await service.findAll('heroes');
      expect(result).toEqual([mockKnight]);
      expect(mockKnightModel.find).toHaveBeenCalledWith({ isHero: true });
    });

    it('deve lançar InternalServerErrorException em caso de erro', async () => {
      mockKnightModel.find.mockRejectedValue(new Error('Erro inesperado'));

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('deve retornar um cavaleiro pelo ID', async () => {
      mockKnightModel.findById.mockResolvedValue(mockKnight);

      const result = await service.findOne('1');
      expect(result).toEqual({
        ...mockKnight,
        exp: expect.any(Number),
      });
      expect(mockKnightModel.findById).toHaveBeenCalledWith('1');
    });

    it('deve lançar NotFoundException se o cavaleiro não for encontrado', async () => {
      mockKnightModel.findById.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('deve criar um novo cavaleiro', async () => {
      const createKnightDto = { ...mockKnight, _id: undefined };
      const createdKnight = { ...mockKnight, _id: '1' };
      mockKnightModel.create.mockReturnValue(createdKnight);

      const result = await service.create(createKnightDto);
      expect(result).toEqual(createdKnight);
      expect(mockKnightModel.create).toHaveBeenCalledWith(createKnightDto);
    });

    it('deve lançar InternalServerErrorException em caso de erro', async () => {
      mockKnightModel.create.mockRejectedValue(new Error('Erro inesperado'));

      await expect(service.create({} as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('markAsHero', () => {
    it('deve marcar um cavaleiro como herói', async () => {
      mockKnightModel.findByIdAndUpdate.mockResolvedValue({ ...mockKnight, isHero: true });

      const result = await service.markAsHero('1');
      expect(result).toEqual({ ...mockKnight, isHero: true });
      expect(mockKnightModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { isHero: true }, { new: true });
    });

    it('deve lançar NotFoundException se o cavaleiro não for encontrado', async () => {
      mockKnightModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.markAsHero('999')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar InternalServerErrorException em caso de erro', async () => {
      mockKnightModel.findByIdAndUpdate.mockRejectedValue(new Error('Erro inesperado'));

      await expect(service.markAsHero('1')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateNickname', () => {
    it('deve atualizar o apelido de um cavaleiro', async () => {
      const updatedKnight = { ...mockKnight, nickname: 'Heroic Knight' };
      mockKnightModel.findByIdAndUpdate.mockResolvedValue(updatedKnight);

      const result = await service.updateNickname('1', 'Heroic Knight');
      expect(result).toEqual(updatedKnight);
      expect(mockKnightModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { nickname: 'Heroic Knight' }, { new: true });
    });

    it('deve lançar NotFoundException se o cavaleiro não for encontrado', async () => {
      mockKnightModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.updateNickname('999', 'Test')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar InternalServerErrorException em caso de erro', async () => {
      mockKnightModel.findByIdAndUpdate.mockRejectedValue(new Error('Erro inesperado'));

      await expect(service.updateNickname('1', 'Test')).rejects.toThrow(InternalServerErrorException);
    });
  });
});
