import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>) {

  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    }catch(error){
      this.handleException(error);
    }
  }

  async createMulti(createPokemonDto: CreatePokemonDto[]) {
    createPokemonDto.forEach((pokemon) => {
      pokemon.name = pokemon.name.toLowerCase();
    })
    try {
      const pokemon = await this.pokemonModel.insertMany(createPokemonDto);
      return pokemon;
    }catch(error){
      this.handleException(error);
    }
  }

  findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination
    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no : 1
      })
      .select('-__v')
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    // No.
    if (!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({
        no : term
      });
    }

    // Mongo Id
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name : term.toLowerCase()
      })
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with term: ${term} not found`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true});
      return { ...pokemon.toJSON(), ...updatePokemonDto};
    }catch(error){
      this.handleException(error);
    }

    
  }

  async remove(id: string) {
    const { deletedCount} = await this.pokemonModel.deleteOne({ _id : id});
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }
    return ;
  }

  async removeAll() {
    await this.pokemonModel.deleteMany({});
    return;
  }

  private handleException(error: any) {
    if (error.code === 11000){
      throw new BadRequestException(`Pokemon already exists in db ${JSON.stringify(error.keyValue)}`); 
    } else {
      console.error(error);
      throw new InternalServerErrorException(`Can't update Pokemon - Check server logs`);
    }
  }

}
