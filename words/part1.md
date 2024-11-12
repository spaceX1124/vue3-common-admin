### 1.初始化项目
    +pnpm create vite
    生成了一个很干净的项目，只有vue和vite库

### 2.如何集成eslint
    + pnpm i eslint@8.57.0 -D
    + pnpm i eslint-plugin-vue@9.23.0 -D
    + pnpm i @rushstack/eslint-patch@1.8.0 -D
    + pnpm i @vue/eslint-config-typescript@13.0.0 -D
    要安装对应的版本，我一开始直接没有声明版本，导致eslint失效，报错
    然后根路径添加.eslintrc.cjs文件，里面的配置请看该文件

### 3.使用mock
    + pnpm i vite-plugin-mock -D
    + 在vite插件中配置，参见/build/plugins/index.ts
    + 根目录下创建mock文件夹,详细可看mock文件夹
    + 然后就可以使用自己封装的axios，跟正常请求后端接口一样
    + 参考链接 https://www.viterc.cn/en/vite-plugin-mock.html

### 4.process.cwd()
    + 获取当前工作目录, 如E:\web\vue3-admin
    + pnpm i @types/node -D
    + 解决使用process这个node的api时ts类型报错
    + import { fileURLToPath, URL } from 'node:url'解决node:url报错

### 5.tsconfig.json配置
    +按照目前我的配置可以解决大部分ts爆红问题

### 6.注释规范
    + 函数用/***/
    + 变量，接口用 //

### 7.解决 import { resolve } from 'path'，等跟node相关api
    + pnpm i @types/node -D