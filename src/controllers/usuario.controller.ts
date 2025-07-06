import { Request, Response } from "express";
import { HTTPError } from "../utils/http.error";
import { onError } from "../utils/on-error";
import { UsuarioService } from "../services/usuario.service";

export class UsuarioController {

    

    public static async cadastrar(req: Request, res: Response): Promise<void> {
        // #swagger.tags = ['Usuários']
        // #swagger.summary = 'Rota para cadastro de usuários'
        // #swagger.description = 'Essa rota permite o cadastro de um novo usuário na plataforma. O corpo da requisição deve conter as informações obrigatórias: nome, email, senha e username. A aplicação verifica se o e-mail ou username já estão em uso, e em caso afirmativo retorna um erro de conflito (HTTP 409). Se os dados forem válidos, o usuário é cadastrado com sucesso e seus dados (exceto a senha) são retornados na resposta.'
        /*  #swagger.requestBody = {
            required: true,
            schema: { $ref: "#/components/schemas/createUser" }
        } */
        try {

            // input
            const service = new UsuarioService();

            // processamento
            const resultado = await service.cadastrar(req.body);

            /* #swagger.responses[201] = {
            description: "Usuário cadastrado com sucesso.",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/respostaSucesso"
                    }
                }           
            }
            }*/

            /* #swagger.responses[409] = {
                        description: "Email ou username já está em uso.",
                        content: {
                            "application/json": {
                                schema:{
                                    $ref: "#/components/schemas/respostaFalha"
                                }
                            }           
                        }
            }*/

            /* #swagger.responses[500] = {
                        description: "Erro interno do servidor",
                        content: {
                            "application/json": {
                                schema:{
                                    $ref: "#/components/schemas/respostaFalha"
                                }
                            }           
                        }
            }*/            
            
            res.status(201).json({
                success: true,
                message: "Usuário cadastrado com sucesso.",
                dados: resultado,
            });
        } catch (error) {
            onError(error, res);
        }
    }

    public static async login(req: Request, res: Response): Promise<void> {
        // #swagger.tags = ['Usuários']
        // #swagger.summary = 'Rota para login de usuários'
        // #swagger.description = 'Essa rota realiza o login de um usuário autenticado. O corpo da requisição deve conter emailOuUsername (podendo ser o e-mail ou o nome de usuário) e a senha. A aplicação valida se o usuário existe e se a senha está correta.Se for válido, um token JWT é gerado e retornado junto aos dados públicos do usuário. Caso o e-mail/username não existam, ou a senha esteja incorreta, são retornados erros apropriados (401 ou 402).'
        /*  #swagger.requestBody = {
            required: true,
            schema: { $ref: "#/components/schemas/createLogin" }
        } */
        try {
            // input
            const { emailOuUsername, senha } = req.body;

            // validação
            if (!emailOuUsername || !senha) {
                throw new HTTPError(400, "E-mail/Username e Senha são obrigatórios.");
            }

            // processamento
            const service = new UsuarioService();
            const resultado = await service.login({ emailOuUsername, senha });

            /* #swagger.responses[201] = {
            description: "Login realizado com sucesso",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/respostaSucesso"
                    }
                }           
            }
            }*/

            /* #swagger.responses[401] = {
                        description: "Usuário não encontrado.",
                        content: {
                            "application/json": {
                                schema:{
                                    $ref: "#/components/schemas/respostaFalha"
                                }
                            }           
                        }
            }*/
            
            /* #swagger.responses[402] = {
                        description: "Senha inválida.",
                        content: {
                            "application/json": {
                                schema:{
                                    $ref: "#/components/schemas/respostaFalha"
                                }
                            }           
                        }
            }*/

            /* #swagger.responses[500] = {
                        description: "Erro interno do servidor",
                        content: {
                            "application/json": {
                                schema:{
                                    $ref: "#/components/schemas/respostaFalha"
                                }
                            }           
                        }
            }*/            
            

            res.status(200).json({
                success: true,
                message: "Login realizado com sucesso",
                dados: resultado,
            });
        } catch (error) {
            onError(error, res);
        }
    }

    public static async listar(req: Request, res: Response): Promise<void> {
        // #swagger.tags = ['Usuários']
        // #swagger.summary = 'Rota para listagem de todos os usuários'
        // #swagger.description = 'Essa rota retorna uma lista de todos os usuários cadastrados na plataforma. Por padrão, ela retorna apenas os dados básicos dos usuários (id, nome, email, username). É possível incluir informações adicionais (como tweets, likes e seguidores) utilizando o parâmetro includeRelations=true na URL. Essa funcionalidade é útil para exibir perfis ou fazer consultas administrativas.'
        try {

            // input
            const { completo } = req.query;
            const includeRelations = completo === "true";

            // processamento
            const service = new UsuarioService();
            const usuarios = await service.listarUsuarios(includeRelations);

            /* #swagger.responses[200] = {
            description: "Lista de usuários carregada com sucesso",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/respostaSucesso"
                    }
                }           
            }
            }*/

            /* #swagger.responses[500] = {
                        description: "Erro interno do servidor",
                        content: {
                            "application/json": {
                                schema:{
                                    $ref: "#/components/schemas/respostaFalha"
                                }
                            }           
                        }
            }*/ 

            res.status(200).json({
                success: true,
                message: "Lista de usuários carregada com sucesso",
                dados: usuarios,
            });
        } catch (error) {
            onError(error, res);
        }
    }

