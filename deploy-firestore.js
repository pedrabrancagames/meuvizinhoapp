#!/usr/bin/env node

/**
 * Script para implantar regras do Firestore e configurações
 * Execute: node deploy-firestore.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Iniciando implantação das configurações do Firebase...\n');

// Verificar se o Firebase CLI está instalado
try {
  execSync('firebase --version', { stdio: 'pipe' });
  console.log('✅ Firebase CLI encontrado');
} catch (error) {
  console.error('❌ Firebase CLI não encontrado. Instale com: npm install -g firebase-tools');
  process.exit(1);
}

// Verificar se está logado no Firebase
try {
  execSync('firebase projects:list', { stdio: 'pipe' });
  console.log('✅ Usuário autenticado no Firebase');
} catch (error) {
  console.error('❌ Não está logado no Firebase. Execute: firebase login');
  process.exit(1);
}

// Verificar se os arquivos de configuração existem
const requiredFiles = ['firebase.json', 'firestore.rules', 'firestore.indexes.json'];
const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, file)));

if (missingFiles.length > 0) {
  console.error(`❌ Arquivos de configuração não encontrados: ${missingFiles.join(', ')}`);
  process.exit(1);
}

console.log('✅ Arquivos de configuração encontrados');

try {
  // Implantar regras do Firestore
  console.log('\n📋 Implantando regras do Firestore...');
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
  console.log('✅ Regras do Firestore implantadas com sucesso');

  // Implantar índices do Firestore
  console.log('\n📊 Implantando índices do Firestore...');
  execSync('firebase deploy --only firestore:indexes', { stdio: 'inherit' });
  console.log('✅ Índices do Firestore implantados com sucesso');

  console.log('\n🎉 Implantação concluída com sucesso!');
  console.log('\n📝 Próximos passos:');
  console.log('1. Reinicie o servidor de desenvolvimento: npm run dev');
  console.log('2. Teste a autenticação com Google');
  console.log('3. Verifique se os erros de CORS foram resolvidos');

} catch (error) {
  console.error('\n❌ Erro durante a implantação:', error.message);
  console.log('\n🔧 Soluções possíveis:');
  console.log('1. Verifique se o projeto Firebase está selecionado: firebase use --add');
  console.log('2. Verifique suas permissões no projeto Firebase');
  console.log('3. Tente fazer login novamente: firebase login --reauth');
  process.exit(1);
}