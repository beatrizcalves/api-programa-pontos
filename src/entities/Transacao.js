import mongoose from "mongoose";

const TransacaoSchema = new mongoose.Schema({
    clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
    tipo: { type: String, enum: ["ganho", "resgate"], required: true },
    valor: { type: Number, required: true },
}, { timestamps: true });

const Transacao = mongoose.model("Transacao", TransacaoSchema);
export default Transacao;
