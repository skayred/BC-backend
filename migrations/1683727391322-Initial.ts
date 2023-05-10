import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1683727391322 implements MigrationInterface {
    name = 'Initial1683727391322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "external_name" character varying NOT NULL, "profileId" integer NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "UQ_b98fc6d496c94c3098ec92952e2" UNIQUE ("profileId")`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_b98fc6d496c94c3098ec92952e2" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_b98fc6d496c94c3098ec92952e2"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "UQ_b98fc6d496c94c3098ec92952e2"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "profile"`);
    }

}
