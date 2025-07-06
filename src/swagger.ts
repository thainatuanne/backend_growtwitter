import { sign } from 'crypto';
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    "title": "Grow Twitter",
    "version": "1.0",
    description: "O GrowTwitter é uma API desenvolvida com Node.js, Express e Prisma ORM, conectada a um banco de dados PostgreSQL. A API implementa uma rede social estilo Twitter, permitindo o gerenciamento de usuários, tweets, likes e autenticação.",
    "contact": {
            "name": "Bruninho Volotão",
            "email": "bruninhovolotao@hotmail.com",
            "url": "https://github.com/bruninhovolotao/back-end-growtwitter"
    },
  },
  host: 'localhost:3030',
  tags: [
    {
        name: "Usuários",
        description: "Rotas para os dados de usuários criados."
      },
      {
        name: "Tweets",
        description: "Rotas para os dados de tweets criados."
      },
  ],
  components: {
    schemas:{
        respostaSucesso: {
            $sucesso: true,
            $mensagem: "Mensagem de sucesso",
            $dados: {}
        },
        respostaFalha: {
            $sucesso: false,
            $mensagem: "Mensagem de falha",
            detalhe: "Mensagem com o erro detalhado"
        },
        signup:{
            $id: 1,
            $nome: 'João',
            $email: 'joao@gmail.com',
            $senha: '12345',
            $username: 'joao01',
            criadoEm: '2025-06-21T16:40:28.866Z',
            atualizadoEm: '2025-06-21T16:40:28.866Z'
        },
        login:{
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUxMDczMjM1fQ.l7DmXYaAbnuT1CITCeQLliq8x4Xg80lWlf_j4-52oWc',
            $id: 1,
            $nome: 'João',
            $email: 'joao@gmail.com',
            $senha: '12345',
            $username: 'joao01',
            criadoEm: '2025-06-21T16:40:28.866Z',
            atualizadoEm: '2025-06-21T16:40:28.866Z'
        },
        createLogin:{
            $emailOuUsername:'joao@gmail.com',
            $senha: '12345' 
        },
        createUser:{
            $nome: 'João',
            $email: 'joao@gmail.com',
            $senha: '12345',
            $username: 'joao01',
        },
        ListUser:{
            $id: 1,
            $nome: 'João',
            $email: 'joao@gmail.com',
            $username: 'joao01',
            criadoEm: "2025-06-21T16:40:28.866Z",
            atuzalizadoEm: "2025-06-21T16:40:28.866Z"
        },
        ListUserId:{
            $id: 1,
            $nome: 'João',
            $email: 'joao@gmail.com',
            $username: 'joao01',
            criadoEm: "2025-06-21T16:40:28.866Z",
            atuzalizadoEm: "2025-06-21T16:40:28.866Z"
        },
        updateUser:{
            $nome: 'João',
            $email: 'joao@gmail.com',
            $senha: '12345',
            $username: 'joao01',
        },
        createTweet:{
            $conteudo: "Meu primeiro Tweet",
            $tipo: "tweet",
            $usuarioId: 1
        },
        updateTweet:{
            $id: 4,
            $conteudo: "Este é o tweet atualizado",
            $tipo: "tweet"
        },
        createReply:{
            $conteudo: "Este é uma resposta de um tweet!"
        }
    }
  }
};

const outputFile = './src/swagger-output.json';
const routes = [
    './src/routes/tweet.routes.ts',
    './src/routes/usuario.routes.ts'
];

swaggerAutogen({ openapi: "3.0.4" })(outputFile, routes, doc);