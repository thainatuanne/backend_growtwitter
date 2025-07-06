import prismaClient from "../database/prisma.client";
import { HTTPError } from "../utils/http.error";
import { CreateSeguidorDTO, UpdateSeguidorDTO } from "../dto/seguidor.dto";

export class SeguidorService {
    public async listarSeguidores(): Promise<any[]> {
        const seguidores = await prismaClient.seguidor.findMany({
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        username: true
                    }
                },
                seguidor: {
                    select: {
                        id: true,
                        nome: true,
                        username: true
                    }
                },
            },
            orderBy: {
                criadoEm: "desc"
            },
        });
        return seguidores;
    }

    public async buscarPorId(id: number): Promise<any> {
        if (!id || isNaN(id)) {
            throw new HTTPError(400, "ID inválido.");
        }
        const seguidor = await prismaClient.seguidor.findUnique({
            where: { id }
        });
        if (!seguidor) {
            throw new HTTPError(404, "Seguidor não encontrado.");
        }
        return seguidor;
    }

    public async cadastrar({ usuarioId, seguidorId }: CreateSeguidorDTO): Promise<any> {
        if (usuarioId === seguidorId) {
            throw new HTTPError(400, "O usuário não pode seguir a si mesmo.");
        }
        const relExistente = await prismaClient.seguidor.findFirst({
            where: {
                usuarioId,
                seguidorId
            },
        });
        if (relExistente) {
            throw new HTTPError(409, "Este usuário já está seguindo esse outro usuário.");
        }
        const novoSeguidor = await prismaClient.seguidor.create({
            data: {
                usuarioId,
                seguidorId
            },
        });
        return novoSeguidor;
    }

    public async atualizar({ id, usuarioId, seguidorId }: UpdateSeguidorDTO): Promise<any> {
        await this.buscarPorId(id);
        if (usuarioId !== undefined && seguidorId !== undefined && usuarioId === seguidorId) {
            throw new HTTPError(400, "O usuário não pode seguir a si mesmo.");
        }
        const atualizado = await prismaClient.seguidor.update({
            where: { id },
            data: {
                usuarioId,
                seguidorId
            },
        });
        return atualizado;
    }

    public async deletar(id: number): Promise<any> {
        await this.buscarPorId(id);
        const deletado = await prismaClient.seguidor.delete({
            where: {
                id
            }
        });
        return deletado;
    }
}