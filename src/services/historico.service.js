import HistoricoDePontos from "../entities/HistoricoDePontos.js";


const formatHistoricoResponse = (historico) => {
    return {
        id: historico._id,
        clienteId: historico.clienteId,
        tipo: historico.tipo,
        valor: historico.valor,
        motivo: historico.motivo,
        data: historico.createdAt,
        _links: {
            self: { href: `/historico/${historico._id}`, method: "GET" },
            cliente: { href: `/clientes/${historico.clienteId}`, method: "GET" }
        }
    };
};


export const registrarHistorico = async (clienteId, tipo, valor, motivo = "") => {
    const historico = await HistoricoDePontos.create({ clienteId, tipo, valor, motivo });
    return formatHistoricoResponse(historico);
};


export const listarHistoricoPorCliente = async (clienteId) => {
    const historico = await HistoricoDePontos.find({ clienteId }).sort({ data: -1 });
    return historico.map(formatHistoricoResponse);
};
