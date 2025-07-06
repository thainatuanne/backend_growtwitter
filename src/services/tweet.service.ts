import { Tweet } from '@prisma/client';
import prismaClient from "../database/prisma.client";
import { AtualizarTweetDTO, cadastrarTweetDTO, CriarRetweetDTO, Feed } from '../dto/tweet.dto'
import { HTTPError } from '../utils/http.error';

export class TweetService {

  public async cadastrar({conteudo, tipo, usuarioId}: cadastrarTweetDTO): Promise<Tweet>{
      
    const novoTweet = await prismaClient.tweet.create({
        data: {
            conteudo,
            tipo,
            usuarioId,
        },
    })

    return novoTweet;

  }
  
  public async listarTweets(): Promise<Tweet[]> {
    const listarTweets = await prismaClient.tweet.findMany({
      where:{ tipo: "tweet"},
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            username: true,
          },
        },
        _count:{
          select:{
            replies: true
          }
        },
        replies: {
          include:{
            usuario:{
              select:{
                id: true,
                username: true,
                nome: true,
              }
            }
          }
        },
        likes: true,
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    return listarTweets;
  }

  public async listarPorId(usuarioId: number): Promise<Tweet[]> {

    if(!usuarioId || isNaN(usuarioId) || usuarioId <= 0){
      throw new HTTPError(404, "ID de usuário não encontrado.")
    }

    const listarPorId = await prismaClient.tweet.findMany({
      where: { usuarioId: Number(usuarioId)},
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            username: true,
          },
        },
        _count:{
          select:{
            replies: true
          }
        },
        replies: {
          include:{
            usuario:{
              select:{
                id: true,
                username: true,
                nome: true,
              }
            }
          }
        },
        likes: true,
      },
      
    });

    if (!listarPorId || listarPorId.length === 0) {
      throw new HTTPError(404, `Nenhum tweet encontrado para o usuário com ID ${usuarioId}.`);
    }
    
    return listarPorId;
  }
  

  public async criarRetweet({tweetId, conteudo, usuarioId}: CriarRetweetDTO): Promise<Tweet>{
      const tweet = await prismaClient.tweet.findUnique({
        where:{ id: tweetId }
      });

      if(!tweet){
        throw new HTTPError(404, `Nenhum tweet encontrado para o usuário com esse ID ${tweetId}.`);
      }

      const reply = await prismaClient.tweet.create({
        data:{
          conteudo,
          tipo: "reply",
          usuarioId,
          replyToId: tweetId
        }
      })
      return reply
  }

  public async feed({usuarioId}:Feed): Promise<Tweet[]>{
    const follow = await prismaClient.seguidor.findMany({
      where:{
        seguidorId: usuarioId
      },
      select:{
        usuarioId: true,
      }
    });
    const idsSeguidos = follow.map((s) => s.usuarioId);
    const usersFeed = [...idsSeguidos, usuarioId]

    const feed = await prismaClient.tweet.findMany({
      where:{
        usuarioId: {
          in: usersFeed
        },
        tipo: "tweet",
      },
      include:{
        usuario:{
          select:{
            id: true,
            nome: true,
            username: true,
          }
        },
        _count:{
          select:{
            likes: true,
            replies: true,
          }
        },
        replies:{
          include:{
            usuario:{
              select:{
                id: true,
                nome: true,
                username: true,
              }
            }
          }
        },
      },
      orderBy:{
        criadoEm: 'desc'
      }
    });
    return feed;
  }

  public async atualizar({ id, conteudo, tipo}: AtualizarTweetDTO): Promise<Tweet>{

    const updateTweet = await prismaClient.tweet.update({
      where: { id },
      data: {
        conteudo,
        tipo,
      }
    });

    return updateTweet;
  }

  public async deletar(id: number): Promise<Tweet>{
    
    await this.listarTweets()
    
    const deletarTweet = await prismaClient.tweet.delete({
      where: { id },
    });

    return deletarTweet;
  }

}
