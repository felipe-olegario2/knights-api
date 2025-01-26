import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KnightsService } from './knights.service';
import { KnightsController } from './knights.controller';
import { KnightSchema } from './models/knight.model';

@Module({
  imports: [
    // Importando o modelo específico para este módulo
    MongooseModule.forFeature([{ name: 'Knight', schema: KnightSchema }]),
  ],
  controllers: [KnightsController],
  providers: [KnightsService],
})
export class KnightsModule {}
