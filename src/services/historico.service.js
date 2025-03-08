import HistoricoDePontos from "../entities/HistoricoDePontos.js";

/**
 * Registra uma movimentação no histórico de pontos do cliente.
 * @param {String} clienteId - ID do cliente.
 * @param {String} tipo - Tipo da transação (ganho, resgate, expiração).
 * @param {Number} valor - Quantidade de pontos alterada.
 * @param {String} motivo - Motivo opcional da movimentação.
 */
export const registrarHistorico = async (clienteId, tipo, valor, motivo = "") => {
    return await HistoricoDePontos.create({ clienteId, tipo, valor, motivo });
};

/**
 * Lista o histórico de pontos de um cliente.
 * @param {String} clienteId - ID do cliente.
 * @returns {Array} Lista de movimentações.
 */
export const listarHistoricoPorCliente = async (clienteId) => {
    return await HistoricoDePontos.find({ clienteId }).sort({ data: -1 });
};
