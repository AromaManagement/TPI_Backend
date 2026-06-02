import expres from "express";
import cors from "cors";

const app = expres();
app.use(expres.json());
app.use(cors());

export default app;
