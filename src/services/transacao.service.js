import Transacao from "../entities/Transacao.js";
import Cliente from "../entities/Cliente.js";
import HistoricoDePontos from "../entities/HistoricoDePontos.js";
import ProgramaDeFidelidade from "../entities/ProgramaDeFidelidade.js";
import Recompensa from "../entities/Recompensa.js";

/**
 * Ganha pontos com base no programa de fidelidade.
 * @param {Object} dados - { clienteId, valor }
 * @returns {Object} Cliente atualizado após o ganho de pontos.
 */
export const ganharPontos = async ({ clienteId, valor }) => {
    const cliente = await Cliente.findById(clienteId).populate("programaId");
    if (!cliente) throw new Error("Cliente não encontrado.");

    if (!cliente.programaId) {
        throw new Error("O cliente não está vinculado a nenhum programa de fidelidade.");
    }

    const multiplicador = cliente.programaId.multiplicadorDePontos || 1;
    const pontosCalculados = Math.floor(valor * multiplicador);

    await Transacao.create({ clienteId, tipo: "ganho", valor: pontosCalculados });
    await HistoricoDePontos.create({
        clienteId,
        tipo: "ganho",
        valor: pontosCalculados,
        motivo: "Compra realizada"
    });

    cliente.pontos += pontosCalculados;
    await cliente.save();

    return cliente;
};

/**
 * Resgata pontos ou uma recompensa específica.
 * @param {Object} dados - { clienteId, recompensaId }
 * @returns {Object} Cliente atualizado após o resgate.
 */
export const resgatarPontos = async ({ clienteId, recompensaId }) => {
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) throw new Error("Cliente não encontrado.");

    if (!recompensaId) throw new Error("Recompensa não especificada.");

    const recompensa = await Recompensa.findById(recompensaId);
    if (!recompensa) throw new Error("Recompensa não encontrada.");
    if (cliente.pontos < recompensa.custoEmPontos) {
        throw new Error(`Pontos insuficientes. Seu saldo é ${cliente.pontos}, mas a recompensa requer ${recompensa.custoEmPontos} pontos.`);
    }

    cliente.pontos -= recompensa.custoEmPontos;

    await Transacao.create({ clienteId, tipo: "resgate", valor: -recompensa.custoEmPontos });
    await HistoricoDePontos.create({
        clienteId,
        tipo: "resgate",
        valor: -recompensa.custoEmPontos,
        motivo: `Resgate de recompensa: ${recompensa.nome}`
    });

    await cliente.save();
    return cliente;
};
