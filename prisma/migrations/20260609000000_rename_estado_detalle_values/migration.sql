-- AlterEnum: rename PENDIENTE -> SIN_ASIGNAR, EN_PROCESO -> EN_COCINA
ALTER TYPE "EstadoDetalle" RENAME VALUE 'PENDIENTE' TO 'SIN_ASIGNAR';
ALTER TYPE "EstadoDetalle" RENAME VALUE 'EN_PROCESO' TO 'EN_COCINA';

-- AlterTable: update column default
ALTER TABLE "detalle_comanda" ALTER COLUMN "estado_detalle" SET DEFAULT 'SIN_ASIGNAR'::"EstadoDetalle";
