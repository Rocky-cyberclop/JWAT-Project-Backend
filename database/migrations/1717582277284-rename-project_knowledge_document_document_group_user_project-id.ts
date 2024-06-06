import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameProjectKnowledgeDocumentDocumentGroupUserProjectId1717582277284 implements MigrationInterface {
    name = 'RenameProjectKnowledgeDocumentDocumentGroupUserProjectId1717582277284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_group" RENAME COLUMN "id" TO "document_group_id"`);
        await queryRunner.query(`ALTER TABLE "document_group" RENAME CONSTRAINT "PK_cebe435c22e341f4823e0562a38" TO "PK_e77d5825a5c85b130b4502c662d"`);
        await queryRunner.query(`ALTER SEQUENCE "document_group_id_seq" RENAME TO "document_group_document_group_id_seq"`);
        await queryRunner.query(`ALTER TABLE "document" RENAME COLUMN "id" TO "document_id"`);
        await queryRunner.query(`ALTER TABLE "document" RENAME CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" TO "PK_78f5e16f1322a7b2b150364dddc"`);
        await queryRunner.query(`ALTER SEQUENCE "document_id_seq" RENAME TO "document_document_id_seq"`);
        await queryRunner.query(`ALTER TABLE "knowledge" RENAME COLUMN "id" TO "knowledge_id"`);
        await queryRunner.query(`ALTER TABLE "knowledge" RENAME CONSTRAINT "PK_4159ba98b65a20a8d1f257bc514" TO "PK_b0046a75d9eb1bb1a3ff00b1057"`);
        await queryRunner.query(`ALTER SEQUENCE "knowledge_id_seq" RENAME TO "knowledge_knowledge_id_seq"`);
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "id" TO "project_id"`);
        await queryRunner.query(`ALTER TABLE "project" RENAME CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" TO "PK_1a480c5734c5aacb9cef7b1499d"`);
        await queryRunner.query(`ALTER SEQUENCE "project_id_seq" RENAME TO "project_project_id_seq"`);
        await queryRunner.query(`ALTER TABLE "user_project" RENAME COLUMN "id" TO "user_project_id"`);
        await queryRunner.query(`ALTER TABLE "user_project" RENAME CONSTRAINT "PK_72a40468c3924e43b934542e8e4" TO "PK_7c97820e4290e54c63708ee314a"`);
        await queryRunner.query(`ALTER SEQUENCE "user_project_id_seq" RENAME TO "user_project_user_project_id_seq"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER SEQUENCE "user_project_user_project_id_seq" RENAME TO "user_project_id_seq"`);
        await queryRunner.query(`ALTER TABLE "user_project" RENAME CONSTRAINT "PK_7c97820e4290e54c63708ee314a" TO "PK_72a40468c3924e43b934542e8e4"`);
        await queryRunner.query(`ALTER TABLE "user_project" RENAME COLUMN "user_project_id" TO "id"`);
        await queryRunner.query(`ALTER SEQUENCE "project_project_id_seq" RENAME TO "project_id_seq"`);
        await queryRunner.query(`ALTER TABLE "project" RENAME CONSTRAINT "PK_1a480c5734c5aacb9cef7b1499d" TO "PK_4d68b1358bb5b766d3e78f32f57"`);
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "project_id" TO "id"`);
        await queryRunner.query(`ALTER SEQUENCE "knowledge_knowledge_id_seq" RENAME TO "knowledge_id_seq"`);
        await queryRunner.query(`ALTER TABLE "knowledge" RENAME CONSTRAINT "PK_b0046a75d9eb1bb1a3ff00b1057" TO "PK_4159ba98b65a20a8d1f257bc514"`);
        await queryRunner.query(`ALTER TABLE "knowledge" RENAME COLUMN "knowledge_id" TO "id"`);
        await queryRunner.query(`ALTER SEQUENCE "document_document_id_seq" RENAME TO "document_id_seq"`);
        await queryRunner.query(`ALTER TABLE "document" RENAME CONSTRAINT "PK_78f5e16f1322a7b2b150364dddc" TO "PK_e57d3357f83f3cdc0acffc3d777"`);
        await queryRunner.query(`ALTER TABLE "document" RENAME COLUMN "document_id" TO "id"`);
        await queryRunner.query(`ALTER SEQUENCE "document_group_document_group_id_seq" RENAME TO "document_group_id_seq"`);
        await queryRunner.query(`ALTER TABLE "document_group" RENAME CONSTRAINT "PK_e77d5825a5c85b130b4502c662d" TO "PK_cebe435c22e341f4823e0562a38"`);
        await queryRunner.query(`ALTER TABLE "document_group" RENAME COLUMN "document_group_id" TO "id"`);
    }

}
