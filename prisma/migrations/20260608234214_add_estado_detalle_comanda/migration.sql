-- CreateEnum
CREATE TYPE "EstadoDetalle" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'LISTO');

-- AlterTable
ALTER TABLE "detalle_comanda" ADD COLUMN     "estado_detalle" "EstadoDetalle" NOT NULL DEFAULT 'PENDIENTE';
