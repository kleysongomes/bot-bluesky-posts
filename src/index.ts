import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();


const posts = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'posts.json'), 'utf-8')
);


async function getBlueskyAccessToken() {
  try {
    const response = await axios.post('https://bsky.social/xrpc/com.atproto.server.createSession', {
      identifier: process.env.IDENTIFIER,
      password: process.env.PASSWORD,
    });

    return response.data.accessJwt; 
  } catch (error) {
    console.error('Erro ao obter o token de acesso:', error);
    throw error;
  }
}

// Função para publicar uma postagem no Bluesky
async function postToBluesky(content: string, accessToken: string) {
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

    console.log('Postagem publicada:', response.data);
  } catch (error) {
    console.error('Erro ao publicar:', error);
  }
}

async function runBot() {
  const accessToken = await getBlueskyAccessToken();

  for (const post of posts) {
    await postToBluesky(post.content, accessToken);
    console.log('Aguardando 30 minutos para próxima postagem...');
    await new Promise((resolve) => setTimeout(resolve, 30 * 60 * 1000)); // 30 minutos
  }
}

runBot().catch(console.error);
