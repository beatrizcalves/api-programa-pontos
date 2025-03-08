import Recompensa from "../entities/Recompensa.js";

/**
 * Cria uma nova recompensa.
 * @param {Object} dados - Dados da recompensa (nome, custoEmPontos).
 * @returns {Object} Recompensa criada.
 */
export const criarRecompensa = async (dados) => {
    return await Recompensa.create(dados);
};

/**
 * Lista todas as recompensas disponíveis.
 * @returns {Array} Lista de recompensas.
 */
export const listarRecompensas = async () => {
    return await Recompensa.find();
};
