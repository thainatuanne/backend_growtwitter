import { CreateUsuarioDTO, LoginUsuarioDTO } from "../../src/dto/usuario.dto";
import { UsuarioService } from "../../src/services/usuario.service";
import { HTTPError } from "../../src/utils/http.error";
import { prismaMock } from '../config/prisma.mock';
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

jest.mock("bcrypt");
jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(() => "token.jwt"),
  }));

describe('Testes para as funções de cadastro de usuários', () => {
    const sut = new UsuarioService();
    

    it("Deve retornar o usuário cadastrado quando enviado corretamente", async () => {
        // Configurar os inputs
        const input: CreateUsuarioDTO = {
          nome: "João",
          email: "joao@gmail.com",
          senha: "12345",
          username: "joao",
        };
      
        const mockHash = "senhaCriptografada";
      
        const mockUsuarioCreate = {
          ...input,
          id: 1,
          senha: mockHash,
          criadoEm: new Date(),
          atuzalizadoEm: new Date(),
        };
      
        prismaMock.usuario.findFirst.mockResolvedValue(null);
        // jest.spyOn(Bcrypt.prototype, "gerarHash").mockResolvedValue(mockHash);
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
        prismaMock.usuario.create.mockResolvedValue(mockUsuarioCreate);
      
        const { senha: _, ...usuarioSemSenha } = mockUsuarioCreate;
      
        const result = await sut.cadastrar(input);
        
        // O que se espera que aconteça
        expect(result).toBeDefined();
        expect(result).toEqual(usuarioSemSenha);
        expect(result).toHaveProperty("id", 1);
    });
      

    it('Deve retornar um erro quando existir um usuário com o mesmo username ou e-mail.', async () => {

        // Configurar os inputs
        const input: CreateUsuarioDTO = {
            nome: 'João',
            email: 'joao@gmail.com',
            senha: '12345',
            username: 'joao'
        }

        const mockUsuario = {
            ...input,
            id: 0,
            atuzalizadoEm: new Date(),
            criadoEm: new Date(),
        }

        prismaMock.usuario.findFirst.mockResolvedValue(mockUsuario);

        // O que se espera que aconteça
       await expect(() => sut.cadastrar(input)).rejects.toThrow(new HTTPError(409, "Email ou username já está em uso."))

    });

})

describe('Teste para as funções de Login de usuários', () => {
    const sut = new UsuarioService();

    it("Deve retornar token se login for válido", async () => {
        // Configurar os inputs
        const input: LoginUsuarioDTO = {
            emailOuUsername: "joao@gmail.com",
            senha: "12345"
        }

        const mockUsuario = {
            id: 0,
            nome: 'João',
            email: 'joao@gmail.com',
            senha: "senha_hash",
            username: 'joao',
            atuzalizadoEm: new Date(),
            criadoEm: new Date(),
          };

        prismaMock.usuario.findFirst.mockResolvedValue(mockUsuario);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        // jest.spyOn(Bcrypt.prototype, "comparar").mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue("token.jwt");

        const result = await sut.login(input)

        // O que se espera que aconteça
        expect(result).toHaveProperty("token");
        expect(result.usuario).toHaveProperty("id", mockUsuario.id);
        expect(result.usuario).not.toHaveProperty("senha");

    })

    it("Deve retornar um erro caso o usuário ou senha estiverem incorretos", async ()=> {
        // Configurar os inputs
        const input: LoginUsuarioDTO = {
            emailOuUsername: "joao@gmail.com",
            senha: "12345"
        }

        prismaMock.usuario.findFirst.mockResolvedValue(null);

        // O que se espera que aconteça
       await expect(() => sut.login(input)).rejects.toThrow(new HTTPError(401, "Usuário não encontrado"))
    })
})

