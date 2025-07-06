import { Request, Response } from "express";
import { SeguidorService } from "../services/seguidor.service";
import { onError } from "../utils/on-error";
import { HTTPError } from "../utils/http.error";
import prismaClient from "../database/prisma.client";

interface AuthenticatedRequest extends Request {
    userId?: number;
}

export class SeguidorController {
    public async listar(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {

            // input
            const service = new SeguidorService();
            
            // processamento
            const seguidores = await service.listarSeguidores();
            
            // resposta
            res.status(200).json({
                sucesso: true,
                mensagem: "Lista de seguidores carregada com sucesso",
                dados: seguidores,
            });
        } catch (error) {
            onError(error, res);
        }
    }

    public async buscarPorId(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            // input
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                throw new HTTPError(400, "ID inválido.");
            }
            const seguidorId = Number(id);

            // processamento
            const service = new SeguidorService();
            const relacao = await service.buscarPorId(seguidorId);

            // resposta
            res.status(200).json({
                sucesso: true,
                mensagem: "Relação de seguidor encontrada com sucesso",
                dados: relacao,
            });
        } catch (error) {
            onError(error, res);
        }
    }

    public async cadastrar(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            // input
            const seguidorId = req.body.seguidorId;
            const usuarioId = req.userId;
            if (!usuarioId) {
                throw new HTTPError(401, "Usuário não autenticado.");
            }

            // processamento
            const service = new SeguidorService();
            const novaRelacao = await service.cadastrar({ usuarioId, seguidorId });
            const usuario = await prismaClient.usuario.findUnique({
                where: {
                    id: usuarioId
                }
            });
            const seguido = await prismaClient.usuario.findUnique({
                where: {
                    id: seguidorId
                }
            });

            // resposta
            res.status(201).json({
                sucesso: true,
                mensagem: `${usuario?.nome} passou a seguir ${seguido?.nome} com sucesso!`,
                dados: novaRelacao,
            });
        } catch (error) {
            onError(error, res);
        }
    }

    public async atualizar(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            // input
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                throw new HTTPError(400, "ID inválido.");
            }
            const relacaoId = Number(id);
            const { usuarioId, seguidorId } = req.body;

            // processamento
            const service = new SeguidorService();
            const atualizado = await service.atualizar({
                id: relacaoId,
                usuarioId,
                seguidorId
            });

            // resposta
            res.status(200).json({
                sucesso: true,
                mensagem: "Relação de seguidor atualizada com sucesso",
                dados: atualizado,
            });
        } catch (error) {
            onError(error, res);
        }
    }

    public async deletar(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            // input
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                throw new HTTPError(400, "ID inválido.");
            }

            const relacaoId = Number(id);

            // processamento
            const service = new SeguidorService();
            const deletado = await service.deletar(relacaoId);

            const usuario = await prismaClient.usuario.findUnique({
                where: {
                    id: deletado.usuarioId
                }
            });

            const seguido = await prismaClient.usuario.findUnique({
                where: {
                    id: deletado.seguidorId
                }
            });

            const nomeUsuario = usuario?.nome || "Usuário";
            const nomeSeguidor = seguido?.nome || "Seguidor";

            // resposta
            res.status(200).json({
                sucesso: true,
                mensagem: `${nomeUsuario} deixou de seguir ${nomeSeguidor} com sucesso.`,
                dados: deletado,
            });
        } catch (error) {
            onError(error, res);
        }
    }
}