### 代码规范
1. 目录布局
   a. 文件名以短横线命名法 如：base-home-page
2. import规范
   a. 第一部分为组件
   b. 第二部分第三方库
   c. 第三部分本地方法
   d. 每个部分优先放type类型的导入
   e. 每个部分间隔一行

3. 组件采用帕斯卡命名法    如：MyComponent.vue
4. 页面以驼峰命名    如：myPage.vue
5. js/ts文件以驼峰命名   如：myTest.ts
6. jsx/tsx采用帕斯卡命名法    如：MyComponent.tsx
7. 样式文件采用短横线命名法  如：my-test.less
8. md文件采用短横线命名法  如：my-test.md
9. pinia命名规范
   a. 文件以驼峰命名   如：myTest.ts
   b. 变量以驼峰命名   如：myTest
10. 全局常量使用大写字母加下划线的命名方式 如：LOGIN_CODE
11. Vue 页面项顺序
    a. 导入语句（import）
    b. props
    c. emit
    d.按功能组织代码（将同一功能相关的 ref、computed、methods、watch 等集中写在一起，形成逻辑块）
    e. 生命周期钩子函数
12. 组件设计
    a. 先书写注释，申明该组件的意义和目的
    b. 每个组件应具有单一职责，专注于完成一个特定功能
    c. 明确 Props 的类型、是否必填及默认值
    d. 使用emits定义组件触发的事件，明确事件的参数类型['custom - event']；如：['success-click']
    i. emit定义类型defineEmits<{(e: 'custom - event', data: string): void;}>()
13. 路由规范
    a. path以驼峰命名  如：myBasePath
    b. name以帕斯卡命名法  如：MyBasePath  (确保路由名称的唯一性)
14. 代码注释
    a. 组件：文件开头，使用多行注释描述组件的功能
    b. 函数与方法注释： 使用多行注释描述函数的功能、参数、返回值等


@todo, 考虑一下怎么兼容pc和移动端，比如使用者在外面出差，但是要立刻修改内容

package一定是放到任何一个项目中都是可以用的才行


```
├── build # vite插件，配置
├── src
│    ├── adapter # 组件适配器，适配不同UI框架
│    ├── assets # 图片、图标存放处
│    ├── components # 业务组件
│    ├── config # designs 样式配置
│    ├── enums # 业务枚举配置
│    ├── packages # 通用应用包
│    ├── ├── designs # 样式设计
│    │   ├── layouts # 页面布局
│    │   ├── ui # UI 组件集合
│    │   │   ├── breadcrumb # 面包屑
│    │   │   ├── form # 表单
│    │   │   ├── hover-card # 鼠标悬停卡片展示
│    │   │   ├── menus # 菜单
│    │   │   ├── tabbar # 菜单tab导航
│    │   │   └── vxe-table # 表格，普通表格，虚拟表格
│    │   └── utils # 通用工具方法
│    ├── preferences # 偏好配置
│    ├── router # 路由
│    ├── stores # pinia状态管理
│    ├── types # 全局ts类型
│    └── views # 页面
└──vite.config.ts # vite 配置
```
