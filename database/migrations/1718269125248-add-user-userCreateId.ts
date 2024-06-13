import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserUserCreateId1718269125248 implements MigrationInterface {
    name = 'AddUserUserCreateId1718269125248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "userCreateId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userCreateId"`);
    }

}
