import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';

function updatePackageJson(contents) {
  const packageJson = JSON.parse(contents);
  packageJson.main = './index.js';
  packageJson.types = './index.d.ts';
  return JSON.stringify(packageJson, null, 2);
}

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    preserveModules: true,
  },
  plugins: [
    typescript(),
    copy({
      targets: [
        { src: 'src/types/**/*', dest: 'dist/types/' },
        { src: 'src/config/*.json', dest: 'dist/config/' },
        { src: 'README.md', dest: 'dist/' },
        { src: 'package.json', dest: 'dist/', transform: (contents) => updatePackageJson(contents) },
      ],
    }),
    json(),
  ],
};
