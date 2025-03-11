import Recompensa from "../entities/Recompensa.js";

export const formatRecompensaResponse = (recompensa) => {
    return {
        id: recompensa._id,
        descricao: recompensa.descricao,
        pontos: recompensa.pontos,
        quantidade: recompensa.quantidade,
        _links: {
            self: { href: `/recompensas/${recompensa.id}`, method: "GET" },
            cadastrar: { href: `/recompensas`, method: "POST" },
            editar: { href: `/recompensas/${recompensa.id}`, method: "PUT" },
            deletar: { href: `/recompensas/${recompensa.id}`, method: "DELETE" }
        }
    };
};


export const criarRecompensa = async (dados) => {
    const recompensa = await Recompensa.create(dados);
    return formatRecompensaResponse(recompensa);
};

export const listarRecompensas = async () => {
    const recompensas = await Recompensa.find();
    return recompensas.map(formatRecompensaResponse);
};


export const buscarRecompensaPorId = async (id) => {
    const recompensa = await Recompensa.findById(id);
    if (!recompensa) throw new Error("Recompensa não encontrada.");
    return formatRecompensaResponse(recompensa);
};


export const editarRecompensa = async (id, dados) => {
    const recompensa = await Recompensa.findById(id);
    if (!recompensa) throw new Error("Recompensa não encontrada.");

    recompensa.descricao = dados.descricao ?? recompensa.descricao;
    recompensa.pontos = dados.pontos ?? recompensa.pontos;
    recompensa.quantidade = dados.quantidade ?? recompensa.quantidade;

    await recompensa.save();
    return formatRecompensaResponse(recompensa);
};


export const deletarRecompensa = async (id) => {
    const recompensa = await Recompensa.findById(id);
    if (!recompensa) throw new Error("Recompensa não encontrada.");

    await Recompensa.deleteOne({ _id: id });
    return { message: "Recompensa removida com sucesso." };
};
