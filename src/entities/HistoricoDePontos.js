import mongoose from "mongoose";

const HistoricoDePontosSchema = new mongoose.Schema({
    clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
    tipo: { type: String, enum: ["ganho", "resgate", "expiracao"], required: true },
    valor: { type: Number, required: true },
    motivo: { type: String, required: false },
    data: { type: Date, default: Date.now }
});

const HistoricoDePontos = mongoose.model("HistoricoDePontos", HistoricoDePontosSchema);
export default HistoricoDePontos;
