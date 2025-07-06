import { Like } from "@prisma/client";
import prismaClient from "../database/prisma.client";
import { CreateLikeDTO, UpdateLikeDTO } from "../dto/like.dto";
import { HTTPError } from "../utils/http.error";

export class LikeService {
    public async listarLikes(): Promise<Like[]> {
        const likes = await prismaClient.like.findMany({
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        username: true,
                    },
                },
                tweet: {
                    select: {
                        id: true,
                        conteudo: true,
                    },
                },
            },
            orderBy: {
                criadoEm: "desc",
            },
        });
        return likes;
    }

    public async buscarPorId(id: number): Promise<Like> {
        if (!id || isNaN(id) || id <= 0) {
            throw new HTTPError(400, "ID inválido.");
        }

        const like = await prismaClient.like.findUnique({ where: { id } });
        if (!like) {
            throw new HTTPError(404, "Like não encontrado.");
        }

        return like;
    }

    public async cadastrar({ usuarioId, tweetId }: CreateLikeDTO): Promise<Like> {
        const likeExistente = await prismaClient.like.findFirst({
            where: {
                usuarioId,
                tweetId
            },
        });
        if (likeExistente) {
            throw new HTTPError(409, "Like já existente para este usuário e tweet.");
        }

        const novoLike = await prismaClient.like.create({
            data: {
                usuarioId,
                tweetId
            },
        });

        return novoLike;
    }

    public async atualizar({ id, usuarioId, tweetId }: UpdateLikeDTO): Promise<Like> {
        await this.buscarPorId(id);
        const likeAtualizado = await prismaClient.like.update({
            where: { id },
            data: {
                usuarioId,
                tweetId
            },
        });

        return likeAtualizado;
    }

    public async deletar(id: number): Promise<Like> {
        await this.buscarPorId(id);
        const likeDeletado = await prismaClient.like.delete({
            where: { id },
        });

        return likeDeletado;
    }
}