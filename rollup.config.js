import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'es',
    },
    {
      file: 'dist/bundle.min.js',
      format: 'es',
      plugins: [terser()],
    },
  ],
  plugins: [
    typescript(),
    copy({
      targets: [
        { src: 'src/global.d.ts', dest: 'dist/types/' },
        { src: 'src/**/*.json', dest: 'dist/' },
      ],
    }),
  ],
};
