import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

dotenv.config();

// Obtém a URL correta para o ambiente (local ou produção)
const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Programa de Pontos",
            version: "1.0.0",
            description: "Documentação da API de Programa de Pontos",
        },
        servers: [
            {
                url: SERVER_URL,
                description: "Servidor Atual",
            },
        ],
        tags: [
            { name: "Clientes", description: "Gerenciamento de clientes" },
            { name: "Histórico", description: "Consulta de histórico de transações" },
            { name: "Recompensas", description: "Gerenciamento de recompensas" },
            { name: "Transações", description: "Ganho e resgate de pontos" }
        ]
    },
    apis: ["./src/routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;
