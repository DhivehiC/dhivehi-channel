-- CreateEnum
CREATE TYPE "Models" AS ENUM ('Users', 'Posts');

-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('active', 'banned');

-- CreateEnum
CREATE TYPE "userRoles" AS ENUM ('writers', 'editors', 'admins');

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "model" "Models",
    "new_data" JSONB,
    "old_data" JSONB,
    "action" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" INTEGER NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "userStatus" NOT NULL DEFAULT 'active',
    "role" "userRoles" NOT NULL DEFAULT 'editors',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "latin_title" TEXT NOT NULL,
    "long_title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "yt_url" TEXT,
    "content" TEXT NOT NULL,
    "breaking" BOOLEAN,
    "live_blog" BOOLEAN,
    "feature_image_id" INTEGER,
    "feature_image_caption" TEXT,
    "category_id" INTEGER NOT NULL,
    "total_view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "updated_by" JSONB,
    "created_by_user_id" INTEGER NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViewCount" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER,
    "count" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ViewCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "published_by_user_id" INTEGER,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "latin_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_by_user_id" INTEGER NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "latin_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_by_user_id" INTEGER NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostsToTags" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER,
    "tag_id" INTEGER,

    CONSTRAINT "PostsToTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaLibrary" (
    "id" SERIAL NOT NULL,
    "caption" TEXT,
    "tags" TEXT,
    "base64" TEXT,
    "url" TEXT NOT NULL,
    "created_by_user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaLibrary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" SERIAL NOT NULL,
    "phone" INTEGER NOT NULL,
    "nasheedVote" BOOLEAN NOT NULL DEFAULT false,
    "solihVote" BOOLEAN NOT NULL DEFAULT false,
    "tries" INTEGER NOT NULL DEFAULT 1,
    "otp" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atolls" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Atolls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Islands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "atoll_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Islands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voteBoxes" (
    "id" SERIAL NOT NULL,
    "box_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "island_id" INTEGER NOT NULL,
    "eligible" INTEGER,
    "no_show" INTEGER,
    "void" INTEGER,
    "ibu" INTEGER,
    "anni" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voteBoxes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_email_idx" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Posts_id_created_at_idx" ON "Posts"("id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "Comments_id_idx" ON "Comments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_title_key" ON "Categories"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_latin_title_key" ON "Categories"("latin_title");

-- CreateIndex
CREATE INDEX "Categories_latin_title_created_at_idx" ON "Categories"("latin_title", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Tags_title_key" ON "Tags"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_latin_title_key" ON "Tags"("latin_title");

-- CreateIndex
CREATE INDEX "Tags_latin_title_created_at_idx" ON "Tags"("latin_title", "created_at" DESC);

-- CreateIndex
CREATE INDEX "PostsToTags_id_idx" ON "PostsToTags"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MediaLibrary_url_key" ON "MediaLibrary"("url");

-- CreateIndex
CREATE INDEX "MediaLibrary_url_created_at_idx" ON "MediaLibrary"("url", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Poll_phone_key" ON "Poll"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Atolls_name_key" ON "Atolls"("name");

-- CreateIndex
CREATE UNIQUE INDEX "voteBoxes_box_number_key" ON "voteBoxes"("box_number");

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_feature_image_id_fkey" FOREIGN KEY ("feature_image_id") REFERENCES "MediaLibrary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewCount" ADD CONSTRAINT "ViewCount_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_published_by_user_id_fkey" FOREIGN KEY ("published_by_user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsToTags" ADD CONSTRAINT "PostsToTags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsToTags" ADD CONSTRAINT "PostsToTags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaLibrary" ADD CONSTRAINT "MediaLibrary_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Islands" ADD CONSTRAINT "Islands_atoll_id_fkey" FOREIGN KEY ("atoll_id") REFERENCES "Atolls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voteBoxes" ADD CONSTRAINT "voteBoxes_island_id_fkey" FOREIGN KEY ("island_id") REFERENCES "Islands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
