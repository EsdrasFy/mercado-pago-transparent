import express from "express";
import cors from "cors";
import routes from "./routes";
const app = express();
const PORT = 8989;
require("dotenv").config();

  
  app.use(express.json());
  app.use(routes);
  
  
  try {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }