import Cliente from "../entities/Cliente.js";
import HistoricoDePontos from "../entities/HistoricoDePontos.js";

export const expirarPontos = async () => {
    const dataLimite = new Date();
    dataLimite.setFullYear(dataLimite.getFullYear() - 1);

    const clientes = await Cliente.find({ "historico.data": { $lt: dataLimite } });

    for (let cliente of clientes) {
        if (cliente.pontos > 0) {
            await HistoricoDePontos.create({
                clienteId: cliente._id,
                tipo: "expiracao",
                valor: -cliente.pontos,
                motivo: "Pontos expirados após 12 meses"
            });

            cliente.pontos = 0;
            await cliente.save();
        }
    }
};
