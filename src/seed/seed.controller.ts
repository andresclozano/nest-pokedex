import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import axios from 'axios';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  executeSeed() {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=650')
    return this.seedService.executeSeed();
  }

}
