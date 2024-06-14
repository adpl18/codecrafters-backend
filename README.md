# codecrafters-backend

## Base Installation

1. Clone the repo
```bash
git clone https://github.com/adpl18/codecrafters-backend
```
2. Get the .env file from the team and copy it to the root of the project. (not needed now)
3. Get the secrets folder from the team and copy it to the root of the project. (not needed now)

### Continue with Docker

Must have docker desktop open for this steps

4. Compose the base app 
```bash
docker-compose build
```

```bash
docker-compose up -d
```
5. Create, migrate and seed database
```bash
# create database
$ docker-compose run app npx sequelize-cli db:create

# migrate models
$ docker-compose run app npx sequelize-cli db:migrate

# seed database
$ docker-compose run app npx sequelize-cli db:seed:all
``` 

- Create a migration
```
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
```

or simply

```
npx sequelize-cli migration:generate --name migration-name
```
6. Start app
```bash
docker-compose up -d
```

7. See logs

```
docker-compose logs app
```

```
docker-compose logs postgres
```

## Access to database with Docker
```bash
$ docker-compose up -d
$ docker ps
$ docker exec -it <CONTAINER ID Postgres> bash
$ psql desarrollo postgres
```
-General version
```bash
$ docker-compose up -d
$ docker ps
$ docker exec -it <CONTAINER ID Postgres> bash
$ psql <DB> postgres
```