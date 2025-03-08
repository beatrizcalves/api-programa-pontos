import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/database.js";
import clienteRoutes from "./routes/cliente.routes.js";
import transacaoRoutes from "./routes/transacao.routes.js";
import recompensaRoutes from "./routes/recompensa.routes.js";
import historicoRoutes from "./routes/historico.routes.js";
import errorHandler from "./http/errorHandler.js";
import logger from "./http/logger.js";
import setupSwagger from "./config/swagger.js";

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());
app.use(logger);

// Conectar ao banco de dados
await connectDB();

// Rotas
app.use("/clientes", clienteRoutes);
app.use("/transacoes", transacaoRoutes);
app.use("/recompensas", recompensaRoutes);
app.use("/historico", historicoRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

// Configurar Swagger
setupSwagger(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
