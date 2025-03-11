import express from "express";
import { criarCliente, listarClientes, buscarClientePorId, editarCliente, deletarCliente  } from "../services/cliente.service.js";
import { validarCliente } from "../validations/cliente.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: "Clientes"
 *     description: "Gerenciamento de clientes"
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: "Lista todos os clientes"
 *     tags: ["Clientes"]
 *     description: "Obtém todos os clientes cadastrados com paginação."
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Número da página"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Quantidade de clientes por página"
 *     responses:
 *       200:
 *         description: "Lista de clientes retornada com sucesso."
 *       500:
 *         description: "Erro interno do servidor."
 */
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const clientes = await listarClientes(page, limit);
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar clientes." });
    }
});
/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: "Cria um novo cliente"
 *     tags: ["Clientes"]
 *     description: "Cadastra um novo cliente no sistema."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 example: "joao@email.com"
 *     responses:
 *       201:
 *         description: "Cliente criado com sucesso."
 *       400:
 *         description: "Erro na validação dos dados."
 */
router.post("/", validarCliente, async (req, res) => {
    try {
        const cliente = await criarCliente(req.body);
        res.status(201).json(cliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: "Obtém um cliente pelo ID"
 *     tags: ["Clientes"]
 *     description: "Retorna os detalhes de um cliente específico pelo ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID do cliente a ser buscado."
 *     responses:
 *       200:
 *         description: "Cliente encontrado com sucesso."
 *       404:
 *         description: "Cliente não encontrado."
 */
router.get("/:id", async (req, res) => {
    try {
        const cliente = await buscarClientePorId(req.params.id);
        if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar cliente." });
    }
});

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: "Edita um cliente pelo ID"
 *     tags: ["Clientes"]
 *     description: "Atualiza os dados de um cliente específico pelo ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID do cliente a ser atualizado."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Maria Oliveira"
 *               email:
 *                 type: string
 *                 example: "maria@email.com"
 *               pontos:
 *                 type: integer
 *                 example: 1000
 *               categoria:
 *                 type: string
 *                 example: "Prata"
 *     responses:
 *       200:
 *         description: "Cliente atualizado com sucesso."
 *       400:
 *         description: "Erro na validação dos dados."
 *       404:
 *         description: "Cliente não encontrado."
 */
router.put("/:id", validarCliente, async (req, res) => {
    try {
        const clienteAtualizado = await editarCliente(req.params.id, req.body);
        res.json(clienteAtualizado);
    } catch (error) {
        res.status(error.message.includes("não encontrado") ? 404 : 400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: "Remove um cliente pelo ID"
 *     tags: ["Clientes"]
 *     description: "Exclui um cliente específico pelo ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID do cliente a ser removido."
 *     responses:
 *       200:
 *         description: "Cliente removido com sucesso."
 *       404:
 *         description: "Cliente não encontrado."
 */
router.delete("/:id", async (req, res) => {
    try {
        await deletarCliente(req.params.id);
        res.json({ message: "Cliente removido com sucesso." });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
