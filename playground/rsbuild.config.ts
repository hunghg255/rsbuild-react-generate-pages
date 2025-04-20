import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginReactGeneratePages} from 'rsbuild-react-generate-pages';

export default defineConfig({
  plugins: [pluginReactGeneratePages(), pluginReact()],
});
