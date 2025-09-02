import { PrismaClient } from '@prisma/client';

// Configuração do Prisma para o projeto Nx
export const prismaConfig = {
  // Caminho para o schema do Prisma
  schemaPath: 'apps/sol-backoffice.api/prisma/schema.prisma',

  // Caminho para o arquivo .env da API
  envPath: 'apps/sol-backoffice.api/.env',

  // Configurações do cliente
  client: {
    log: ['query', 'info', 'warn', 'error'],
  },
};

// Instância do cliente Prisma
export const prisma = new PrismaClient(prismaConfig.client);

// Função para conectar ao banco de dados
export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('Conectado ao banco de dados com sucesso');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

// Função para desconectar do banco de dados
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('Desconectado do banco de dados');
  } catch (error) {
    console.error('Erro ao desconectar do banco de dados:', error);
    throw error;
  }
}

// Função para gerar o cliente do Prisma
export async function generatePrismaClient() {
  const { execSync } = require('child_process');
  const path = require('path');

  try {
    const apiPath = path.join(process.cwd(), 'apps', 'sol-backoffice.api');
    execSync('npx prisma generate', {
      cwd: apiPath,
      stdio: 'inherit',
    });
    console.log('Cliente do Prisma gerado com sucesso');
  } catch (error) {
    console.error('Erro ao gerar cliente do Prisma:', error);
    throw error;
  }
}
