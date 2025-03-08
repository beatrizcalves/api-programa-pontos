import express from "express";
import { ganharPontos, resgatarPontos } from "../services/transacao.service.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: "Transações"
 *     description: "Ganho e resgate de pontos"
 */

/**
 * @swagger
 * /transacoes/ganho:
 *   post:
 *     summary: "Ganha pontos em compras"
 *     tags: ["Transações"]
 *     description: "Adiciona pontos ao cliente com base no valor gasto e no programa de fidelidade."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clienteId:
 *                 type: string
 *                 example: "65a7f8b6c2a1b3d4e5f6a7b8"
 *               valor:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: "Pontos adicionados com sucesso."
 *       400:
 *         description: "Erro ao processar a transação."
 */
router.post("/ganho", async (req, res) => {
    try {
        const cliente = await ganharPontos(req.body);
        res.status(201).json(cliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /transacoes/resgate:
 *   post:
 *     summary: "Resgata pontos por uma recompensa"
 *     tags: ["Transações"]
 *     description: "Permite que um cliente troque pontos por recompensas disponíveis."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clienteId:
 *                 type: string
 *                 example: "65a7f8b6c2a1b3d4e5f6a7b8"
 *               recompensaId:
 *                 type: string
 *                 example: "65a7f8b6c2a1b3d4e5f6a7b9"
 *     responses:
 *       201:
 *         description: "Recompensa resgatada com sucesso."
 *       400:
 *         description: "Erro ao processar o resgate."
 */
router.post("/resgate", async (req, res) => {
    try {
        const cliente = await resgatarPontos(req.body);
        res.status(201).json(cliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
