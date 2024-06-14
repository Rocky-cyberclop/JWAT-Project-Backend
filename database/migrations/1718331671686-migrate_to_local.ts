import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrateToLocal1718331671686 implements MigrationInterface {
    name = 'MigrateToLocal1718331671686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "userCreateId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userCreateId"`);
    }

}
