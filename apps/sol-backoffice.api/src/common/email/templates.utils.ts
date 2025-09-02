import { EnviromentService } from '@common/enviroment';
import * as path from 'node:path';

// Função para testar a detecção de caminho dos templates
export function getTemplatesPath(envService: EnviromentService): string {
  const nodeEnv = envService.get('NODE_ENV');
  const customTemplatesPath = envService.get('EMAIL_TEMPLATES_PATH');

  let templatesDir: string;

  if (customTemplatesPath) {
    templatesDir = path.isAbsolute(customTemplatesPath)
      ? customTemplatesPath
      : path.join(process.cwd(), customTemplatesPath);
  } else if (nodeEnv === 'production') {
    templatesDir = path.resolve(__dirname, 'common/email/templates');
  } else {
    templatesDir = path.join(process.cwd(), 'apps/sol-backoffice.api/src/common/email/templates');
  }

  return templatesDir;
}

// Função para verificar se o diretório existe
export function validateTemplatesPath(templatesPath: string): boolean {
  try {
    const fs = require('fs');
    return fs.existsSync(templatesPath);
  } catch (error) {
    return false;
  }
}