    public static async listarPorId(req: Request, res: Response): Promise<void> {
        // #swagger.tags = ['Usuários']
        // #swagger.summary = 'Rota para listagem de usuários por ID'
        // #swagger.description = 'Essa rota permite buscar um único usuário pelo seu ID. Ao enviar um ID válido na URL, a aplicação retorna os dados públicos do usuário correspondente (exceto a senha). Se o ID for inválido ou não houver usuário com aquele ID, a aplicação responde com erro 404.'
        try {
            
            // input
            const { id } = req.params;

            /* #swagger.responses[400] = {
            description: "ID inválido.",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/respostaFalha"
                    }
                }           
            }
            }*/

            if (!id || isNaN(Number(id))) {
                throw new HTTPError(400, "ID inválido.");
            }

            // processamento
            const userId = Number(id);
            const service = new UsuarioService();
            const usuario = await service.listarPorId(userId);

            /* #swagger.responses[200] = {
            description: "Usuário listado com sucesso",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/respostaSucesso"
                    }
                }           
            }
            }*/

            /* #swagger.responses[404] = {
            description: "Usuário não encontrado",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/respostaFalha"
                    }
                }           
            }
            }*/

            /* #swagger.responses[500] = {
                        description: "Erro interno do servidor",
                        content: {
                            "application/json": {
                                schema:{
                                    $ref: "#/components/schemas/respostaFalha"
                                }
                            }           
                        }
            }*/ 

            res.status(200).json({
                success: true,
                message: "Usuário listado com sucesso",
                dados: usuario,
            });
        } catch (error) {
            onError(error, res);
        }
    }

    public static async atualizar(req: Request, res: Response): Promise<void> {
        // #swagger.tags = ['Usuários']
        // #swagger.summary = 'Rota para atualização de usuários'
        // #swagger.description = 'Essa rota permite atualizar os dados de um usuário existente. O ID do usuário deve ser passado na URL e os campos a serem atualizados no corpo da requisição (nome, email, senha e/ou username). Todos os campos são opcionais, mas pelo menos um deve ser enviado — caso contrário, a aplicação retorna erro 400. Se o usuário for encontrado e os dados forem válidos, ele é atualizado com sucesso.'
        /*  #swagger.requestBody = {
            required: true,
            schema: { $ref: "#/components/schemas/updateUser" }
        } */
        try {

            // input
            const { id } = req.params;

            /* #swagger.responses[400] = {
            description: "ID inválido.",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/respostaFalha"
                    }
                }           
            }
            }*/

            if (!id || isNaN(Number(id))) {
                throw new HTTPError(400, "ID inválido.");
            }

            const { nome, email, senha, username } = req.body;
            const dadosAtualizacao = {
                id: Number(id),
                nome,
                email,
                senha,
                username,
            };

            // processamento
            const service = new UsuarioService();
            const resultado = await service.atualizar(dadosAtualizacao);

            /* #swagger.responses[200] = {
            description: "Usuário atualizado com sucesso",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/respostaSucesso"
                    }
                }           
            }
            }*/

            /* #swagger.responses[400] = {
            description: "Nenhum campo enviado para atualização.",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/respostaFalha"
                    }
                }           
            }
            }*/

            res.status(200).json({
                success: true,
                message: "Usuário atualizado com sucesso",
                dados: resultado,
            });
        } catch (error) {
            onError(error, res);
        }
    }

    public static async deletar(req: Request, res: Response): Promise<void> {
        // #swagger.tags = ['Usuários']
        // #swagger.summary = 'Rota para exclusão de usuários'
        // #swagger.description = 'Essa rota permite remover um usuário da plataforma informando seu ID na URL. Ao realizar a exclusão, o usuário e todas as suas informações vinculadas (como tweets e seguidores) são apagados do banco de dados. Caso o ID não exista, a aplicação retorna erro 404 informando que o usuário não foi encontrado.'
        try {

            // input
            const { id } = req.params;
            const userId = Number(id);

            // processamento
            const service = new UsuarioService();
            const resultado = await service.deletar(userId);

            /* #swagger.responses[200] = {
            description: "Usuário excluído com sucesso.",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/respostaSucesso"
                    }
                }           
            }
            }*/
            res.status(200).json({
                success: true,
                message: "Usuário excluído com sucesso",
                dados: resultado,
            });
        } catch (error) {
            onError(error, res);
        }
    }

}