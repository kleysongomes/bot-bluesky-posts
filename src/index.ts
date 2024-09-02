import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

console.log('Iniciando o bot...');

// Verifica se as variáveis de ambiente foram carregadas corretamente
if (!process.env.IDENTIFIER || !process.env.PASSWORD) {
  console.error('Erro: As variáveis de ambiente IDENTIFIER e PASSWORD não estão definidas.');
  process.exit(1);
}

console.log('Variáveis de ambiente carregadas com sucesso.');

const postsPath = path.join(__dirname, 'posts.json');
console.log(`Caminho do arquivo de posts: ${postsPath}`);

interface Post {
  content: string;
}

let posts: Post[] = [];
try {
  const data = fs.readFileSync(postsPath, 'utf-8');
  posts = JSON.parse(data);
  console.log('Posts carregados com sucesso:', posts);
} catch (error) {
  console.error('Erro ao ler o arquivo posts.json:', error);
  process.exit(1);
}

async function getBlueskyAccessToken() {
  console.log('Tentando obter o token de acesso...');
  try {
    const response = await axios.post('https://bsky.social/xrpc/com.atproto.server.createSession', {
      identifier: process.env.IDENTIFIER,
      password: process.env.PASSWORD,
    });

    console.log('Token de acesso obtido com sucesso.');
    return response.data.accessJwt;
  } catch (error) {
    console.error('Erro ao obter o token de acesso:', error);
    throw error;
  }
}

async function postToBluesky(content: string, accessToken: string) {
  console.log(`Tentando publicar post: "${content}"`);
  const apiEndpoint = 'https://bsky.social/xrpc/com.atproto.repo.createRecord';

  try {
    const response = await axios.post(
      apiEndpoint,
      {
        repo: `${process.env.IDENTIFIER}.bsky.social`, 
        collection: 'app.bsky.feed.post',
        record: {
          $type: 'app.bsky.feed.post',
          text: content,
          createdAt: new Date().toISOString(),
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Postagem publicada com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao publicar a postagem:', error);
  }
}

async function runBot() {
  const accessToken = await getBlueskyAccessToken();

  for (const post of posts) {
    await postToBluesky(post.content, accessToken);
    console.log('Aguardando 30 minutos para próxima postagem...');
    await new Promise((resolve) => setTimeout(resolve, 30 * 60 * 1000)); // 30 minutos
  }

  console.log('Todas as postagens foram concluídas.');
}

runBot().catch(console.error);
