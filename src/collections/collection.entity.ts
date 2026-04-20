import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Resource } from './resource.entity';

@Entity('collections') // This tells TypeORM this class is a database table named 'collections'
export class Collection {
  @PrimaryGeneratedColumn() // Automatically increments a unique ID (1, 2, 3...)
  id: number;

  @Column() // Creates a basic VARCHAR column
  name: string;

  @Column({ nullable: true }) // An optional description column
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // One collection has many resources
  // @OneToMany(()=> Resource, resource => resource.collection)
  // resources: Resource[];

  //This makes sure resources are always loaded
  @OneToMany(() => Resource, (resource) => resource.collection, { eager: true })
  resources: Resource[];
}