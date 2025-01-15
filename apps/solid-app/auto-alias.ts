import type { Alias } from 'vite';

import fs from 'node:fs';
import path from 'node:path';

export const autoAlias: Alias = {
  find: /^@\/(.*)$/,
  replacement: '$1',
  customResolver(source, importer) {
    if (source.length && importer?.length) {
      const rootDirectory = findPackageJsonDir(importer);
      if (!rootDirectory) return null;

      const target = path.join(rootDirectory, 'src', source);

      if (fs.existsSync(target) && fs.statSync(target).isFile()) {
        return target;
      } else if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
        const filePath = path.join(target, 'index.ts');
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          return filePath;
        } else {
          return null;
        }
      } else {
        let filePath = `${target}.ts`;
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          return filePath;
        }
        filePath = `${filePath}x`;
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          return filePath;
        }
        return null;
      }
    }
    return null;
  },
};

function findPackageJsonDir(filePath: string): string | null {
  let currentDir = path.dirname(filePath);
  while (currentDir !== path.parse(currentDir).root) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
}
