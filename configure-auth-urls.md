# Configuração de URLs Autorizadas no Firebase Auth

## Problema Identificado

O erro 404 indica que o Firebase Auth está tentando redirecionar para URLs não configuradas. Precisamos configurar as URLs autorizadas no Firebase Console.

## Solução

### 1. Acesse o Firebase Console
Abra: https://console.firebase.google.com/project/dbmeuvizinhoapp-f3ad6/authentication/settings

### 2. Configure as URLs Autorizadas

Na seção **"Domínios autorizados"**, adicione:

```
localhost
127.0.0.1
meuvizinhoapp.vercel.app
```

### 3. Configure URLs de Redirecionamento

Na seção **"Configurações de login"**, configure:

**URLs de redirecionamento autorizadas:**
- `http://localhost:3000`
- `https://meuvizinhoapp.vercel.app`

### 4. Configurar Google OAuth

Se estiver usando login com Google:

1. Vá para **Authentication > Sign-in method**
2. Clique em **Google**
3. Em **"Domínios autorizados"**, adicione:
   - `localhost`
   - `meuvizinhoapp.vercel.app`

### 5. Verificar Configuração do Projeto

Certifique-se de que no **Google Cloud Console** (https://console.cloud.google.com/):

1. Vá para **APIs & Services > Credentials**
2. Encontre seu **OAuth 2.0 Client ID**
3. Em **"Authorized redirect URIs"**, adicione:
   - `http://localhost:3000/__/auth/handler`
   - `https://meuvizinhoapp.vercel.app/__/auth/handler`
   - `https://dbmeuvizinhoapp-f3ad6.firebaseapp.com/__/auth/handler`

## Comandos Úteis

```bash
# Abrir console do Firebase
start https://console.firebase.google.com/project/dbmeuvizinhoapp-f3ad6/authentication/settings

# Verificar configuração atual
firebase auth:export users.json --format=json
```

## Após a Configuração

1. Limpe o cache do navegador (Ctrl+Shift+R)
2. Teste o login novamente
3. Verifique se não há mais erros 404