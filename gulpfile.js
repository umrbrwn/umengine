import fs from 'node:fs';
import path from 'node:path';
import gulp from 'gulp';
import ts from 'gulp-typescript';
import * as rimraf from 'rimraf';

const tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', (done) => rimraf.rimraf('./dist').then(() => done()));

gulp.task('compile-ts', () => tsProject.src().pipe(tsProject()).pipe(gulp.dest('dist')));

gulp.task('copy-types', () => gulp.src('./src/types/**/*').pipe(gulp.dest('./dist/types/')));

gulp.task('copy-config-files', () => gulp.src('./src/config/*.json').pipe(gulp.dest('./dist/config/')));

gulp.task('provide-package-json', (done) => {
  const srcPath = path.join('package.json');
  const packageJson = JSON.parse(fs.readFileSync(srcPath, 'utf-8'));

  packageJson.main = './index.js';
  packageJson.types = './index.d.ts';

  const distPath = path.join('dist', 'package.json');
  fs.writeFileSync(distPath, JSON.stringify(packageJson, null, 2));

  done();
});

gulp.task('copy-docs', () => gulp.src('README.md').pipe(gulp.dest('dist')));

gulp.task(
  'build',
  gulp.series('clean', 'compile-ts', 'copy-types', 'copy-config-files', 'provide-package-json', 'copy-docs'),
);

gulp.task('watch', () => {
  gulp.watch('./src/types/**/*', gulp.series('copy-types'));
  gulp.watch('./src/config/*.json', gulp.series('copy-config-files'));
  gulp.watch('package.json', gulp.series('provide-package-json'));
  gulp.watch('README.md', gulp.series('copy-docs'));
  gulp.watch('./src/**/*.ts', gulp.series('compile-ts'));
});

gulp.task('dev', gulp.series('build', 'watch'));
