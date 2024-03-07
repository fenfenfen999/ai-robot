import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
//如果你正在开发一个复杂的应用程序，并需要更多的开发服务器功能（如热模块替换、API代理等），你可能需要使用更强大的开发服务器，
// 比如 webpack-dev-server 或者 Vite。在这种情况下，Rollup 可能不是最佳选择，因为它主要专注于打包而不是提供完整的开发服务器功能。
import serve from 'rollup-plugin-serve';

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
    }),
    serve({
      open: true, // 在服务器启动时自动在浏览器中打开应用
      contentBase: ['public', 'dist'], // 设置服务的根目录
      host: 'localhost',
      port: 10001
    })
  ],
  external: ['react', 'react-dom']
};