describe('Teste para as funções de Listar Usuários', () => {
    const sut = new UsuarioService();

    it("Deve retornar a lista de usuários", async () => {

        const usuariosMock = [
            {
              id: 1,
              nome: "Bruno",
              email: "bruno@email.com",
              senha: "hash_senha",
              username: "bruninho",
              criadoEm: new Date(),
              atuzalizadoEm: new Date(),
            },
            {
              id: 2,
              nome: "João",
              email: "joao@email.com",
              senha: "outra_hash",
              username: "joaozinho",
              criadoEm: new Date(),
              atuzalizadoEm: new Date(),
            },
          ];

        prismaMock.usuario.findMany.mockResolvedValue(usuariosMock)
        
        const result = await sut.listarUsuarios();

        expect(result).toHaveLength(2)
        result.forEach((usuario) => {
            expect(usuario).not.toHaveProperty("senha");
            expect(usuario).toHaveProperty("id");
            expect(usuario).toHaveProperty("nome");
        })
    })
})

describe('Teste para as funções de Listar Usuários por ID', () => {
    const sut = new UsuarioService();

    it('Deve retornar a lista de usuários listados por ID', async () => {
        const usuariosMock = {
            id: 1,
            nome: "Bruno",
            email: "bruno@email.com",
            senha: "hash_senha",
            username: "bruninho",
            criadoEm: new Date(),
            atuzalizadoEm: new Date(),
          }
  
      prismaMock.usuario.findUnique.mockResolvedValue(usuariosMock)
  
      const result = await sut.listarPorId(usuariosMock.id);

      expect(result).toBeDefined();
      expect(result).toHaveProperty("id");

    })

    it('Deve retornar um erro para ao trazer a lista de usuários listados por ID', async () => {
        const idInexistente = 999;
  
        prismaMock.usuario.findUnique.mockResolvedValue(null)

        await expect(() => sut.listarPorId(idInexistente)).rejects.toThrow(new HTTPError(404, "Usuário não encontrado"))

    })
})

describe('Teste para as funções de atualização de usuários', () => {
    const sut = new UsuarioService();

    it("Deve atualizar e retornar o usuário sem a senha", async () => {
        const input = {
          id: 1,
          nome: "Novo Nome",
          email: "novo@email.com",
          senha: "novaSenha123",
          username: "novo_user",
        };
    
        const mockHash = "senha_hash";
    
        const mockUsuarioExistente = {
          id: 1,
          nome: "Antigo",
          email: "antigo@email.com",
          senha: "senha_antiga",
          username: "antigo_user",
          criadoEm: new Date(),
          atuzalizadoEm: new Date(),
        };
    
        const mockAtualizado = {
          ...mockUsuarioExistente,
          ...input,
          senha: mockHash,
        };
    
        prismaMock.usuario.findUnique.mockResolvedValue(mockUsuarioExistente);
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
        prismaMock.usuario.update.mockResolvedValue(mockAtualizado);
    
        const result = await sut.atualizar(input);
    
        expect(result).toHaveProperty("id", 1);
        expect(result.nome).toBe("Novo Nome");
        expect(result).not.toHaveProperty("senha");
      });

      it("Deve lançar erro se nenhum campo for enviado", async () => {
        const input = { id: 1 };
    
        await expect(sut.atualizar(input as any)).rejects.toThrow("Nenhum campo enviado para atualização.");
      });
    
      it("Deve lançar erro se o usuário não for encontrado", async () => {
        const input = { id: 1, nome: "Teste" };
    
        prismaMock.usuario.findUnique.mockResolvedValue(null);
    
        await expect(sut.atualizar(input)).rejects.toThrow("Usuário não encontrado");
      });
})

describe('Teste para a função de deletar usuário', () => {
    const sut = new UsuarioService();

    it("Deve confirmar a exclusão do usuário", async () => {
        const id = 1;

        const usuarioMock = {
            id: 1,
            nome: "Bruno",
            email: "bruno@email.com",
            senha: "hash_senha",
            username: "bruninho",
            criadoEm: new Date(),
            atuzalizadoEm: new Date(),
          }

        prismaMock.usuario.findUnique.mockResolvedValue(usuarioMock);
        prismaMock.usuario.delete.mockResolvedValue(usuarioMock)

        const result = await sut.deletar(id)

        expect(result).toHaveProperty("id", id);
        expect(result).toHaveProperty("nome");
        expect(result).not.toHaveProperty("senha");
    })

    it("Deve lançar erro se o usuário não for encontrado", async () => {
        const input = 999;
    
        prismaMock.usuario.findUnique.mockResolvedValue(null);
    
        await expect(sut.deletar(input)).rejects.toThrow("Usuário não encontrado");
      });
})