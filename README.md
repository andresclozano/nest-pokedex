<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

1. Instalacion

```bash
$ npm install
```

2. Instalar Nest Clid

```
npm i -g @nestjs/cli
```

3. Levantar la base de datos

```
docker-compose up -d
```

4. Clonar el archivo __.env.template__ y renombrar la copia a __.env__

5. Llenar las variables de entorno definidas en el __.env__

6. Ejecutar la aplicación en dev:

```
yarn start:dev
``` 

7. Reconstruir la base de datos con semilla
```
http://localhost:3000/api/seed
```

# Stack

- MongoDb
- Nest Js
