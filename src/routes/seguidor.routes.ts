import { Router } from "express";
import { SeguidorController } from "../controllers/seguidor.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export class seguidorRoutes {
    public static bind(): Router {
        const router = Router();
        const controller = new SeguidorController();

        router.use(authMiddleware);

        router.get("/", controller.listar);
        router.get("/:id", controller.buscarPorId);
        router.post("/", controller.cadastrar);
        router.put("/:id", controller.atualizar);
        router.delete("/:id", controller.deletar);

        return router;
    }
}