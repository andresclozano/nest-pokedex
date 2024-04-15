import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {


  constructor(private readonly pokemonService: PokemonService,
              private readonly http: AxiosAdapter
  ) {  }

  async executeSeed() {
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=151');

    await this.pokemonService.removeAll();

    let pokemons: CreatePokemonDto[] = [];
    data.results.forEach(( { name, url }) => {
      const segments = url.split('/');
      const pokemonId: number = +segments[segments.length - 2];
      
      const createPokemonDto = new CreatePokemonDto();
        createPokemonDto.name = name;
        createPokemonDto.no = pokemonId;
      pokemons.push(createPokemonDto);

    });

    await this.pokemonService.createMulti(pokemons);
    return 'Seed Executed';
  }

}
