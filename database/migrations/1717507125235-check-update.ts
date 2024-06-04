import { MigrationInterface, QueryRunner } from "typeorm";

export class CheckUpdate1717507125235 implements MigrationInterface {
    name = 'CheckUpdate1717507125235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_group" RENAME COLUMN "id" TO "document_group_id"`);
        await queryRunner.query(`ALTER TABLE "document_group" RENAME CONSTRAINT "PK_cebe435c22e341f4823e0562a38" TO "PK_e77d5825a5c85b130b4502c662d"`);
        await queryRunner.query(`ALTER SEQUENCE "document_group_id_seq" RENAME TO "document_group_document_group_id_seq"`);
        await queryRunner.query(`ALTER TABLE "document" RENAME COLUMN "id" TO "document_id"`);
        await queryRunner.query(`ALTER TABLE "document" RENAME CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" TO "PK_78f5e16f1322a7b2b150364dddc"`);
        await queryRunner.query(`ALTER SEQUENCE "document_id_seq" RENAME TO "document_document_id_seq"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "role" TO "roles"`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum" RENAME TO "user_roles_enum"`);
        await queryRunner.query(`ALTER TABLE "user_project" RENAME COLUMN "id" TO "user_project_id"`);
        await queryRunner.query(`ALTER TABLE "user_project" RENAME CONSTRAINT "PK_72a40468c3924e43b934542e8e4" TO "PK_7c97820e4290e54c63708ee314a"`);
        await queryRunner.query(`ALTER SEQUENCE "user_project_id_seq" RENAME TO "user_project_user_project_id_seq"`);
        await queryRunner.query(`ALTER TABLE "knowledge" DROP CONSTRAINT "PK_4159ba98b65a20a8d1f257bc514"`);
        await queryRunner.query(`ALTER TABLE "knowledge" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "knowledge" ADD "knowledge_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "knowledge" ADD CONSTRAINT "PK_b0046a75d9eb1bb1a3ff00b1057" PRIMARY KEY ("knowledge_id")`);
        await queryRunner.query(`ALTER TABLE "knowledge" ADD "mediaId" integer`);
        await queryRunner.query(`ALTER TABLE "knowledge" ADD CONSTRAINT "UQ_ffffdcd6f0c4ded67b5e2888853" UNIQUE ("mediaId")`);
        await queryRunner.query(`ALTER TABLE "project" ADD "project_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "PK_1a480c5734c5aacb9cef7b1499d" PRIMARY KEY ("project_id")`);
        await queryRunner.query(`ALTER TABLE "project" ADD "mediaId" integer`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "UQ_da202d409d8ef857b92cd1a2392" UNIQUE ("mediaId")`);
        await queryRunner.query(`ALTER TABLE "knowledge" ADD CONSTRAINT "FK_ffffdcd6f0c4ded67b5e2888853" FOREIGN KEY ("mediaId") REFERENCES "media"("media_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_da202d409d8ef857b92cd1a2392" FOREIGN KEY ("mediaId") REFERENCES "media"("media_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_da202d409d8ef857b92cd1a2392"`);
        await queryRunner.query(`ALTER TABLE "knowledge" DROP CONSTRAINT "FK_ffffdcd6f0c4ded67b5e2888853"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "UQ_da202d409d8ef857b92cd1a2392"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "mediaId"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "PK_1a480c5734c5aacb9cef7b1499d"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "project_id"`);
        await queryRunner.query(`ALTER TABLE "knowledge" DROP CONSTRAINT "UQ_ffffdcd6f0c4ded67b5e2888853"`);
        await queryRunner.query(`ALTER TABLE "knowledge" DROP COLUMN "mediaId"`);
        await queryRunner.query(`ALTER TABLE "knowledge" DROP CONSTRAINT "PK_b0046a75d9eb1bb1a3ff00b1057"`);
        await queryRunner.query(`ALTER TABLE "knowledge" DROP COLUMN "knowledge_id"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "knowledge" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "knowledge" ADD CONSTRAINT "PK_4159ba98b65a20a8d1f257bc514" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER SEQUENCE "user_project_user_project_id_seq" RENAME TO "user_project_id_seq"`);
        await queryRunner.query(`ALTER TABLE "user_project" RENAME CONSTRAINT "PK_7c97820e4290e54c63708ee314a" TO "PK_72a40468c3924e43b934542e8e4"`);
        await queryRunner.query(`ALTER TABLE "user_project" RENAME COLUMN "user_project_id" TO "id"`);
        await queryRunner.query(`ALTER TYPE "public"."user_roles_enum" RENAME TO "user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "roles" TO "role"`);
        await queryRunner.query(`ALTER SEQUENCE "document_document_id_seq" RENAME TO "document_id_seq"`);
        await queryRunner.query(`ALTER TABLE "document" RENAME CONSTRAINT "PK_78f5e16f1322a7b2b150364dddc" TO "PK_e57d3357f83f3cdc0acffc3d777"`);
        await queryRunner.query(`ALTER TABLE "document" RENAME COLUMN "document_id" TO "id"`);
        await queryRunner.query(`ALTER SEQUENCE "document_group_document_group_id_seq" RENAME TO "document_group_id_seq"`);
        await queryRunner.query(`ALTER TABLE "document_group" RENAME CONSTRAINT "PK_e77d5825a5c85b130b4502c662d" TO "PK_cebe435c22e341f4823e0562a38"`);
        await queryRunner.query(`ALTER TABLE "document_group" RENAME COLUMN "document_group_id" TO "id"`);
    }

}
