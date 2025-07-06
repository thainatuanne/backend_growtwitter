import { SeguidorService } from "../../src/services/seguidor.service"
import { HTTPError } from "../../src/utils/http.error";
import { prismaMock } from "../config/prisma.mock";

describe("Testes para as funções de seguidores", () => {
    const sut = new SeguidorService();

    it('Deve retornar o seguidor se cadastrado corretamente', async () => {
        const input = {
            usuarioId: 1,
            seguidorId: 2,
        }

        const mockSeguidor = {
            id: 1,
            usuarioId: 1,
            seguidorId: 2,
            criadoEm: new Date(),
            atualizadoEm: new Date(),
        }

        prismaMock.seguidor.create.mockResolvedValue(mockSeguidor)

        const result = await sut.cadastrar(input)

        expect(result).toBeDefined();
        expect(result).toHaveProperty("id", 1)
        expect(result).toHaveProperty("usuarioId", 1)
        expect(result).toHaveProperty("seguidorId", 2)

    })

    it('Deve retorar erro se o usuarioID for igual ao seguidorID', async () => {
        const input = {
            usuarioId: 1,
            seguidorId: 1,
        }

        const mockSeguidor = {
            id: 1,
            usuarioId: 1,
            seguidorId: 1,
            criadoEm: new Date(),
            atualizadoEm: new Date(),
        }

        prismaMock.seguidor.findUnique.mockResolvedValue(mockSeguidor)

        await expect(() => sut.cadastrar(input)).rejects.toThrow(new HTTPError(400, "O usuário não pode seguir a si mesmo."))
    })

    it('Deve retorar erro se o usuário tentar seguir o mesmo usuário novamente', async () => {
        const input = {
            usuarioId: 1,
            seguidorId: 2,
        }

        const mockSeguidor = {
            id: 1,
            usuarioId: 1,
            seguidorId: 2,
            criadoEm: new Date(),
            atualizadoEm: new Date(),
        }

        prismaMock.seguidor.findFirst.mockResolvedValue(mockSeguidor)

        await expect(sut.cadastrar(input)).rejects.toThrow("Este usuário já está seguindo esse outro usuário.")
    })

    it("Deve retornar a lista de seguidores com os dados de usuário e seguidor", async () => {
        const mockSeguidores = [
          {
            id: 1,
            usuarioId: 10,
            seguidorId: 20,
            criadoEm: new Date(),
            atualizadoEm: new Date(),
            usuario: {
              id: 10,
              nome: "Bruno",
              username: "bruninho",
            },
            seguidor: {
              id: 20,
              nome: "João",
              username: "joao",
            },
          },
          {
            id: 2,
            usuarioId: 11,
            seguidorId: 21,
            criadoEm: new Date(),
            atualizadoEm: new Date(),
            usuario: {
              id: 11,
              nome: "Lucas",
              username: "lucas",
            },
            seguidor: {
              id: 21,
              nome: "Pedro",
              username: "pedro",
            },
          },
        ];
    
        prismaMock.seguidor.findMany.mockResolvedValue(mockSeguidores);
    
        const result = await sut.listarSeguidores();
    
        expect(result).toHaveLength(2);
    
        result.forEach((s) => {
          expect(s).toHaveProperty("id");
          expect(s.usuario).toHaveProperty("nome");
          expect(s.seguidor).toHaveProperty("username");
        });
    });

    it("Deve atualizar o seguidor e retornar os dados atualizados", async () => {
        const input = {
          id: 1,
          usuarioId: 10,
          seguidorId: 20,
        };
    
        const mockSeguidorExistente = {
          id: 1,
          usuarioId: 1,
          seguidorId: 2,
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        };
    
        const mockSeguidorAtualizado = {
          id: 1,
          usuarioId: 10,
          seguidorId: 20,
          criadoEm: new Date(),
          atualizadoEm: new Date(),
        };
    
        // Simula que o seguidor já existe (buscarPorId)
        prismaMock.seguidor.findUnique.mockResolvedValue(mockSeguidorExistente);
    
        // Simula a atualização
        prismaMock.seguidor.update.mockResolvedValue(mockSeguidorAtualizado);
    
        const result = await sut.atualizar(input);
    
        expect(result).toBeDefined();
        expect(result.id).toBe(1);
        expect(result.usuarioId).toBe(10);
        expect(result.seguidorId).toBe(20);
    });

})