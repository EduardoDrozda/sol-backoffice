#!/usr/bin/env node

/**
 * Script utilitário para executar comandos do Prisma no projeto Nx
 *
 * Uso:
 * node scripts/prisma.js <comando> [argumentos...]
 *
 * Exemplos:
 * node scripts/prisma.js generate
 * node scripts/prisma.js migrate deploy
 * node scripts/prisma.js db push
 * node scripts/prisma.js studio
 * node scripts/prisma.js db seed
 */

const { execSync } = require('child_process');
const path = require('path');

// Obtém o comando e argumentos da linha de comando
const [, , command, ...args] = process.argv;

if (!command) {
  console.error('Erro: Comando não especificado');
  console.log('Uso: node scripts/prisma.js <comando> [argumentos...]');
  console.log('');
  console.log('Comandos disponíveis:');
  console.log('  generate     - Gera o cliente do Prisma');
  console.log('  migrate      - Executa migrações');
  console.log('  db:push      - Faz push do schema para o banco');
  console.log('  db:pull      - Puxa o schema do banco');
  console.log('  studio       - Abre o Prisma Studio');
  console.log('  db:seed      - Executa o seed do banco');
  process.exit(1);
}

// Caminho para o diretório da API
const apiPath = path.join(process.cwd(), 'apps', 'sol-backoffice.api');

// Verifica se o diretório da API existe
const fs = require('fs');
if (!fs.existsSync(apiPath)) {
  console.error(`Erro: Diretório da API não encontrado: ${apiPath}`);
  process.exit(1);
}

// Verifica se o schema do Prisma existe
const schemaPath = path.join(apiPath, 'prisma', 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
  console.error(`Erro: Schema do Prisma não encontrado: ${schemaPath}`);
  process.exit(1);
}

try {
  // Constrói o comando completo
  const fullCommand = `npx prisma ${command} ${args.join(' ')}`;

  console.log(`Executando: ${fullCommand}`);
  console.log(`Diretório: ${apiPath}`);
  console.log('');

  // Executa o comando
  execSync(fullCommand, {
    cwd: apiPath,
    stdio: 'inherit',
    env: {
      ...process.env,
      // Garante que o .env da API seja usado
      DATABASE_URL: process.env.DATABASE_URL
    }
  });

  console.log('');
  console.log(`Comando executado com sucesso: ${command}`);
} catch (error) {
  console.error('');
  console.error(`Erro ao executar comando: ${error.message}`);
  process.exit(1);
}
