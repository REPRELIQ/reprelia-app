# reprelia-app

## Descrição

Descreva aqui o propósito do projeto.

## Como começar

```bash
git clone https://github.com/REPRELIQ/reprelia-app.git
cd reprelia-app
npm install
npm run dev
```

O servidor sobe em `http://localhost:3000` (porta configurável via variável de ambiente `PORT`).

## Scripts disponíveis

| Script           | Descrição                                                  |
| ---------------- | ---------------------------------------------------------- |
| `npm run dev`    | Sobe o servidor em modo watch (recompila a cada alteração) |
| `npm run build`  | Compila o TypeScript para `dist/`                          |
| `npm start`      | Executa o build compilado (`dist/index.js`)                |
| `npm run lint`   | Roda o ESLint                                              |
| `npm run format` | Formata o código com Prettier                              |
| `npm test`       | Roda a suíte de testes (Vitest)                            |

## API

### `GET /health`

Health check do serviço.

**Resposta `200`**

```json
{ "status": "ok" }
```

### `POST /echo`

Recebe uma mensagem e a retorna de volta.

**Corpo da requisição**

```json
{ "message": "hello" }
```

**Resposta `200`**

```json
{ "message": "hello" }
```

**Resposta `400`** (quando `message` está ausente ou não é uma string)

```json
{ "error": "message is required and must be a string" }
```

### `DELETE /items/:id`

Remove um item de exemplo (dados em memória, reiniciados a cada execução do servidor;
os ids `1`, `2` e `3` já existem por padrão).

**Resposta `204`** — item removido com sucesso, sem corpo.

**Resposta `404`** (quando o id não existe, ou já foi removido antes)

```json
{ "error": "item 999 not found" }
```

## Estrutura do projeto

```
.
├── .github/            # Templates de issue/PR e workflows de CI
├── src/                 # Código-fonte (app.ts define as rotas, index.ts inicia o servidor)
├── tests/               # Testes automatizados (Vitest + Supertest)
├── CONTRIBUTING.md      # Guia de contribuição
├── CODE_OF_CONDUCT.md   # Código de conduta
├── SECURITY.md          # Política de segurança e divulgação de vulnerabilidades
├── LICENSE               # Licença do projeto
└── README.md
```

## Contribuindo

Consulte [CONTRIBUTING.md](CONTRIBUTING.md).

## Segurança

Consulte [SECURITY.md](SECURITY.md) para reportar vulnerabilidades.

## Licença

Este projeto está licenciado sob os termos da licença MIT — veja [LICENSE](LICENSE).
