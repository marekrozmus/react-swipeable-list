import path from 'path';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import autoprefixer from 'autoprefixer';
import localResolve from 'rollup-plugin-local-resolve';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';

import pkg from './package.json';

const config = {
  input: 'src/index.js',
  output: [
    {
      file: pkg.browser,
      format: 'umd',
      name: pkg.name,
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'prop-types': 'PropTypes'
      }
    },
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  external: ['react', 'react-dom', 'prop-types'],
  plugins: [
    peerDepsExternal(),
    postcss({
      plugins: [autoprefixer],
      extract: path.resolve('dist/styles.css')
    }),
    babel({ exclude: 'node_modules/**' }),
    localResolve(),
    resolve(),
    commonjs(),
    copy({
      targets: [{ src: 'src/module.d.ts', dest: 'dist' }]
    })
  ]
};

export default config;
