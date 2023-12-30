import path from 'node:path';
import fs from 'node:fs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

const BUNDLE_NAME = 'umengine';

const rollupPackageJson = () => {
  const srcPath = path.join('package.json');
  const packageJson = JSON.parse(fs.readFileSync(srcPath, 'utf-8'));

  packageJson.main = `./${BUNDLE_NAME}.bundle.js`;
  packageJson.types = './index.d.ts';

  const distPath = path.join('dist', 'package.json');
  fs.writeFileSync(distPath, JSON.stringify(packageJson, null, 2));
};

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/${BUNDLE_NAME}.js`,
      format: 'es',
    },
    {
      file: `dist/${BUNDLE_NAME}.min.js`,
      format: 'es',
      plugins: [terser()],
    },
  ],
  plugins: [
    typescript(),
    copy({
      targets: [
        { src: ['README.md'], dest: 'dist/' },
        { src: ['src/config/*.json'], dest: 'dist/config/' },
        { src: ['src/types/*.d.ts'], dest: 'dist/types/' },
      ],
    }),
    {
      name: 'update-package.json',
      writeBundle() {
        rollupPackageJson();
      },
    },
  ],
};
