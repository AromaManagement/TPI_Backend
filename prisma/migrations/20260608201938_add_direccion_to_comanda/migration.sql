-- AddForeignKey
ALTER TABLE "comanda" ADD CONSTRAINT "comanda_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "direccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
