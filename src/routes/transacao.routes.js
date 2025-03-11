import express from "express";
import { ganharPontos, resgatarPontos, buscarTransacaoPorId } from "../services/transacao.service.js";
import { validarTransacao } from "../validations/transacao.validation.js";

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
router.post("/ganho", validarTransacao,  async (req, res) => {
    try {
        const transacao = await ganharPontos(req.body);
        res.status(201).json(transacao);
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
router.post("/resgate",validarTransacao, async (req, res) => {
    try {
        const transacao = await resgatarPontos(req.body);
        res.status(201).json(transacao);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /transacoes/{id}:
 *   get:
 *     summary: "Obtém uma transação pelo ID"
 *     tags: ["Transações"]
 *     description: "Retorna os detalhes de uma transação específica."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID da transação a ser buscada."
 *     responses:
 *       200:
 *         description: "Transação encontrada com sucesso."
 *       404:
 *         description: "Transação não encontrada."
 */
router.get("/:id", async (req, res) => {
    try {
        const transacao = await buscarTransacaoPorId(req.params.id);
        res.json(transacao);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;