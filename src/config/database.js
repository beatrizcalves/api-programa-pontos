import mongoose from "mongoose";
import ProgramaDeFidelidade from "../entities/ProgramaDeFidelidade.js";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB conectado!");

        const programaPadrao = await ProgramaDeFidelidade.findOne({ nivel: "Bronze" });
        if (!programaPadrao) {
            await ProgramaDeFidelidade.create({
                nome: "Programa Padrão",
                multiplicadorDePontos: 1.0,
                nivel: "Bronze"
            });
            console.log("Programa de fidelidade padrão criado.");
        }
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;
