import { MigrationInterface, QueryRunner } from "typeorm";

export class EditUserAddAttributeRoles1716975172546 implements MigrationInterface {
    name = 'EditUserAddAttributeRoles1716975172546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_roles_enum" AS ENUM('ADMIN', 'MANAGER', 'EMPLOYEE')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "roles" "public"."user_roles_enum" NOT NULL DEFAULT 'EMPLOYEE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
        await queryRunner.query(`DROP TYPE "public"."user_roles_enum"`);
    }

}
