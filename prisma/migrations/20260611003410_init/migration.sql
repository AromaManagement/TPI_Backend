-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'CLIENTE', 'COCINERO', 'REPARTIDOR');

-- CreateEnum
CREATE TYPE "EstadoComanda" AS ENUM ('SIN_PAGAR', 'SIN_ASIGNAR', 'EN_COCINA', 'LISTO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoDetalle" AS ENUM ('SIN_ASIGNAR', 'EN_COCINA', 'LISTO');

-- CreateEnum
CREATE TYPE "TipoMov" AS ENUM ('INGRESO', 'EGRESO', 'AJUSTE', 'MERMA');

-- CreateEnum
CREATE TYPE "UnidadMedida" AS ENUM ('KG', 'G', 'L', 'ML', 'UNIDAD', 'PORCION');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'MERCADOPAGO');

-- CreateTable
CREATE TABLE "localidad" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "localidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direccion" (
    "id" SERIAL NOT NULL,
    "barrio" VARCHAR(150),
    "calle" VARCHAR(150),
    "manzana_piso" VARCHAR(50),
    "numeracion" VARCHAR(20),
    "referencia" VARCHAR(255),
    "casa_depto" VARCHAR(50),
    "localidad_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "direccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "correo" VARCHAR(150) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "tipo_documento" VARCHAR(50),
    "documento" VARCHAR(50),
    "telefono" VARCHAR(20),
    "nacimiento" DATE,
    "direccion_id" INTEGER,
    "rol" "Rol" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articulo" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "es_ingrediente" BOOLEAN NOT NULL DEFAULT false,
    "unidad_medida" "UnidadMedida",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "articulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock" (
    "id" SERIAL NOT NULL,
    "articulo_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "minimo" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimiento_stock" (
    "id" SERIAL NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "tipo_mov" "TipoMov" NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "fecha" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "movimiento_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagen" (
    "id" SERIAL NOT NULL,
    "imagen_si" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "imagen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carta" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "carta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secciones" (
    "id" SERIAL NOT NULL,
    "carta_id" INTEGER NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "detalle" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "secciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platos" (
    "id" SERIAL NOT NULL,
    "seccion_id" INTEGER NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "detalle" TEXT,
    "imagen_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "platos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plato_articulo" (
    "plato_id" INTEGER NOT NULL,
    "articulo_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plato_articulo_pkey" PRIMARY KEY ("plato_id","articulo_id")
);

-- CreateTable
CREATE TABLE "comanda" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER,
    "estado_comanda" "EstadoComanda",
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_entrega" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "direccion_id" INTEGER,
    "repartidor_id" INTEGER,

    CONSTRAINT "comanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_comanda" (
    "id" SERIAL NOT NULL,
    "comanda_id" INTEGER NOT NULL,
    "empleado_id" INTEGER,
    "plato_id" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "estado_detalle" "EstadoDetalle" NOT NULL DEFAULT 'SIN_ASIGNAR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "detalle_comanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pago" (
    "id" SERIAL NOT NULL,
    "comanda_id" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodo_pago" VARCHAR(50) NOT NULL,
    "proveedor_id" VARCHAR(100),
    "estado_pago" VARCHAR(50) NOT NULL,
    "url_pago" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "stock_articulo_id_key" ON "stock"("articulo_id");

-- CreateIndex
CREATE UNIQUE INDEX "pago_comanda_id_key" ON "pago"("comanda_id");

-- AddForeignKey
ALTER TABLE "direccion" ADD CONSTRAINT "direccion_localidad_id_fkey" FOREIGN KEY ("localidad_id") REFERENCES "localidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "direccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "articulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_stock" ADD CONSTRAINT "movimiento_stock_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secciones" ADD CONSTRAINT "secciones_carta_id_fkey" FOREIGN KEY ("carta_id") REFERENCES "carta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platos" ADD CONSTRAINT "platos_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "secciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platos" ADD CONSTRAINT "platos_imagen_id_fkey" FOREIGN KEY ("imagen_id") REFERENCES "imagen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plato_articulo" ADD CONSTRAINT "plato_articulo_plato_id_fkey" FOREIGN KEY ("plato_id") REFERENCES "platos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plato_articulo" ADD CONSTRAINT "plato_articulo_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "articulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comanda" ADD CONSTRAINT "comanda_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comanda" ADD CONSTRAINT "comanda_repartidor_id_fkey" FOREIGN KEY ("repartidor_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comanda" ADD CONSTRAINT "comanda_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "direccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_comanda" ADD CONSTRAINT "detalle_comanda_comanda_id_fkey" FOREIGN KEY ("comanda_id") REFERENCES "comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_comanda" ADD CONSTRAINT "detalle_comanda_plato_id_fkey" FOREIGN KEY ("plato_id") REFERENCES "platos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_comanda" ADD CONSTRAINT "detalle_comanda_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_comanda_id_fkey" FOREIGN KEY ("comanda_id") REFERENCES "comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
