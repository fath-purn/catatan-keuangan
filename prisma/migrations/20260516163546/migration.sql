-- AlterTable
ALTER TABLE "User" ADD COLUMN     "code" TEXT,
ADD COLUMN     "codeExpires" TIMESTAMP(3),
ADD COLUMN     "isEmailVerifeid" BOOLEAN NOT NULL DEFAULT false;
