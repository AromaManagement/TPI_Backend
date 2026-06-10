import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cliente = await prisma.usuario.findUnique({
    where: { correo: "cliente@aromas.com" },
  });

  if (!cliente || !cliente.direccionId) {
    console.error("Cliente o dirección no encontrados. Corré el seed primero.");
    process.exit(1);
  }

  const platos = await prisma.platos.findMany({
    where: { deletedAt: null },
    take: 3,
  });

  const pedidos = [
    { descripcion: "Pedido 1 — Milanesa con papas" },
    { descripcion: "Pedido 2 — Pizza Napolitana" },
    { descripcion: "Pedido 3 — Empanadas x6" },
  ];

  for (const p of pedidos) {
    const detalles =
      platos.length > 0
        ? {
            create: platos.slice(0, 1).map((plato) => ({
              platoId: plato.id,
              precioUnitario: plato.precio,
            })),
          }
        : undefined;

    const comanda = await prisma.comanda.create({
      data: {
        clienteId: cliente.id,
        estadoComanda: "LISTO",
        direccionId: cliente.direccionId!,
        ...(detalles && { detalles }),
      },
    });

    console.log(`✓ ${p.descripcion} — Comanda #${comanda.id} creada`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
