import mongoose from "mongoose";

const ProgramaDeFidelidadeSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    multiplicadorDePontos: { type: Number, required: true },
    nivel: { type: String, enum: ["Bronze", "Prata", "Ouro"], required: true }
});

const ProgramaDeFidelidade = mongoose.model("ProgramaDeFidelidade", ProgramaDeFidelidadeSchema);
export default ProgramaDeFidelidade;
