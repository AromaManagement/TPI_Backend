# TPI Backend - Guía de Desarrollo 🚀

Este es el backend para el proyecto **AromaManagement / TPI**, desarrollado utilizando **Node.js**, **Express**, **TypeScript** y **Prisma ORM** con una base de datos **PostgreSQL**.

---

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu equipo:

*   **Node.js** (versión 18 o superior recomendada)
*   **npm** (incluido por defecto con Node.js)
*   **PostgreSQL** (base de datos relacional activa)

---

## 🛠️ Pasos para levantar el proyecto en desarrollo

Sigue estos pasos detallados para configurar y ejecutar el servidor localmente:

### 1. Instalar Dependencias
Abre una terminal en la raíz del proyecto y ejecuta el siguiente comando para instalar todos los paquetes necesarios:

```bash
npm install
```

### 2. Configurar las Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto (puedes tomar como referencia el archivo `.env.template`):

```bash
cp .env.template .env
```

Abre el archivo `.env` recién creado y configura tus variables de entorno correspondientes:

*   `PORT`: Puerto en el que escuchará el servidor (por defecto `5000`).
*   `DATABASE_URL`: Cadena de conexión de PostgreSQL en formato `postgresql://usuario:contraseña@localhost:5432/nombre_base_de_datos`.
*   `JWT_SECRET`: Clave secreta para la firma y verificación de los tokens JWT.
*   `JWT_EXPIRES_IN`: Tiempo de expiración del token JWT (por ejemplo: `24h`).

### 3. Ejecutar las Migraciones de Prisma
Para sincronizar el esquema de la base de datos definido en [schema.prisma](prisma/schema.prisma) con tu base de datos PostgreSQL local y generar el cliente de Prisma, ejecuta:

```bash
# Genera el cliente de Prisma y aplica las migraciones a tu base de datos local
npm run migrate
```

*Nota: Esto creará las tablas necesarias en la base de datos configurada en tu `DATABASE_URL`.*

### 4. Iniciar el Servidor de Desarrollo
Una vez configurada la base de datos y las dependencias, inicia el servidor en modo de desarrollo con recarga automática:

```bash
npm run dev
```

El servidor compilará el código TypeScript en tiempo de ejecución usando `tsx` y se levantará en el puerto especificado en tu `.env` (o en el puerto `5000` por defecto). Verás un mensaje en consola indicando:

```text
Conexión con la base de datos establecida correctamente.
Server started
```

---

## 📜 Scripts Disponibles

En el archivo [package.json](package.json) se encuentran definidos los siguientes comandos útiles para el flujo de trabajo:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo usando `tsx watch` para reiniciar automáticamente ante cambios. |
| `npm run build` | Compila el código TypeScript a JavaScript de producción y lo guarda en la carpeta `dist`. |
| `npm run start` | Ejecuta el servidor utilizando el código ya compilado desde la carpeta `dist`. |
| `npm run migrate` | Ejecuta las migraciones pendientes en desarrollo mediante Prisma (`npx prisma migrate dev`). |
| `npm run seed` | Ejecuta el script de seeding para poblar la base de datos con datos de prueba (si existe). |
