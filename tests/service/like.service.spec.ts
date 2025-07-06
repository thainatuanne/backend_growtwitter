import { LikeService } from "../../src/services/like.service"
import { prismaMock } from "../config/prisma.mock";

describe('Testes para as funções de likes', () => {
    const sut = new LikeService();

    it('Deve retornar o like se cadastrado corretamente', async () => {
        const input = {
            usuarioId: 1,
            tweetId: 2
        }

        const mockLike = {
            usuarioId: 1,
            tweetId: 2,
            id: 1,
            criadoEm: new Date(),
            atualizadoEm: new Date()
        }

        prismaMock.like.create.mockResolvedValue(mockLike)

        const result = await sut.cadastrar(input);

        expect(result).toBeDefined();
        expect(result).toHaveProperty("id", 1)
        expect(result).toHaveProperty("usuarioId", 1)
        expect(result).toHaveProperty("tweetId", 2)
    })

    it('Deve retornar erro se o like já existir', async () => {
        const input = {
            usuarioId: 1,
            tweetId: 2
        }

        const mockLike = {
            usuarioId: 1,
            tweetId: 2,
            id: 1,
            criadoEm: new Date(),
            atualizadoEm: new Date()
        }

        prismaMock.like.findFirst.mockResolvedValue(mockLike)

        await expect(sut.cadastrar(input)).rejects.toThrow("Like já existente para este usuário e tweet.")
    })

    it("Deve retornar a lista de likes com dados do usuário e do tweet", async () => {
        const mockLikes = [
          {
            id: 1,
            usuarioId: 2,
            tweetId: 10,
            criadoEm: new Date(),
            atualizadoEm: new Date(),
            usuario: {
              id: 2,
              nome: "João",
              username: "joao",
            },
            tweet: {
              id: 10,
              conteudo: "Tweet de teste",
            },
          },
          {
            id: 2,
            usuarioId: 1,
            tweetId: 12,
            criadoEm: new Date(),
            atualizadoEm: new Date(),
            usuario: {
              id: 1,
              nome: "Bruno",
              username: "bruninho",
            },
            tweet: {
              id: 12,
              conteudo: "Outro tweet",
            },
          },
        ];
    
        prismaMock.like.findMany.mockResolvedValue(mockLikes);
    
        const result = await sut.listarLikes();
    
        expect(result).toHaveLength(2);
        result.forEach((like) => {
          expect(like).toHaveProperty("id");
          expect(like).toHaveProperty("usuario.nome");
          expect(like).toHaveProperty("tweet.conteudo");
        });
    });

    it("Deve retornar o like se o ID for válido e existir", async () => {
      const mockLike = {
        id: 1,
        usuarioId: 2,
        tweetId: 3,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };
  
      prismaMock.like.findUnique.mockResolvedValue(mockLike);
  
      const result = await sut.buscarPorId(1);
  
      expect(result).toBeDefined();
      expect(result).toHaveProperty("id", 1);
    });

    it("Deve lançar erro se o ID for zero", async () => {
      await expect(sut.buscarPorId(0)).rejects.toThrow("ID inválido.");
    });

    it("Deve lançar erro se o ID for negativo", async () => {
      await expect(sut.buscarPorId(-5)).rejects.toThrow("ID inválido.");
    });

    it("Deve lançar erro se o ID não for um número", async () => {
      await expect(sut.buscarPorId(NaN)).rejects.toThrow("ID inválido.");
    });

    it("Deve atualizar o like com os novos dados e retornar o resultado", async () => {
        const input = {
          id: 1,
          usuarioId: 2,
          tweetId: 3,
        };
    
        const mockLikeExistente = {
          id: 1,
          usuarioId: 1,
          tweetId: 1,
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        };
    
        const mockLikeAtualizado = {
          id: 1,
          usuarioId: 2,
          tweetId: 3,
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        };
    
        // Simula que o like existe
        prismaMock.like.findUnique.mockResolvedValue(mockLikeExistente);
    
        // Simula a atualização
        prismaMock.like.update.mockResolvedValue(mockLikeAtualizado);
    
        const result = await sut.atualizar(input);
    
        expect(result).toBeDefined();
        expect(result.id).toBe(1);
        expect(result.usuarioId).toBe(2);
        expect(result.tweetId).toBe(3);
    });
})