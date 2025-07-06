import { Router } from "express";
import { LikeController } from "../controllers/like.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export class LikeRoutes {
    public static bind(): Router {
        const router = Router();
        const controller = new LikeController();

        router.use(authMiddleware);

        router.get("/", controller.listar);
        router.get("/:id", controller.buscarPorId);
        router.post("/", controller.cadastrar);
        router.put("/:id", controller.atualizar);
        router.delete("/:id", controller.deletar);

        return router;
    }
}