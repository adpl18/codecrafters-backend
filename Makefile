#!make
build:
	docker-compose build
up:
	docker-compose up -d

create-db:
	docker-compose run app npx sequelize-cli db:create
	
migrate-db:
	docker-compose run app npx sequelize-cli db:migrate

seed-db:
	docker-compose run app npx sequelize-cli db:seed:all

drop-db:
	docker-compose run app npx sequelize-cli db:drop

make test:
	docker-compose run --rm test npm run test

make test-coverage:
	docker-compose run --rm test npm run test -- --coverage

make test-verbose:
	docker-compose run --rm test npm run test -- --verbose