import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    POKEDEX_MONGODB: Joi.required(),
    PORT: Joi.number().default(3000)
});