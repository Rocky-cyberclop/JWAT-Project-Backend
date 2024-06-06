import { MigrationInterface, QueryRunner } from "typeorm";

export class EditMediaMediaType1717644316403 implements MigrationInterface {
    name = 'EditMediaMediaType1717644316403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ADD "mediaType" character varying(20) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "mediaType"`);
    }

}
