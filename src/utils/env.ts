/**
 * 获取当前构建模式
 * 本地开发代码运行的是development
 * 打包production，test，dev，self, pressure根据打不同的包展示
 * */
export function getEnvMode (): string {
  return import.meta.env.MODE
}

/**
 * 开发环境
 * */
export function isDev (): boolean {
  return import.meta.env.ENV
}

/**
 * 生产环境
 * */
export function isProd (): boolean {
  return import.meta.env.PROD
}
