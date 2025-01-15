import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBook1736903649824 implements MigrationInterface {
  name = 'CreateBook1736903649824';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "book" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "author" character varying NOT NULL, "description" character varying NOT NULL, "publishedDate" TIMESTAMP NOT NULL, "isbn" character varying NOT NULL, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "book"`);
  }
}
