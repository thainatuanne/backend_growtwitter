
import { Usuario } from "@prisma/client";
import prismaClient from "../database/prisma.client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HTTPError } from "../utils/http.error";
import { CreateUsuarioDTO, UpdateUsuarioDTO, LoginUsuarioDTO } from "../dto/usuario.dto";

type UsuarioParcial = Omit<Usuario, "senha">;

export class UsuarioService {
    
    public async cadastrar(dados: CreateUsuarioDTO): Promise<UsuarioParcial> {
        const { nome, email, senha, username } = dados;

        const usuarioExistente = await prismaClient.usuario.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (usuarioExistente) {
            throw new HTTPError(409, "Email ou username já está em uso.");
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await prismaClient.usuario.create({
            data: {
                nome,
                email,
                senha: senhaCriptografada,
                username
            },
        });

        const { senha: _, ...usuarioSemSenha } = novoUsuario;
        return usuarioSemSenha;
    }

    public async login(dados: LoginUsuarioDTO): Promise<{ token: string; usuario: UsuarioParcial }> {
        const { emailOuUsername, senha } = dados;

        const usuario = await prismaClient.usuario.findFirst({
            where: {
                OR: [{ email: emailOuUsername }, { username: emailOuUsername }],
            },
        });

        if (!usuario) {
            throw new HTTPError(401, "Usuário não encontrado");
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            throw new HTTPError(402, "Senha inválida");
        }

        //  token JWT 
        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET || "minhaChaveSecreta"
        );

        const { senha: _, ...usuarioSemSenha } = usuario;
        return { token, usuario: usuarioSemSenha };
    }

    public async listarUsuarios(includeRelations: boolean = false): Promise<any[]> {
        const usuarios = await prismaClient.usuario.findMany({
            include: includeRelations
                ? {
                    tweets: {
                        select: {
                            id: true,
                            conteudo: true,
                            criadoEm: true,
                        },
                    },
                    likes: {
                        select: {
                            id: true,
                            tweetId: true,
                            criadoEm: true,
                        },
                    },
                    seguindo: {
                        select: {
                            seguidor: {
                                select: {
                                    id: true,
                                    nome: true,
                                    username: true,
                                },
                            },
                        },
                    },
                    seguido: {
                        select: {
                            usuario: {
                                select: {
                                    id: true,
                                    nome: true,
                                    username: true,
                                },
                            },
                        },
                    },
                }
                : undefined,
        });

        return usuarios.map(({ senha, ...usuarioSemSenha }) => usuarioSemSenha);
    }

    public async listarPorId(id: number): Promise<UsuarioParcial> {
        const usuario = await prismaClient.usuario.findUnique({ where: { id } });
        if (!usuario) throw new HTTPError(404, "Usuário não encontrado");
        const { senha, ...resto } = usuario;
        return resto;
    }

    public async atualizar(dados: UpdateUsuarioDTO): Promise<UsuarioParcial> {
        const { id, nome, email, senha, username } = dados;

        if (!nome && !email && !senha && !username) {
            throw new HTTPError(400, "Nenhum campo enviado para atualização.");
        }

        await this.listarPorId(id);

        const senhaCriptografada = senha ? await bcrypt.hash(senha, 10) : undefined;

        const usuarioAtualizado = await prismaClient.usuario.update({
            where: { id },
            data: {
                nome,
                email,
                username,
                senha: senhaCriptografada,
            },
        });

        const { senha: _, ...resto } = usuarioAtualizado;
        return resto;
    }

    public async deletar(id: number): Promise<UsuarioParcial> {
        await this.listarPorId(id);

        const usuarioExcluido = await prismaClient.usuario.delete({ where: { id } });
        const { senha: _, ...resto } = usuarioExcluido;
        return resto;
    }
}