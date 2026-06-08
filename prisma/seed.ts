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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
