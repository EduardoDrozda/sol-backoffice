import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { execSync } from 'child_process';
import { join } from 'path';

export interface PrismaSchematicOptions {
  command: string;
  args?: string[];
}

export function prismaSchematic(options: PrismaSchematicOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const apiPath = join(process.cwd(), 'apps', 'sol-backoffice.api');

    try {
      // Executa o comando do Prisma no diretório da API
      const command = `npx prisma ${options.command} ${options.args?.join(' ') || ''}`;

      context.logger.info(`Executando: ${command}`);
      context.logger.info(`Diretório: ${apiPath}`);

      execSync(command, {
        cwd: apiPath,
        stdio: 'inherit',
        env: {
          ...process.env,
          // Garante que o .env da API seja usado
          DATABASE_URL: process.env.DATABASE_URL
        }
      });

      context.logger.info(`Comando do Prisma executado com sucesso: ${options.command}`);
    } catch (error) {
      context.logger.error(`Erro ao executar comando do Prisma: ${error}`);
      throw error;
    }

    return tree;
  };
}
