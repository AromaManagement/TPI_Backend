import "dotenv/config";
import { prisma } from "./config/prisma.js";
import app from "./app.js";

const main = async () => {
  try {
    await prisma.$connect();
    console.log("¡DB connected!");

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("DB connection falied", error);
    process.exit(1);
  }
};

main();
