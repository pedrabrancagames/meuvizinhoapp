<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MeuVizinhoApp - Aplicativo de empréstimo de itens entre vizinhos

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1QO4PXIc1I30W0J--yWHyPW0RDYqVY-Zl

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` and Firebase credentials in [.env.local](.env.local)
3. Run the app:
   `npm run dev`

## Configuração do Firebase

Este projeto está configurado para usar o Firebase. Para usar as credenciais do seu próprio projeto Firebase:

1. Atualize as variáveis de ambiente no arquivo `.env.local` com suas credenciais do Firebase
2. Instale as dependências: `npm install firebase`
3. As configurações atuais estão definidas para o projeto `dbmeuvizinhoapp-f3ad6`

### Variáveis de Ambiente do Firebase

- `VITE_FIREBASE_API_KEY`: Chave da API do Firebase
- `VITE_FIREBASE_AUTH_DOMAIN`: Domínio de autenticação
- `VITE_FIREBASE_PROJECT_ID`: ID do projeto
- `VITE_FIREBASE_STORAGE_BUCKET`: Bucket de armazenamento
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: ID do remetente de mensagens
- `VITE_FIREBASE_APP_ID`: ID do aplicativo
