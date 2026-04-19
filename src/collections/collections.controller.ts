import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { CollectionsService } from "./collections.service";

@Controller('collections')
export class CollectionsController {

  constructor(private readonly collectionsService: CollectionsService) {}

@Post()
async createCollection(@Body() body : {name : string, description?: string}) {
  return await this.collectionsService.create(body.name, body.description);
}

@Post("resources/:collectionId")
async createResource(@Param("collectionId") collectionId: number, @Body() body : {title : string, url?: string}) {
  return await this.collectionsService.createResource(collectionId, body.title, body.url);
}

@Get()
async getCollections() {
  return await this.collectionsService.findAll();
 }

 @Post(':id/resources') // Route: POST /collections/1/resources
  addResource(
    @Param('id', ParseIntPipe) id: number, 
    @Body('title') title: string,
    @Body('url') url: string
  ) {
    return this.collectionsService.addResource(id, title, url);
  }


@Post(':id/tags')
async addTags(
  @Param('id', ParseIntPipe) id: number,
  @Body('tags') tagNames: string[] // This looks for the "tags" key in the JSON object
) {
  return this.collectionsService.addTagsToResource(id, tagNames);
}
}