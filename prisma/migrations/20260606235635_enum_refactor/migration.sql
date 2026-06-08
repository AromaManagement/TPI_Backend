/*
  Warnings:

  - You are about to drop the column `cantidad` on the `articulo` table. All the data in the column will be lost.
  - You are about to drop the column `unidad_medida_id` on the `articulo` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_desde` on the `carta` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_hasta` on the `carta` table. All the data in the column will be lost.
  - You are about to drop the column `empleado_id` on the `comanda` table. All the data in the column will be lost.
  - You are about to drop the column `estado_comanda_id` on the `comanda` table. All the data in the column will be lost.
  - You are about to drop the column `cantidad` on the `detalle_comanda` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_mov_id` on the `movimiento_stock` table. All the data in the column will be lost.
  - You are about to drop the column `recorrido_id` on the `recorrido` table. All the data in the column will be lost.
  - You are about to drop the column `persona_id` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `rol_id` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the `cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comanda_restaurante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `empleado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estado_comanda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estado_recorrido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `persona` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rol` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tipo_empleado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tipo_mov` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `unidad_medida` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `precio_unitario` to the `detalle_comanda` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_mov` to the `movimiento_stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `plato_articulo` table without a default value. This is not possible if the table is not empty.
  - Made the column `nombre` on table `platos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `precio` on table `platos` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `apellido` to the `usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rol` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'CLIENTE', 'COCINERO', 'REPARTIDOR');

-- CreateEnum
CREATE TYPE "EstadoComanda" AS ENUM ('SIN_ASIGNAR', 'ASIGNADO', 'EN_COCINA', 'LISTO');

-- CreateEnum
CREATE TYPE "EstadoRecorrido" AS ENUM ('PENDIENTE', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoMov" AS ENUM ('INGRESO', 'EGRESO', 'AJUSTE', 'MERMA');

-- CreateEnum
CREATE TYPE "UnidadMedida" AS ENUM ('KG', 'G', 'L', 'ML', 'UNIDAD', 'PORCION');

-- DropForeignKey
ALTER TABLE "articulo" DROP CONSTRAINT "articulo_unidad_medida_id_fkey";

-- DropForeignKey
ALTER TABLE "cliente" DROP CONSTRAINT "cliente_persona_id_fkey";

-- DropForeignKey
ALTER TABLE "comanda" DROP CONSTRAINT "comanda_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "comanda" DROP CONSTRAINT "comanda_empleado_id_fkey";

-- DropForeignKey
ALTER TABLE "comanda" DROP CONSTRAINT "comanda_estado_comanda_id_fkey";

-- DropForeignKey
ALTER TABLE "comanda_restaurante" DROP CONSTRAINT "comanda_restaurante_comanda_id_fkey";

-- DropForeignKey
ALTER TABLE "empleado" DROP CONSTRAINT "empleado_persona_id_fkey";

-- DropForeignKey
ALTER TABLE "empleado" DROP CONSTRAINT "empleado_tipo_empleado_id_fkey";

-- DropForeignKey
ALTER TABLE "estado_recorrido" DROP CONSTRAINT "estado_recorrido_recorrido_id_fkey";

-- DropForeignKey
ALTER TABLE "movimiento_stock" DROP CONSTRAINT "movimiento_stock_tipo_mov_id_fkey";

-- DropForeignKey
ALTER TABLE "persona" DROP CONSTRAINT "persona_direccion_id_fkey";

-- DropForeignKey
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_persona_id_fkey";

-- DropForeignKey
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_rol_id_fkey";

-- DropIndex
DROP INDEX "usuario_persona_id_key";

-- AlterTable
ALTER TABLE "articulo" DROP COLUMN "cantidad",
DROP COLUMN "unidad_medida_id",
ADD COLUMN     "unidad_medida" "UnidadMedida";

-- AlterTable
ALTER TABLE "carta" DROP COLUMN "fecha_desde",
DROP COLUMN "fecha_hasta";

-- AlterTable
ALTER TABLE "comanda" DROP COLUMN "empleado_id",
DROP COLUMN "estado_comanda_id",
ADD COLUMN     "estado_comanda" "EstadoComanda";

-- AlterTable
ALTER TABLE "detalle_comanda" DROP COLUMN "cantidad",
ADD COLUMN     "empleado_id" INTEGER,
ADD COLUMN     "precio_unitario" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "movimiento_stock" DROP COLUMN "tipo_mov_id",
ADD COLUMN     "tipo_mov" "TipoMov" NOT NULL;

-- AlterTable
ALTER TABLE "plato_articulo" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "platos" ALTER COLUMN "nombre" SET NOT NULL,
ALTER COLUMN "precio" SET NOT NULL;

-- AlterTable
ALTER TABLE "recorrido" DROP COLUMN "recorrido_id",
ADD COLUMN     "empleado_id" INTEGER,
ADD COLUMN     "estado" "EstadoRecorrido",
ALTER COLUMN "fecha_in" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "persona_id",
DROP COLUMN "rol_id",
ADD COLUMN     "apellido" VARCHAR(100) NOT NULL,
ADD COLUMN     "direccion_id" INTEGER,
ADD COLUMN     "documento" VARCHAR(50),
ADD COLUMN     "nacimiento" DATE,
ADD COLUMN     "nombre" VARCHAR(100) NOT NULL,
ADD COLUMN     "rol" "Rol" NOT NULL,
ADD COLUMN     "tipo_documento" VARCHAR(50);

-- DropTable
DROP TABLE "cliente";

-- DropTable
DROP TABLE "comanda_restaurante";

-- DropTable
DROP TABLE "empleado";

-- DropTable
DROP TABLE "estado_comanda";

-- DropTable
DROP TABLE "estado_recorrido";

-- DropTable
DROP TABLE "persona";

-- DropTable
DROP TABLE "rol";

-- DropTable
DROP TABLE "tipo_empleado";

-- DropTable
DROP TABLE "tipo_mov";

-- DropTable
DROP TABLE "unidad_medida";

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "direccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comanda" ADD CONSTRAINT "comanda_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_comanda" ADD CONSTRAINT "detalle_comanda_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recorrido" ADD CONSTRAINT "recorrido_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
