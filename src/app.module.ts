import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsModule } from './collections/collections.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Mike007*',
    database: 'knowledge_vault',
    // entities: [__dirname + '/**/*.entity{.ts,.js}'],
    autoLoadEntities: true, // This is a helper! It automatically finds all @Entity() files
    synchronize: true,
  }),
  CollectionsModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
