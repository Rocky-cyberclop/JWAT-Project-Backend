import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBlogStarDetailCommentMediaBlogMediaHashTagBlogHashTag1717495064564 implements MigrationInterface {
    name = 'AddBlogStarDetailCommentMediaBlogMediaHashTagBlogHashTag1717495064564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "media" ("media_id" SERIAL NOT NULL, "url" character varying(255) NOT NULL, CONSTRAINT "PK_f955e01e6d5c845037a3082cab8" PRIMARY KEY ("media_id"))`);
        await queryRunner.query(`CREATE TABLE "blog_media" ("blog_media_id" SERIAL NOT NULL, "mediaId" integer, "blogId" integer, CONSTRAINT "PK_78cd6923fa69c155605daf002c3" PRIMARY KEY ("blog_media_id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("comment_id" SERIAL NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, "blogId" integer, CONSTRAINT "PK_6a9f9bf1cf9a09107d3224a0e9a" PRIMARY KEY ("comment_id"))`);
        await queryRunner.query(`CREATE TABLE "hash_tag" ("hash_tag_id" SERIAL NOT NULL, "hashTagName" character varying(50) NOT NULL, CONSTRAINT "PK_82d2c087bdb3ec558127df301fa" PRIMARY KEY ("hash_tag_id"))`);
        await queryRunner.query(`CREATE TABLE "hash_tag_blog" ("hash_tag_blog_id" SERIAL NOT NULL, "blogId" integer, "hashTagId" integer, CONSTRAINT "PK_44cb642e5c00224ff546abb0653" PRIMARY KEY ("hash_tag_blog_id"))`);
        await queryRunner.query(`CREATE TABLE "star_detail" ("star_detail_id" SERIAL NOT NULL, "userId" integer, "blogId" integer, CONSTRAINT "PK_cf2671162e1399d8282574aa3f8" PRIMARY KEY ("star_detail_id"))`);
        await queryRunner.query(`CREATE TABLE "blog" ("blog_id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_b7647f1f3b095a20e19c62ff529" PRIMARY KEY ("blog_id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "mediaId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_cd81db2b14bf99eaec0934d1f29" UNIQUE ("mediaId")`);
        await queryRunner.query(`ALTER TABLE "blog_media" ADD CONSTRAINT "FK_08b32c87893909a8e2e79b03615" FOREIGN KEY ("mediaId") REFERENCES "media"("media_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_media" ADD CONSTRAINT "FK_7c4f1f8db2b51dd47e49f0093a4" FOREIGN KEY ("blogId") REFERENCES "blog"("blog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_5dec255234c5b7418f3d1e88ce4" FOREIGN KEY ("blogId") REFERENCES "blog"("blog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hash_tag_blog" ADD CONSTRAINT "FK_b5e6cb84beab909378ad57b2a27" FOREIGN KEY ("blogId") REFERENCES "blog"("blog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hash_tag_blog" ADD CONSTRAINT "FK_25d211882e15cbcbbc3113faa11" FOREIGN KEY ("hashTagId") REFERENCES "hash_tag"("hash_tag_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "star_detail" ADD CONSTRAINT "FK_778204a74bb94209dd3ff248b23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "star_detail" ADD CONSTRAINT "FK_440b9e24f60a6e0ccfe711b6ea3" FOREIGN KEY ("blogId") REFERENCES "blog"("blog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog" ADD CONSTRAINT "FK_fc46ede0f7ab797b7ffacb5c08d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_cd81db2b14bf99eaec0934d1f29" FOREIGN KEY ("mediaId") REFERENCES "media"("media_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_cd81db2b14bf99eaec0934d1f29"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_fc46ede0f7ab797b7ffacb5c08d"`);
        await queryRunner.query(`ALTER TABLE "star_detail" DROP CONSTRAINT "FK_440b9e24f60a6e0ccfe711b6ea3"`);
        await queryRunner.query(`ALTER TABLE "star_detail" DROP CONSTRAINT "FK_778204a74bb94209dd3ff248b23"`);
        await queryRunner.query(`ALTER TABLE "hash_tag_blog" DROP CONSTRAINT "FK_25d211882e15cbcbbc3113faa11"`);
        await queryRunner.query(`ALTER TABLE "hash_tag_blog" DROP CONSTRAINT "FK_b5e6cb84beab909378ad57b2a27"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_5dec255234c5b7418f3d1e88ce4"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "blog_media" DROP CONSTRAINT "FK_7c4f1f8db2b51dd47e49f0093a4"`);
        await queryRunner.query(`ALTER TABLE "blog_media" DROP CONSTRAINT "FK_08b32c87893909a8e2e79b03615"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_cd81db2b14bf99eaec0934d1f29"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mediaId"`);
        await queryRunner.query(`DROP TABLE "blog"`);
        await queryRunner.query(`DROP TABLE "star_detail"`);
        await queryRunner.query(`DROP TABLE "hash_tag_blog"`);
        await queryRunner.query(`DROP TABLE "hash_tag"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "blog_media"`);
        await queryRunner.query(`DROP TABLE "media"`);
    }

}
