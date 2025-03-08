import express from "express";
import { listarHistoricoPorCliente } from "../services/historico.service.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: "Histórico"
 *     description: "Consulta do histórico de transações dos clientes"
 */

/**
 * @swagger
 * /historico/{clienteId}:
 *   get:
 *     summary: "Retorna o histórico de pontos de um cliente"
 *     tags: ["Histórico"]
 *     description: "Obtém todas as movimentações de pontos de um cliente específico."
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID do cliente cujo histórico será buscado."
 *     responses:
 *       200:
 *         description: "Histórico encontrado com sucesso."
 *       404:
 *         description: "Cliente não encontrado ou sem histórico."
 */
router.get("/:clienteId", async (req, res) => {
    try {
        const historico = await listarHistoricoPorCliente(req.params.clienteId);
        res.json(historico);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
