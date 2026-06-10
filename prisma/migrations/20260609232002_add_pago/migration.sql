-- CreateTable
CREATE TABLE "pago" (
    "id" SERIAL NOT NULL,
    "comanda_id" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodo_pago" VARCHAR(50) NOT NULL,
    "proveedor_id" VARCHAR(100),
    "estado_pago" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pago_comanda_id_key" ON "pago"("comanda_id");

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_comanda_id_fkey" FOREIGN KEY ("comanda_id") REFERENCES "comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
