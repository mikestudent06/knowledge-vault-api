import { Injectable, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Collection } from './collection.entity';
import { Resource } from './resource.entity';
import { Tag } from './tag.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepo: Repository<Collection>,

    @InjectRepository(Resource)
    private resourceRepo: Repository<Resource>,

    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
  ) { }

  // Create a new collection
  async create(name: string, description?: string): Promise<Collection> {
    const newCollection = this.collectionRepo.create({ name, description });
    return await this.collectionRepo.save(newCollection);
  }

  // Get all collections
  // async findAll(): Promise<Collection[]> {
  //   return await this.collectionRepo.find({relations: ['resources']});
  // }
  async findAll(): Promise<Collection[]> {
    return await this.collectionRepo.find();
  }

  async findCollectionById(id: number): Promise<Collection> {
    const collectionExists = await this.collectionRepo.findOne({ where: { id } });

    if (!collectionExists) {
      throw new NotFoundException("This collection doesn't exist");
    }

    return collectionExists;
  }

  // Create a new resource
  async createResource(collectionId: number, title: string, url?: string): Promise<Resource> {
    const colIdToUse = await this.findCollectionById(collectionId).then((d) => d.id);
    const newRes = this.resourceRepo.create({ title, url, collection: { id: colIdToUse } });
    return await this.resourceRepo.save(newRes);
  }

  async addResource(collectionId: number, title: string, url: string): Promise<Resource> {
    // 1. Find the collection first
    const collection = await this.collectionRepo.findOneBy({ id: collectionId });

    // 2. Error handling: If collection doesn't exist, we can't add a resource to it
    if (!collection) {
      throw new NotFoundException(`Collection with ID ${collectionId} not found`);
    }

    // 3. Create the resource and link the object
    const resource = this.resourceRepo.create({
      title,
      url,
      collection, // We pass the WHOLE collection object here
    });

    // 4. Save the resource
    return await this.resourceRepo.save(resource);
  }

  async addTagsToResource(resourceId: number, tagNames: string[]): Promise<Resource> {
    const resource = await this.resourceRepo.findOne({
      where: { id: resourceId },
      relations: ['tags'], // Load existing tags so we don't overwrite them
    });

    if (!resource) throw new NotFoundException('Resource not found');

    // 1. Process each tag name: Find it or Create it
    const tagEntities = await Promise.all(
      tagNames.map(async (name) => {
        let tag = await this.tagRepo.findOneBy({ name })
        if (!tag) {
          tag = this.tagRepo.create({ name })
          await this.tagRepo.save(tag)
        }
        return tag
      }))

    resource.tags = [...(resource.tags || []), ...tagEntities]

    return await this.resourceRepo.save(resource)
  }

  // async findCollectionsByTag(tagName: string): Promise<Collection[]> {
  //   const tag = await this.tagRepo.findOneBy({ name: tagName })
  //   if (!tag) throw new NotFoundException('Tag not found')

  //   // console.log('collections', collections.map(c=>c.resources.))
  //   const resources = await this.resourceRepo.find({ where: { tags: { name: tagName } }, relations: ['tags'] })
  //   // console.log('resources', resources)
  //   const collections = await this.collectionRepo.find({ where: { resources: { id: In(resources.map(r => r.id)) } }, relations: ['resources.tags'] })
  //   console.log('collections', collections)

  //   return collections
  // }

  async findCollectionsByTag(tagName: string):Promise<Collection[]> {
    return await this.collectionRepo.createQueryBuilder('collection')
    .leftJoinAndSelect('collection.resources', 'resource')
    .leftJoinAndSelect('resource.tags', 'tag')
    .where('tag.name = :name', {name : tagName})
    .getMany()
  }

  // async findCollectionsByTag(tagName: string):Promise<Collection[]> {
  //   return await this.collectionRepo.createQueryBuilder('collection')
  //   .leftJoinAndSelect('collection.resources', 'resource')
  //   .leftJoinAndSelect('resource.tags', 'tag')
  //   .where('tag.name = :name', {name : tagName})
  //   .getMany()
  // }
}
