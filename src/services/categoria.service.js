export const atualizarCategoriaCliente = async (clienteId) => {
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) throw new Error("Cliente não encontrado");

    let novaCategoria = "Bronze";
    if (cliente.pontos >= 2001 && cliente.pontos <= 5000) novaCategoria = "Prata";
    if (cliente.pontos > 5000) novaCategoria = "Ouro";

    cliente.categoria = novaCategoria;
    await cliente.save();
};
