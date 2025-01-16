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

Copy `.env.example` to `.env` and fill in the values. Then run:

```bash
docker compose up
```

The application will be available at `http://localhost:3000`.

## Running the tests

### Unit tests

```bash
docker compose exec -it app npm run test
```

### E2E tests

```bash
docker compose exec -it app npm run test:e2e
```
