export const validarCliente = (req, res, next) => {
    const { nome, email } = req.body;

    if (!nome || typeof nome !== "string" || nome.trim().length < 3) {
        return res.status(400).json({ 
            error: "O nome deve ter pelo menos 3 caracteres e não pode estar vazio." 
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ 
            error: "O e-mail informado é inválido. Use um formato válido como exemplo@email.com." 
        });
    }

    next();
};
