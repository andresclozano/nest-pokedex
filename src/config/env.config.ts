export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongodb : process.env.POKEDEX_MONGODB,
    port : +process.env.PORT || 3000
})