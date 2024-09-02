# Bluesky Automatic Post Bot

Este bot realiza postagens automáticas na plataforma Bluesky utilizando um arquivo JSON como fonte de conteúdo.

## Requisitos

- Node.js 14+
- TypeScript
- Conta na Bluesky

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/bluesky-post-bot.git
   cd bluesky-post-bot
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Compile o TypeScript:
   ```bash
   npx tsc
   ```

## Configuração

1. Renomeie `.env.example` para `.env` e adicione suas credenciais da Bluesky:
   ```
   IDENTIFIER=seu_identificador
   PASSWORD=sua_senha
   ```

2. Crie um arquivo `posts.json` no diretório raiz no seguinte formato:
   ```json
   [
     {"content": "Primeiro post!"},
     {"content": "Segundo post!"}
   ]
   ```

## Execução

Execute o bot com o seguinte comando:
```bash
npx ts-node postBot.ts
```

## Funcionalidades

- Realiza postagens automáticas a partir de um arquivo JSON.
- Adiciona hashtags automaticamente aos posts.
- Opera em intervalos definidos (padrão: 1 hora).

## Licença

Licenciado sob a MIT License.
