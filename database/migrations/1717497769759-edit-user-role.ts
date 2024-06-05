import { MigrationInterface, QueryRunner } from "typeorm";

export class EditUserRole1717497769759 implements MigrationInterface {
    name = 'EditUserRole1717497769759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "roles" TO "role"`);
        await queryRunner.query(`ALTER TYPE "public"."user_roles_enum" RENAME TO "user_role_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum" RENAME TO "user_roles_enum"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "role" TO "roles"`);
    }

}
