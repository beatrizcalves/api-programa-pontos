import mongoose from "mongoose";

const ClienteSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pontos: { type: Number, default: 0 },
    categoria: { type: String, enum: ["Bronze", "Prata", "Ouro"], default: "Bronze" },
    programaId: { type: mongoose.Schema.Types.ObjectId, ref: "ProgramaDeFidelidade" }
}, { timestamps: true });

const Cliente = mongoose.model("Cliente", ClienteSchema);
export default Cliente;
