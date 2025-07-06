import { Request, Response } from "express";
import { HTTPError } from "../utils/http.error"; 
import { onError } from "../utils/on-error";
import { TweetService } from "../services/tweet.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class TweetController{
    
    public static async cadastrar(req: AuthenticatedRequest, res: Response): Promise<void> {
        // #swagger.tags = ['Tweets']
        // #swagger.summary = 'Criar um novo tweet'
        // #swagger.description = 'Cria um tweet público vinculado a um usuário. É necessário informar o conteúdo do tweet, o tipo (tweet ou reply) e o ID do usuário autor. Retorna o tweet criado com sucesso.'
        /*  #swagger.requestBody = {
            required: true,
            schema: { $ref: "#/components/schemas/createTweet" }
        } */
        try {
            // input
            const { conteudo, tipo } = req.body;
            const usuarioId = req.userId

            /* #swagger.responses[401] = {
            description: "Usuário não autenticado.",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/respostaFalha"
                    }
                }           
            }
            }*/

            if (!usuarioId) {
            throw new HTTPError(401, "Usuário não autenticado.");
            }

            const service = new TweetService();
            
            // processamento
            const resultado = await service.cadastrar({ conteudo, tipo, usuarioId });

            /* #swagger.responses[201] = {
            description: "Tweet cadastrado com sucesso",
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
           

            res.status(201).json({
                sucesso: true,
                mensagem: "Tweet cadastrado com sucesso",
                dados: resultado,
            })

            } catch (error) {
                onError(error, res);
            }
    }
    
    public static async listar(req: Request, res: Response): Promise<void> {
        // #swagger.tags = ['Tweets']
        // #swagger.summary = 'Listar todos os tweets'
        // #swagger.description = 'Retorna uma lista com todos os tweets públicos cadastrados na plataforma. Inclui informações do autor, quantidade de likes, replies associados e detalhes do usuário.'
        try {
            // input
            const service = new TweetService();

            // processamento
            const tweets = await service.listarTweets();

            /* #swagger.responses[201] = {
            description: "Lista de tweets carregada com sucesso",
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
                message: "Lista de tweets carregada com sucesso",
                dados: tweets,
        });
        
        } catch (error) {
            onError(error, res);
        }
    }

    public static async listarPorId(req: Request, res: Response): Promise<void> {
        // #swagger.tags = ['Tweets']
        // #swagger.summary = 'Listar tweets por ID de usuárioRota para cadastro de usuários'
        // #swagger.description = 'Retorna todos os tweets publicados por um usuário específico, identificado pelo ID. Inclui os dados do autor, replies e número de interações. Se o usuário não tiver tweets ou o ID for inválido, retorna erro 404.'
        try {
            // input
            const { usuarioId } = req.params;
            const userId = Number(usuarioId);
            const service = new TweetService();

            // processamento
            const tweets = await service.listarPorId( userId );

            /* #swagger.responses[201] = {
            description: "Lista de tweets carregada com sucesso",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/respostaSucesso"
                    }
                }           
            }
            }*/

            /* #swagger.responses[404] = {
            description: "ID de usuário não encontrado.",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/respostaFalha"
                    }
                }           
            }
            }*/

            /* #swagger.responses[404] = {
            description: "Nenhum tweet encontrado para o usuário",
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
                message: "Lista de tweets carregada com sucesso",
                dados: tweets,
            });
            } catch (error) {
            onError(error, res);
            }
    }

    public static async atualizar(req: Request, res: Response): Promise<void> {
        // #swagger.tags = ['Tweets']
        // #swagger.summary = 'Atualizar um tweet'
        // #swagger.description = 'Atualiza o conteúdo e/ou tipo (tweet ou reply) de um tweet existente. O ID do tweet é informado na URL e os dados a atualizar no corpo da requisição. Se o tweet não for encontrado, retorna erro 404.'
        /*  #swagger.requestBody = {
            required: true,
            schema: { $ref: "#/components/schemas/updateTweet" }
        } */

        try {
            // input
            const { id, conteudo, tipo } = req.body;
            const service = new TweetService();
            
            // processamento
            const updateTweet = await service.atualizar({ id, conteudo, tipo });

            /* #swagger.responses[201] = {
            description: "Tweet atualizado com sucesso",
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

            res.status(201).json({
                sucesso: true,
                mensagem: "Tweet atualizado com sucesso",
                dados: updateTweet,
            })
            
            } catch (error) {
                onError(error, res);
                
            }
    }

    public static async deletar(req: Request, res: Response): Promise<void> {
        // #swagger.tags = ['Tweets']
        // #swagger.summary = 'Deletar um tweet'
        // #swagger.description = 'Remove um tweet da plataforma a partir do seu ID. Se o tweet existir, ele é excluído permanentemente. Caso não seja encontrado, a API retorna erro 404.'
        try {
            // input
            const { id } = req.params;
            const tweetId = Number(id);
            const service = new TweetService();

            // processamento
            const deletarTweet = await service.deletar( tweetId );

            /* #swagger.responses[201] = {
            description: "Tweet excluído com sucesso",
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

            res.status(201).json({
                sucesso: true,
                mensagem: "Tweet excluído com sucesso",
                dados: deletarTweet
            })

        } catch (error) {
            onError(error, res);
        }
    }

    public static async criarRetweet(req: Request, res: Response): Promise<void>{
        // #swagger.tags = ['Tweets']
        // #swagger.summary = 'Responder um tweet existente'
        // #swagger.description = 'Cria uma resposta (reply) a um tweet já existente, identificado por seu ID. O corpo da requisição deve conter o conteúdo da resposta e o ID do usuário que está respondendo. O tweet original deve existir, caso contrário um erro é retornado.'
        /*  #swagger.requestBody = {
            required: true,
            schema: { $ref: "#/components/schemas/createReply" }
        } */

        try {
            const { id: tweetIdParams } = req.params
            const { conteudo } = req.body
            const usuarioId = req.userId
            const tweetId = Number(tweetIdParams);

            if (!conteudo || isNaN(tweetId)) {
                res.status(400).json({
                success: false,
                message: "Conteúdo ou ID do tweet inválido.",
                });
                return;
            }

            const service = new TweetService();

            const reply = await service.criarRetweet({
                conteudo, 
                usuarioId, 
                tweetId
            });

            /* #swagger.responses[201] = {
            description: "Resposta criada com sucesso",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/respostaSucesso"
                    }
                }           
            }
            }*/

            /* #swagger.responses[404] = {
            description: "Nenhum tweet encontrado para o usuário",
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
                sucess: true,
                message: "Resposta criada com sucesso",
                data: reply
            })
        } catch (error) {
            onError(error, res)
        }
    }

    public static async feed(req: Request, res: Response): Promise<void>{
        // #swagger.tags = ['Tweets']
        // #swagger.summary = 'Listar feed do usuário'
        // #swagger.description = 'Retorna uma lista de tweets do próprio usuário e dos usuários que ele segue. Essa rota simula um feed social com ordenação cronológica. Inclui informações do autor, replies e contagem de likes.'
        const usuarioId = req.userId

        try {
            const service = new TweetService();

            const feed = await service.feed({usuarioId});

            /* #swagger.responses[201] = {
            description: "Feed carregado com sucesso",
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

            res.status(201).json({
                sucess: true,
                message: "Feed carregado com sucesso",
                data: feed
            })
            
        } catch (error) {
            onError(error, res)
            
        }
    }

}