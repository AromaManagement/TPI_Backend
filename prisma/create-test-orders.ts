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
    orderBy: { id: "asc" },
  });

  if (platos.length === 0) {
    console.error("No hay platos en la DB. Corré el seed primero.");
    process.exit(1);
  }

  // Tres pedidos con combinaciones distintas de platos
  const combos = [
    { desc: "Pedido 1 — Entrada + Plato Principal", indices: [0, 3] },
    { desc: "Pedido 2 — Plato Principal + Bebida",  indices: [4, 6] },
    { desc: "Pedido 3 — Variado",                   indices: [1, 5, 7] },
  ];

  for (const combo of combos) {
    const items = combo.indices
      .map((i) => platos[i])
      .filter(Boolean);

    const comanda = await prisma.comanda.create({
      data: {
        clienteId: cliente.id,
        estadoComanda: "LISTO",
        direccionId: cliente.direccionId!,
        detalles: {
          create: items.map((p) => ({
            platoId: p.id,
            precioUnitario: p.precio,
          })),
        },
      },
      include: { detalles: { include: { plato: true } } },
    });

    const nombres = comanda.detalles.map((d) => d.plato?.nombre ?? `#${d.platoId}`);
    console.log(`✓ ${combo.desc} — Comanda #${comanda.id}: ${nombres.join(", ")}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
