import { Router } from "express";
import { TweetController } from '../controllers/tweet.controller';
import { authMiddleware } from "../middlewares/auth.middleware";

export class TweetRoutes {
    public static bind(): Router{
        const router = Router();

        router.use(authMiddleware);
        
        router.get("/tweets", TweetController.listar);
        router.get("/tweets/:id", TweetController.listarPorId);
        router.get("/feed", TweetController.feed);
        router.post("/tweets", TweetController.cadastrar);
        router.post("/tweets/:id/reply", TweetController.criarRetweet);
        router.put("/tweets/:id", TweetController.atualizar);
        router.delete("/tweets/:id", TweetController.deletar);

        return router;

    }
}