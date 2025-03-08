import Cliente from "../entities/Cliente.js";
import ProgramaDeFidelidade from "../entities/ProgramaDeFidelidade.js";

/**
 * Constrói o link HATEOAS apenas para histórico do cliente.
 * @param {Object} cliente - Objeto do cliente.
 * @returns {Array} Lista de links HATEOAS.
 */
const gerarLinksCliente = (cliente) => {
    return [
        { rel: "historico", href: `/historico/${cliente._id}`, method: "GET" }
    ];
};

/**
 * Cria um novo cliente no sistema (SEM HATEOAS no POST).
 * @param {Object} dados - Dados do cliente (nome, email).
 * @returns {Object} Cliente criado.
 */
const criarCliente = async (dados) => {
    const { nome, email } = dados;

    // Verifica se o e-mail já está cadastrado
    const clienteExistente = await Cliente.findOne({ email });
    if (clienteExistente) {
        throw new Error("Este e-mail já está cadastrado. Tente fazer login ou use outro endereço de e-mail.");
    }

    // Busca ou cria o programa de fidelidade padrão (Bronze)
    let programaPadrao = await ProgramaDeFidelidade.findOne({ nivel: "Bronze" });

    if (!programaPadrao) {
        console.warn("Nenhum programa de fidelidade encontrado. Criando programa padrão...");
        programaPadrao = await ProgramaDeFidelidade.create({
            nome: "Programa Padrão",
            multiplicadorDePontos: 1,
            nivel: "Bronze"
        });
        console.log("Programa de fidelidade criado:", programaPadrao);
    }

    // Cria o novo cliente com a categoria Bronze
    const novoCliente = await Cliente.create({
        nome,
        email,
        categoria: "Bronze",
        programaId: programaPadrao._id,
        pontos: 0
    });

    return novoCliente;
};

/**
 * Lista todos os clientes do sistema com paginação e HATEOAS apenas para histórico.
 * @param {Number} page - Número da página.
 * @param {Number} limit - Quantidade de clientes por página.
 * @returns {Object} Clientes paginados com link apenas para histórico.
 */
const listarClientes = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const clientes = await Cliente.find()
        .populate("programaId")
        .skip(skip)
        .limit(limit)
        .select("nome email pontos categoria programaId");

    const totalClientes = await Cliente.countDocuments();

    return {
        total: totalClientes,
        page,
        limit,
        totalPages: Math.ceil(totalClientes / limit),
        data: clientes.map(cliente => ({
            id: cliente._id,
            nome: cliente.nome,
            email: cliente.email,
            pontos: cliente.pontos,
            categoria: cliente.categoria,
            programa: cliente.programaId ? {
                nome: cliente.programaId.nome,
                nivel: cliente.programaId.nivel,
                multiplicador: cliente.programaId.multiplicadorDePontos
            } : "Nenhum programa de fidelidade vinculado",
            links: gerarLinksCliente(cliente)
        }))
    };
};

/**
 * Retorna um cliente específico com todas as informações, sem HATEOAS adicional.
 * @param {String} id - ID do cliente.
 * @returns {Object} Cliente com todas as informações.
 */
const buscarClientePorId = async (id) => {
    const cliente = await Cliente.findById(id).populate("programaId");
    if (!cliente) throw new Error("Cliente não encontrado.");

    return {
        id: cliente._id,
        nome: cliente.nome,
        email: cliente.email,
        pontos: cliente.pontos,
        categoria: cliente.categoria,
        programa: cliente.programaId ? {
            nome: cliente.programaId.nome,
            nivel: cliente.programaId.nivel,
            multiplicador: cliente.programaId.multiplicadorDePontos
        } : "Nenhum programa de fidelidade vinculado"
    };
};

export { criarCliente, listarClientes, buscarClientePorId };
