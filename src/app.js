import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/database.js";
import clienteRoutes from "./routes/cliente.routes.js";
import transacaoRoutes from "./routes/transacao.routes.js";
import recompensaRoutes from "./routes/recompensa.routes.js";
import historicoRoutes from "./routes/historico.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./middlewares/logger.js";
import setupSwagger from "./config/swagger.js";

const app = express();

// Configurar CORS corretamente (permitir apenas origens específicas em produção)
const corsOptions = {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(logger);

(async () => {
    try {
        // Conectar ao banco de dados
        await connectDB();
        console.log("Conectado ao banco de dados com sucesso!");
        
        // Rotas
        app.use("/clientes", clienteRoutes);
        app.use("/transacoes", transacaoRoutes);
        app.use("/recompensas", recompensaRoutes);
        app.use("/historico", historicoRoutes);

        // Swagger
        setupSwagger(app);

        // Middleware global de tratamento de erros
        app.use(errorHandler);

        // Inicializar Servidor
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

    } catch (error) {
        console.error("Erro ao inicializar a aplicação:", error);
        process.exit(1); 
    }
})();
