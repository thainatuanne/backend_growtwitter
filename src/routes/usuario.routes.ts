import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export class UsuarioRoutes  {
    public static bind(): Router {
        const router = Router();
        
        router.post("/sign-up", UsuarioController.cadastrar);
        router.post("/login", UsuarioController.login);
        router.get("/user", UsuarioController.listar);
        router.get("/user/:id", UsuarioController.listarPorId);
        router.put("/user/:id", authMiddleware, UsuarioController.atualizar);
        router.delete("/user/:id", authMiddleware, UsuarioController.deletar);

        return router;
    }
}