export const validarTransacao = (req, res, next) => {
    const { clienteId, tipo, valor } = req.body;

    if (!clienteId || typeof clienteId !== "string") {
        return res.status(400).json({ 
            error: "O ID do cliente é obrigatório e deve ser uma string válida." 
        });
    }

    if (!["ganho", "resgate"].includes(tipo)) {
        return res.status(400).json({ 
            error: "O tipo de transação deve ser 'ganho' ou 'resgate'." 
        });
    }

    if (!valor || typeof valor !== "number" || valor <= 0) {
        return res.status(400).json({ 
            error: "O valor deve ser um número positivo maior que zero." 
        });
    }

    next();
};
