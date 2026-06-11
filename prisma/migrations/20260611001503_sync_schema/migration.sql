/*
  Warnings:

  - Added the required column `localidad_id` to the `direccion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "direccion" ADD COLUMN     "localidad_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "direccion" ADD CONSTRAINT "direccion_localidad_id_fkey" FOREIGN KEY ("localidad_id") REFERENCES "localidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
