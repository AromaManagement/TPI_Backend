/*
  Warnings:

  - You are about to drop the column `localidad_id` on the `direccion` table. All the data in the column will be lost.
  - You are about to drop the `comanda_aplicacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recorrido` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "comanda_aplicacion" DROP CONSTRAINT "comanda_aplicacion_comanda_id_fkey";

-- DropForeignKey
ALTER TABLE "comanda_aplicacion" DROP CONSTRAINT "comanda_aplicacion_direccion_id_fkey";

-- DropForeignKey
ALTER TABLE "direccion" DROP CONSTRAINT "direccion_localidad_id_fkey";

-- DropForeignKey
ALTER TABLE "recorrido" DROP CONSTRAINT "recorrido_comanda_aplicacion_id_fkey";

-- DropForeignKey
ALTER TABLE "recorrido" DROP CONSTRAINT "recorrido_empleado_id_fkey";

-- AlterTable
ALTER TABLE "comanda" ADD COLUMN     "direccion_id" INTEGER,
ADD COLUMN     "repartidor_id" INTEGER;

-- AlterTable
ALTER TABLE "direccion" DROP COLUMN "localidad_id";

-- DropTable
DROP TABLE "comanda_aplicacion";

-- DropTable
DROP TABLE "recorrido";

-- AddForeignKey
ALTER TABLE "comanda" ADD CONSTRAINT "comanda_repartidor_id_fkey" FOREIGN KEY ("repartidor_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
