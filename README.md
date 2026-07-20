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

## Variáveis de ambiente

| Variável               | Padrão            | Descrição                                          |
| ---------------------- | ----------------- | -------------------------------------------------- |
| `PORT`                 | `3000`            | Porta em que o servidor escuta                     |
| `RATE_LIMIT_WINDOW_MS` | `900000` (15 min) | Janela de tempo do rate limiting, em milissegundos |
| `RATE_LIMIT_MAX`       | `100`             | Máximo de requisições por IP dentro da janela      |

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

Os corpos de requisição são validados com [Zod](https://zod.dev) (schemas em `src/schemas.ts`);
requisições inválidas retornam `400` com uma mensagem de erro descritiva.

Todas as rotas têm rate limiting por IP (padrão: 100 requisições a cada 15 minutos, configurável
via `RATE_LIMIT_WINDOW_MS`/`RATE_LIMIT_MAX`). Ao exceder o limite, a resposta é `429`:

```json
{ "error": "Too many requests, please try again later." }
```

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

### `GET /items`

Lista os itens de exemplo (dados em memória, reiniciados a cada execução do servidor;
os ids `1`, `2` e `3` já existem por padrão).

**Resposta `200`**

```json
[
  { "id": "1", "name": "item-1" },
  { "id": "2", "name": "item-2" },
  { "id": "3", "name": "item-3" }
]
```

### `GET /items/:id`

Busca um item de exemplo pelo id.

**Resposta `200`**

```json
{ "id": "1", "name": "item-1" }
```

**Resposta `404`** (quando o id não existe)

```json
{ "error": "item 999 not found" }
```

### `PUT /items/:id`

Cria ou substitui um item de exemplo (upsert; dados em memória, reiniciados a cada
execução do servidor; os ids `1`, `2` e `3` já existem por padrão).

**Corpo da requisição**

```json
{ "name": "updated-item" }
```

**Resposta `200`**

```json
{ "id": "1", "name": "updated-item" }
```

**Resposta `400`** (quando `name` está ausente ou é uma string vazia)

```json
{ "error": "name is required and must be a non-empty string" }
```

### `PATCH /items/:id`

Atualiza parcialmente um item existente (diferente do `PUT`, não faz upsert — o item
precisa já existir — e só altera os campos enviados no corpo).

**Corpo da requisição** (pelo menos um dos campos)

```json
{ "name": "renamed-item", "description": "a great item" }
```

**Resposta `200`**

```json
{ "id": "1", "name": "renamed-item", "description": "a great item" }
```

**Resposta `404`** (quando o id não existe)

```json
{ "error": "item 999 not found" }
```

**Resposta `400`** (quando nenhum campo é enviado, ou `name`/`description` é inválido)

```json
{ "error": "at least one of name or description must be provided" }
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
