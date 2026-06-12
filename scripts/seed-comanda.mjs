#!/usr/bin/env node
// Script para simular un pedido nuevo de un cliente (estado SIN_ASIGNAR)
// Uso: node scripts/seed-comanda.mjs [API_URL] [PLATO_ID]
// Ejemplo: node scripts/seed-comanda.mjs http://192.168.1.43:5000/api 1

const API_URL = process.argv[2] ?? "http://192.168.1.43:5000/api";
const PLATO_ID = Number(process.argv[3] ?? 1);

const ADMIN_CORREO = "admin@aromas.com";
const ADMIN_PASSWORD = "12345678";

const CLIENTE_CORREO = "cliente.test@aromas.com";
const CLIENTE_PASSWORD = "12345678";

async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`[${res.status}] ${path} → ${JSON.stringify(body)}`);
  }
  return body;
}

async function login(correo, contrasena) {
  const res = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, contrasena }),
  });
  return res.data?.token ?? res.token;
}

async function main() {
  console.log(`Backend: ${API_URL}`);
  console.log(`Plato ID: ${PLATO_ID}\n`);

  // 1. Login como admin
  console.log("1. Login como admin...");
  const adminToken = await login(ADMIN_CORREO, ADMIN_PASSWORD);
  const authAdmin = { Authorization: `Bearer ${adminToken}` };
  console.log("   OK\n");

  // 2. Obtener primera localidad disponible
  console.log("2. Obteniendo localidad...");
  const localidades = await api("/localidades", { headers: authAdmin });
  const localidadId = (localidades.data ?? localidades)[0]?.id;
  if (!localidadId) throw new Error("No hay localidades en la base de datos. Creá una primero.");
  console.log(`   localidadId: ${localidadId}\n`);

  // 3. Crear dirección para el cliente de prueba
  console.log("3. Creando dirección...");
  const direccion = await api("/direcciones", {
    method: "POST",
    headers: authAdmin,
    body: JSON.stringify({
      calle: "Av. Siempre Viva",
      numeracion: "742",
      barrio: "Springfield",
      referencia: "Casa amarilla",
      localidadId,
    }),
  });
  const direccionId = direccion.data?.id ?? direccion.id;
  console.log(`   ID: ${direccionId}\n`);

  // 4. Crear (o reutilizar) usuario CLIENTE
  console.log("4. Creando usuario cliente...");
  let clienteId;
  try {
    const nuevoCliente = await api("/usuarios", {
      method: "POST",
      headers: authAdmin,
      body: JSON.stringify({
        correo: CLIENTE_CORREO,
        contrasena: CLIENTE_PASSWORD,
        nombre: "Juan",
        apellido: "Pérez",
        rol: "CLIENTE",
        direccionId,
      }),
    });
    clienteId = nuevoCliente.data?.id ?? nuevoCliente.id;
    console.log(`   Creado con ID: ${clienteId}\n`);
  } catch (err) {
    // Ya existe — buscar en la lista
    console.log(`   Ya existe, buscando...`);
    const lista = await api("/usuarios", { headers: authAdmin });
    const usuarios = lista.data ?? lista;
    const existente = usuarios.find((u) => u.correo === CLIENTE_CORREO);
    if (!existente) throw new Error("No se pudo crear ni encontrar el cliente.");
    clienteId = existente.id;
    console.log(`   Encontrado con ID: ${clienteId}\n`);
  }

  // 5. Login como cliente
  console.log("5. Login como cliente...");
  const clienteToken = await login(CLIENTE_CORREO, CLIENTE_PASSWORD);
  const authCliente = { Authorization: `Bearer ${clienteToken}` };
  console.log("   OK\n");

  // 6. Crear comanda (queda en SIN_ASIGNAR por defecto)
  console.log("6. Creando comanda...");
  const comanda = await api("/comandas", {
    method: "POST",
    headers: authCliente,
    body: JSON.stringify({
      clienteId,
      direccionId,
      detalles: [
        { platoId: PLATO_ID, cantidad: 2 },
        { platoId: PLATO_ID, cantidad: 1 },
      ],
    }),
  });

  const c = comanda.data ?? comanda;
  console.log("\n=== Comanda creada ===");
  console.log(`ID:     ${c.id}`);
  console.log(`Estado: ${c.estadoComanda}`);
  console.log(`Cliente:${c.cliente?.nombre} ${c.cliente?.apellido}`);
  console.log(`Detalles: ${c.detalles?.length ?? "?"} items`);
  console.log("======================\n");
}

main().catch((err) => {
  console.error("\nError:", err.message);
  process.exit(1);
});
