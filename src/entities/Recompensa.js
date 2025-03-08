import mongoose from "mongoose";

const RecompensaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    custoEmPontos: { type: Number, required: true }
});

const Recompensa = mongoose.model("Recompensa", RecompensaSchema);
export default Recompensa;
