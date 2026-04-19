import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './collection.entity';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { Resource } from './resource.entity';
import { Tag } from './tag.entity';

@Module({
  imports: [
    // This registers the entity for THIS specific module
    TypeOrmModule.forFeature([Collection, Resource, Tag]),
  ],
  providers: [CollectionsService],
  controllers: [CollectionsController],
})
export class CollectionsModule {}