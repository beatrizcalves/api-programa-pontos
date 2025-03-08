import express from "express";
import { criarRecompensa, listarRecompensas } from "../services/recompensa.service.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: "Recompensas"
 *     description: "Gerenciamento de recompensas"
 */

/**
 * @swagger
 * /recompensas:
 *   get:
 *     summary: "Retorna a lista de recompensas disponíveis"
 *     tags: ["Recompensas"]
 *     description: "Obtém todas as recompensas cadastradas no sistema."
 *     responses:
 *       200:
 *         description: "Lista de recompensas retornada com sucesso."
 *       500:
 *         description: "Erro interno do servidor."
 */
router.get("/", async (req, res) => {
    try {
        const recompensas = await listarRecompensas();
        res.json(recompensas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /recompensas:
 *   post:
 *     summary: "Cria uma nova recompensa"
 *     tags: ["Recompensas"]
 *     description: "Cadastra uma nova recompensa no sistema."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Desconto de R$50"
 *               custoEmPontos:
 *                 type: number
 *                 example: 2000
 *     responses:
 *       201:
 *         description: "Recompensa criada com sucesso."
 *       400:
 *         description: "Erro na validação dos dados."
 */
router.post("/", async (req, res) => {
    try {
        const recompensa = await criarRecompensa(req.body);
        res.status(201).json(recompensa);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
