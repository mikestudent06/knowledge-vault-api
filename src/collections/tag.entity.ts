import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Resource } from './resource.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // We don't want duplicate tag names
  name: string;

  @ManyToMany(()=> Resource, resource => resource.tags)
  resources: Resource[];
}