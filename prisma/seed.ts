import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  // Limpiar en orden inverso de dependencias
  await prisma.pago.deleteMany({});
  await prisma.detalleComanda.deleteMany({});
  await prisma.comanda.deleteMany({});
  await prisma.platoArticulo.deleteMany({});
  await prisma.movimientoStock.deleteMany({});
  await prisma.stock.deleteMany({});
  await prisma.articulo.deleteMany({});
  await prisma.platos.deleteMany({});
  await prisma.secciones.deleteMany({});
  await prisma.carta.deleteMany({});
  await prisma.usuario.deleteMany({});
  await prisma.direccion.deleteMany({});

  console.log("✓ Base de datos limpia.");

  const hash = await bcrypt.hash("12345678", 10);

  await prisma.usuario.create({
    data: {
      correo: "admin@aromas.com",
      contrasena: hash,
      nombre: "Admin",
      apellido: "Aromas",
      rol: "ADMIN",
      telefono: "2610000000",
    },
  });

  console.log("✓ Admin creado: admin@aromas.com / 12345678");
  console.log("Seed finalizado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
