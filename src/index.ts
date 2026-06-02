import "dotenv/config";
import { prisma } from "./config/prisma.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

const main = async () => {
  try {
    await prisma.$connect();
    console.log("Conexión con la base de datos establecida correctamente.");

    app.listen(PORT, () => {
      console.log(`Server started`);
    });
  } catch (error) {
    console.error(
      "Falló la conexión con la base de datos durante el inicio:",
      error,
    );
    process.exit(1);
  }
};

main();
