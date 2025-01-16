# Book API

## Description

This is an API for managing books. It has basic CRUD endpoints, and uses OpenLibrary to add extra information.

The book data from OpenLibrary is added to records in the moment of their creation, or when an update involves the ISBN field.

## Technologies

- NestJS
- TypeORM
- PostgreSQL
- Redis

## Running the app

```bash
docker compose up
```

## Running the tests

### Unit tests

```bash
docker compose exec -it app npm run test
```

### E2E tests

```bash
docker compose exec -it app npm run test:e2e
```
