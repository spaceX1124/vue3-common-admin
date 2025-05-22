/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html', // 包括 index.html
    './src/**/*.{vue,js,ts,jsx,tsx}' // 包含 Vue 文件路径
  ],
  theme: {
    extend: {
      colors: {
        // 使用bg-accent就会生效,text-accent也会生效，必须有DEFAULT
        // bg-背景颜色，text-文字颜色
        // bg-accent:背景颜色取DEFAULT的值
        // text-accent:文字颜色取DEFAULT的值
        // hover:bg-accent：鼠标移入，背景颜色取DEFAULT的值，想取hover的值就得hover:bg-accent-hover
        accent: {
          DEFAULT: 'rgb(var(--text-color))', // 默认样式
          hover: 'rgb(var(--bg-background))', // hover:bg-accent-hover,鼠标移入背景颜色
          active: 'rgb(var(--primary))' // 激活的样式
        },
        // 主题色，如text-primary，文字颜色就是主题色
        primary: {
          DEFAULT: 'rgb(var(--primary))',
          hover: 'rgb(var(--primary))',
          active: 'rgb(var(--primary))'
        }
      }
    }
  },
  plugins: []
}
