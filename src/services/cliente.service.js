import Cliente from "../entities/Cliente.js";
import ProgramaDeFidelidade from "../entities/ProgramaDeFidelidade.js";


export const formatClienteResponse = (cliente) => {
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
        } : "Nenhum programa de fidelidade vinculado",
        _links: {
            self: { href: `/clientes/${cliente.id}`, method: "GET" },
            historico: { href: `/historico/${cliente.id}`, method: "GET" },
            editar: { href: `/clientes/${cliente.id}`, method: "PUT" },
            deletar: { href: `/clientes/${cliente.id}`, method: "DELETE" }
        }
    };
};


const criarCliente = async (dados) => {
    const { nome, email } = dados;

   
    const clienteExistente = await Cliente.findOne({ email });
    if (clienteExistente) {
        throw new Error("Este e-mail já está cadastrado. Tente fazer login ou use outro endereço de e-mail.");
    }

    
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

    
    const novoCliente = await Cliente.create({
        nome,
        email,
        categoria: "Bronze",
        programaId: programaPadrao._id,
        pontos: 0
    });

    return novoCliente;
};


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
        data: clientes.map(cliente => (formatClienteResponse(cliente)))
    };
};

const buscarClientePorId = async (id) => {
    const cliente = await Cliente.findById(id).populate("programaId");
    if (!cliente) throw new Error("Cliente não encontrado.");

    return formatClienteResponse(cliente);
};

const editarCliente = async (id, dados) => {
    const { nome, email, pontos, categoria } = dados;

    const cliente = await Cliente.findById(id);
    if (!cliente) throw new Error("Cliente não encontrado.");

    if (email && email !== cliente.email) {
        const emailExistente = await Cliente.findOne({ email });
        if (emailExistente) {
            throw new Error("Este e-mail já está cadastrado. Use outro endereço de e-mail.");
        }
    }

    cliente.nome = nome ?? cliente.nome;
    cliente.email = email ?? cliente.email;
    cliente.pontos = pontos ?? cliente.pontos;
    cliente.categoria = categoria ?? cliente.categoria;

    cliente.categoria = atualizarCategoriaCliente(cliente);

    await cliente.save();

    return formatClienteResponse(cliente);
};

const deletarCliente = async (id) => {
    const cliente = await Cliente.findById(id);
    if (!cliente) throw new Error("Cliente não encontrado.");

    await Cliente.deleteOne({ _id: id });

    return { message: "Cliente deletado com sucesso." };
};

const atualizarCategoriaCliente = async (cliente) => {
    let novaCategoria = "Bronze";
    if (cliente.pontos >= 2001 && cliente.pontos <= 5000) novaCategoria = "Prata";
    if (cliente.pontos > 5000) novaCategoria = "Ouro";

    return novaCategoria;
};

export { criarCliente, listarClientes, buscarClientePorId, editarCliente, deletarCliente, atualizarCategoriaCliente };
