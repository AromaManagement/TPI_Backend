/*
  Warnings:

  - The values [ASIGNADO] on the enum `EstadoComanda` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoComanda_new" AS ENUM ('SIN_ASIGNAR', 'EN_COCINA', 'LISTO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO');
ALTER TABLE "comanda" ALTER COLUMN "estado_comanda" TYPE "EstadoComanda_new" USING ("estado_comanda"::text::"EstadoComanda_new");
ALTER TYPE "EstadoComanda" RENAME TO "EstadoComanda_old";
ALTER TYPE "EstadoComanda_new" RENAME TO "EstadoComanda";
DROP TYPE "public"."EstadoComanda_old";
COMMIT;
