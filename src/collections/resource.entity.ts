import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Collection } from './collection.entity';
import { Tag } from './tag.entity';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  url: string;

  @JoinColumn({ name: 'collectionId' })
  // Many resources belong to one collection
  @ManyToOne(()=> Collection, collection => collection.resources, { onDelete: 'CASCADE' })
  collection: Collection;

  @ManyToMany(()=> Tag, tag => tag.resources)
  @JoinTable() // This creates the 'resources_tags' junction table automatically
  tags: Tag[];
}