import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const correo = "admin@aromas.com";
  const contrasena = await bcrypt.hash("12345678", 10);

  await prisma.usuario.upsert({
    where: { correo },
    update: {},
    create: {
      correo,
      contrasena,
      nombre: "Admin",
      apellido: "Aromas",
      rol: "ADMIN",
    },
  });

  console.log("✓ Usuario admin creado:", correo);

  const correoRepartidor = "repartidor@aromas.com";
  await prisma.usuario.upsert({
    where: { correo: correoRepartidor },
    update: { telefono: "2614001122" },
    create: {
      correo: correoRepartidor,
      contrasena: await bcrypt.hash("12345678", 10),
      nombre: "Carlos",
      apellido: "Gómez",
      telefono: "2614001122",
      rol: "REPARTIDOR",
    },
  });

  console.log("✓ Usuario repartidor creado:", correoRepartidor);

  // Cliente de prueba con dirección
  const correoCliente = "cliente@aromas.com";
  const direccion = await prisma.direccion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      calle: "San Martín",
      numeracion: "1234",
      barrio: "Centro",
      referencia: "Frente a la plaza",
    },
  });

  const cliente = await prisma.usuario.upsert({
    where: { correo: correoCliente },
    update: { telefono: "2614009988" },
    create: {
      correo: correoCliente,
      contrasena: await bcrypt.hash("12345678", 10),
      nombre: "Juan",
      apellido: "Pérez",
      telefono: "2614009988",
      rol: "CLIENTE",
      direccionId: direccion.id,
    },
  });

  console.log("✓ Usuario cliente creado:", correoCliente);

  // Comanda de prueba lista para que el repartidor la tome
  const comandaExistente = await prisma.comanda.findFirst({
    where: { clienteId: cliente.id, estadoComanda: "LISTO" },
  });

  if (!comandaExistente) {
    await prisma.comanda.create({
      data: {
        clienteId: cliente.id,
        estadoComanda: "LISTO",
        direccionId: direccion.id,
      },
    });
    console.log("✓ Comanda de prueba creada (estado: LISTO)");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
