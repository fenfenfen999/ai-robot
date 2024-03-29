# Robot

A simple button component for React.

## Installation

```bash
npm install ai-robot --save
```

## Roleup
rollup: 这是Rollup打包工具的核心包，它允许你将JavaScript代码打包成一个文件，这对于创建库是非常有用的。

@rollup/plugin-node-resolve: 这个插件告诉Rollup如何查找外部模块。在Node.js环境中，它可以解析node_modules中的模块，这对于打包过程中包含第三方依赖是必要的。

@rollup/plugin-commonjs: 由于Rollup原生只支持ES模块，这个插件可以将CommonJS模块转换为ES6供Rollup使用。这对于包含那些仍然使用CommonJS模块系统的第三方依赖是必要的。

@rollup/plugin-babel: 这个插件允许你使用Babel来转换代码。Babel是一个JavaScript编译器，可以将ES6+代码转换为向后兼容的JavaScript版本。这对于使用了现代JavaScript特性或JSX的React组件是必要的。

@babel/core: Babel的核心功能包，它是Babel编译过程的主要部分。

@babel/preset-react: 这是一个Babel预设，用于将React的JSX转换为JavaScript代码。如果你的组件是用JSX编写的，这个预设是必要的。

### Rollup Err

rollup tsx 报错：RollupError: Expression expected (Note that you need plugins to import files that are not JavaScript)

安装并正确配置了处理 TypeScript 的 Rollup 插件; typeScript 和 @rollup/plugin-typescript。

ReferenceError: require is not defined

有commonjs或者

如果您的项目中使用了动态 import() 语法来异步加载模块，确保 Rollup 能够正确处理这些模式。您可能需要 @rollup/plugin-dynamic-import-vars 插件或其他相关插件来支持动态导入。

## NPM

### 本地link
可尽量使用npx

#### 安装 
npm包目录： npm link

引用包目录： npm link npm包的package.json的name

#### 删除
引用包目录：npm unlink toolbox

npm包目录：npm unlink

// 强制解除全局链接
npm rm --global packageName

// 查看所有全局链接
npm ls --global --depth 0

### 发布
npm login
npm publish