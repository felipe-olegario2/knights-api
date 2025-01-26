import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnightsModule } from './knights/knights.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [KnightsModule,
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis acessíveis em todo o projeto
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/knights',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
