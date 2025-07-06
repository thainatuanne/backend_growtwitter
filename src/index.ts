import express from 'express';
import {envs} from './envs';
import { UsuarioRoutes  } from './routes/usuario.routes';
import { TweetRoutes } from './routes/tweet.routes';
import { LikeRoutes } from './routes/like.routes';
import cors from 'cors';
import { DocsRoutes } from './routes/docs.routes';
import { seguidorRoutes } from './routes/seguidor.routes';

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_, res, next) => {
    res.status(200).json({
        sucess: true,
        message: "Welcome to the API",
    })
});

app.use(DocsRoutes .bind())
app.use(UsuarioRoutes .bind())
app.use(TweetRoutes.bind())
app.use(LikeRoutes.bind())
app.use(seguidorRoutes.bind())

app.listen(envs.PORT, () => console.log('Servidor conectado com sucesso.'))