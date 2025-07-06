import { Response } from "express";
import { HTTPError } from "./http.error";

export function onError(error: unknown, res: Response){
    if(error instanceof HTTPError){
        res.status(error.statusCode).json({
            sucesso: false,
                mensagem: error.message,
            });
            return;
    }
    
    res.status(500).json({
        sucesso: false,
        messagem: "Ocorreu um erro inesperado",
        detalhe: (error as Error).message,
    })
}