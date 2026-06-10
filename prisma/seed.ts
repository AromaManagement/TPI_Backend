import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando la siembra (seeding) de la base de datos...");

  // 1. Limpiar datos viejos en orden inverso de dependencias
  await prisma.pago.deleteMany({});
  await prisma.detalleComanda.deleteMany({});
  await prisma.comanda.deleteMany({});
  await prisma.usuario.deleteMany({});
  await prisma.direccion.deleteMany({});
  await prisma.localidad.deleteMany({});
  await prisma.platoArticulo.deleteMany({});
  await prisma.stock.deleteMany({});
  await prisma.articulo.deleteMany({});
  await prisma.platos.deleteMany({});
  await prisma.secciones.deleteMany({});
  await prisma.carta.deleteMany({});

  console.log("✓ Base de datos limpia.");

  // 2. Localidades
  const capital = await prisma.localidad.create({
    data: { id: 1, nombre: "Mendoza Capital" },
  });
  const godoyCruz = await prisma.localidad.create({
    data: { id: 2, nombre: "Godoy Cruz" },
  });
  const guaymallen = await prisma.localidad.create({
    data: { id: 3, nombre: "Guaymallén" },
  });

  console.log("✓ Localidades creadas.");

  // 3. Dirección de prueba
  const direccionCliente = await prisma.direccion.create({
    data: {
      id: 1,
      calle: "Av. Emilio Civit",
      numeracion: "450",
      barrio: "Quinta Sección",
      referencia: "Frente a la plaza, portón negro",
      localidadId: capital.id,
    },
  });

  console.log("✓ Dirección de prueba creada.");

  // 4. Usuarios
  const contrasenaHash = await bcrypt.hash("12345678", 10);

  // Admin
  await prisma.usuario.create({
    data: {
      correo: "admin@aromas.com",
      contrasena: contrasenaHash,
      nombre: "Admin",
      apellido: "Aromas",
      rol: "ADMIN",
    },
  });

  // Repartidor
  const repartidor = await prisma.usuario.create({
    data: {
      correo: "repartidor@aromas.com",
      contrasena: contrasenaHash,
      nombre: "Carlos",
      apellido: "Gómez",
      rol: "REPARTIDOR",
    },
  });

  // Cliente
  const cliente = await prisma.usuario.create({
    data: {
      correo: "cliente@aromas.com",
      contrasena: contrasenaHash,
      nombre: "Juan",
      apellido: "Pérez",
      rol: "CLIENTE",
      direccionId: direccionCliente.id,
    },
  });

  console.log("✓ Usuarios creados (admin@aromas.com, repartidor@aromas.com, cliente@aromas.com).");

  // 5. Carta del Menú
  const carta = await prisma.carta.create({
    data: { id: 1 },
  });

  // Sección 1: Entradas
  const secEntradas = await prisma.secciones.create({
    data: {
      id: 1,
      cartaId: carta.id,
      nombre: "Entradas",
      detalle: "Para comenzar tu experiencia",
    },
  });

  const platoEmpanadas = await prisma.platos.create({
    data: {
      id: 1,
      seccionId: secEntradas.id,
      nombre: "Empanadas mendocinas (x3)",
      precio: 3500.00,
      detalle: "Carne cortada a cuchillo, jugosas y especiadas, cocinadas al horno de barro.",
    },
  });

  const platoTabla = await prisma.platos.create({
    data: {
      id: 2,
      seccionId: secEntradas.id,
      nombre: "Tabla de fiambres",
      precio: 8900.00,
      detalle: "Selección regional de embutidos artesanales, quesos curados, aceitunas y pan casero para compartir.",
    },
  });

  const platoHummus = await prisma.platos.create({
    data: {
      id: 3,
      seccionId: secEntradas.id,
      nombre: "Hummus artesanal",
      precio: 4200.00,
      detalle: "Hummus de garbanzo con pimentón ahumado, aceite de oliva virgen extra y pan árabe tostado.",
    },
  });

  // Sección 2: Plato Principal
  const secPrincipales = await prisma.secciones.create({
    data: {
      id: 2,
      cartaId: carta.id,
      nombre: "Plato Principal",
      detalle: "Nuestras especialidades de la casa",
    },
  });

  const platoBife = await prisma.platos.create({
    data: {
      id: 4,
      seccionId: secPrincipales.id,
      nombre: "Bife de chorizo con papas",
      precio: 14500.00,
      detalle: "350g de bife de chorizo de novillo a la parrilla, con guarnición de papas rústicas al horno.",
    },
  });

  const platoMilanesa = await prisma.platos.create({
    data: {
      id: 5,
      seccionId: secPrincipales.id,
      nombre: "Milanesa napolitana",
      precio: 11800.00,
      detalle: "Milanesa de ternera crujiente con salsa fileto fileteada, jamón cocido, abundante mozzarella derretida y ensalada mixta de guarnición.",
    },
  });

  const platoSorrentinos = await prisma.platos.create({
    data: {
      id: 6,
      seccionId: secPrincipales.id,
      nombre: "Sorrentinos de jamón y queso",
      precio: 10500.00,
      detalle: "Pasta casera rellena de jamón cocido y mozzarella, servida con salsa bolognesa o crema.",
    },
  });

  // Sección 3: Bebidas
  const secBebidas = await prisma.secciones.create({
    data: {
      id: 3,
      cartaId: carta.id,
      nombre: "Bebidas",
      detalle: "Refrescos y vinos seleccionados",
    },
  });

  const platoGaseosa = await prisma.platos.create({
    data: {
      id: 7,
      seccionId: secBebidas.id,
      nombre: "Gaseosa línea Coca-Cola 500ml",
      precio: 1800.00,
      detalle: "Fría, regular o sin azúcares.",
    },
  });

  const platoCerveza = await prisma.platos.create({
    data: {
      id: 8,
      seccionId: secBebidas.id,
      nombre: "Cerveza Patagonia IPA 24.7 (Lata)",
      precio: 2800.00,
      detalle: "Cerveza aromática de lúpulo con toques cítricos, refrescante.",
    },
  });

  const platoMalbec = await prisma.platos.create({
    data: {
      id: 9,
      seccionId: secBebidas.id,
      nombre: "Copa Malbec de la casa",
      precio: 3500.00,
      detalle: "Vino tinto Malbec de Mendoza de aroma intenso a frutos rojos.",
    },
  });

  console.log("✓ Menú (Carta, Secciones y Platos) creado exitosamente.");

  // 5.5. Artículos (Ingredientes/Stock)
  const articulosData = [
    { id: 1, nombre: "Empanada congelada", esIngrediente: true, unidadMedida: "UNIDAD" as const },
    { id: 2, nombre: "Tabla de fiambres", esIngrediente: true, unidadMedida: "PORCION" as const },
    { id: 3, nombre: "Hummus", esIngrediente: true, unidadMedida: "UNIDAD" as const },
    { id: 4, nombre: "Bife de chorizo", esIngrediente: true, unidadMedida: "UNIDAD" as const },
    { id: 5, nombre: "Papas", esIngrediente: true, unidadMedida: "UNIDAD" as const },
    { id: 6, nombre: "Milanesa de ternera", esIngrediente: true, unidadMedida: "UNIDAD" as const },
    { id: 7, nombre: "Sorrentinos", esIngrediente: true, unidadMedida: "PORCION" as const },
    { id: 8, nombre: "Coca-Cola 500ml", esIngrediente: false, unidadMedida: "UNIDAD" as const },
    { id: 9, nombre: "Cerveza Patagonia", esIngrediente: false, unidadMedida: "UNIDAD" as const },
    { id: 10, nombre: "Vino Malbec", esIngrediente: false, unidadMedida: "UNIDAD" as const },
  ];

  for (const art of articulosData) {
    await prisma.articulo.create({ data: art });
    await prisma.stock.create({
      data: {
        articuloId: art.id,
        cantidad: 100, // Dar 100 unidades de stock a todo
        minimo: 5,
      },
    });
  }

  // Relacionar platos con sus artículos (ingredientes) para habilitarlos
  const relacionesPlatoArticulo = [
    { platoId: 1, articuloId: 1, cantidad: 3 }, // Empanadas x3 -> 3 empanadas
    { platoId: 2, articuloId: 2, cantidad: 1 }, // Tabla -> 1 tabla
    { platoId: 3, articuloId: 3, cantidad: 1 }, // Hummus -> 1 hummus
    { platoId: 4, articuloId: 4, cantidad: 1 }, // Bife -> 1 bife
    { platoId: 4, articuloId: 5, cantidad: 1 }, // Bife -> 1 papa
    { platoId: 5, articuloId: 6, cantidad: 1 }, // Milanesa -> 1 milanesa
    { platoId: 6, articuloId: 7, cantidad: 1 }, // Sorrentinos -> 1 sorrentinos
    { platoId: 7, articuloId: 8, cantidad: 1 }, // Coca -> 1 coca
    { platoId: 8, articuloId: 9, cantidad: 1 }, // Cerveza -> 1 cerveza
    { platoId: 9, articuloId: 10, cantidad: 1 }, // Copa vino -> 1 copa vino
  ];

  for (const rel of relacionesPlatoArticulo) {
    await prisma.platoArticulo.create({ data: rel });
  }

  console.log("✓ Artículos y stock de platos creados exitosamente.");

  // 6. Comanda de prueba lista para entrega (Comentada para iniciar sin pedidos activos y permitir proceso completo)
  /*
  const comanda = await prisma.comanda.create({
    data: {
      id: 1,
      clienteId: cliente.id,
      estadoComanda: "LISTO",
      direccionId: direccionCliente.id,
      detalles: {
        create: [
          {
            platoId: platoBife.id,
            precioUnitario: platoBife.precio,
          },
          {
            platoId: platoGaseosa.id,
            precioUnitario: platoGaseosa.precio,
          },
        ],
      },
    },
  });

  console.log("✓ Comanda de prueba (ID: 1, estado: LISTO) creada.");
  */
  console.log("¡Siembra de datos finalizada con éxito!");
}

main()
  .catch((e) => {
    console.error("Error al ejecutar el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
