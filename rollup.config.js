import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';

export default {
  sourcemap: true,
  input: 'src/app.tsx',
  output: {
    file: 'dist/app.js'
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json' // 指向你的tsconfig文件
    }),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react']
    })
  ],
  external: ['react', 'react-dom']
};