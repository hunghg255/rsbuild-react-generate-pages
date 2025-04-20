import type { RsbuildPlugin } from '@rsbuild/core';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

import { Route } from './route.js';

export const pluginReactGeneratePages = (baseDir: string = 'src/pages'): RsbuildPlugin => {
  baseDir = baseDir.replace(/^\/+|\/+$/g, '')

  return {
    name: 'rsbuild-plugin-generate-pages',
    async setup(api) {
      // Fork: https://github.com/rspack-contrib/rsbuild-plugin-virtual-module

      const TEMP_DIR = join(
        process.cwd(),
        'node_modules/.rsbuild-virtual-module',
      );

      const virtualModules = {
        '~pages': () => {
          const route = new Route(baseDir)
          const data = route.getRouteData()

          return `export default [${data}]`
        }
      };

      const virtualFileAbsolutePaths: [string, string][] = Object.keys(
        virtualModules,
      ).map((i) => {
        let absolutePath = join(TEMP_DIR, i);
        if (!extname(absolutePath)) {
          absolutePath = `${absolutePath}.js`;
        }
        return [i, absolutePath];
      });

      api.onBeforeCreateCompiler(async () => {
        await mkdir(TEMP_DIR, { recursive: true });
        await Promise.all(
          virtualFileAbsolutePaths.map(([_, absolutePath]) =>
            writeFile(absolutePath, '', 'utf-8'),
          ),
        );
      });

      api.modifyBundlerChain((chain) => {
        chain.resolve.alias.merge(Object.fromEntries(virtualFileAbsolutePaths));
      });

      for (const [moduleName, absolutePath] of virtualFileAbsolutePaths) {
        //@ts-expect-error
        const handler = virtualModules[moduleName];
        if (!handler) {
          continue;
        }
        api.transform({ test: absolutePath }, handler);
      }
    },
  };
};
