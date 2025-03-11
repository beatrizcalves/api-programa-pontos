import Transacao from "../entities/Transacao.js";
import Cliente from "../entities/Cliente.js";
import HistoricoDePontos from "../entities/HistoricoDePontos.js";
import Recompensa from "../entities/Recompensa.js";
import { atualizarCategoriaCliente } from "./cliente.service.js";


const formatTransacaoResponse = (transacao) => {
    return {
        id: transacao._id,
        clienteId: transacao.clienteId,
        tipo: transacao.tipo,
        valor: transacao.valor,
        data: transacao.createdAt,
        _links: {
            self: { href: `/transacoes/${transacao._id}`, method: "GET" },
            transacao: { href: `/transacoes/resgate`, method: "POST" },
            transacao: { href: `/transacoes/ganho`, method: "POST" }
        }
    };
};

export const buscarTransacaoPorId = async (id) => {
    const transacao = await Transacao.findById(id);
    if (!transacao) throw new Error("Transação não encontrada.");

    return formatTransacaoResponse(transacao);
};

export const ganharPontos = async ({ clienteId, valor }) => {
    const cliente = await Cliente.findById(clienteId).populate("programaId");
    if (!cliente) throw new Error("Cliente não encontrado.");
    if (!cliente.programaId) throw new Error("O cliente não está vinculado a nenhum programa de fidelidade.");

    const multiplicador = cliente.programaId.multiplicadorDePontos || 1;
    const pontosCalculados = Math.floor(valor * multiplicador);

    const transacao = await Transacao.create({ clienteId, tipo: "ganho", valor: pontosCalculados });
    await HistoricoDePontos.create({
        clienteId,
        tipo: "ganho",
        valor: pontosCalculados,
        motivo: "Compra realizada"
    });

    cliente.pontos += pontosCalculados;
    cliente.categoria = atualizarCategoriaCliente(cliente);

    await cliente.save();

    return formatTransacaoResponse(transacao);
};

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

    const transacao = await Transacao.create({ clienteId, tipo: "resgate", valor: -recompensa.custoEmPontos });
    await HistoricoDePontos.create({
        clienteId,
        tipo: "resgate",
        valor: -recompensa.custoEmPontos,
        motivo: `Resgate de recompensa: ${recompensa.nome}`
    });

    cliente.categoria = atualizarCategoriaCliente(cliente);

    await cliente.save();

    return formatTransacaoResponse(transacao);
};
