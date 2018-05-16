## shopbiz_v2.0.0
# 2017.11.4
# 异想拼太良商家管理后台

# 2018.03.13
# 异想拼太良商家管理后台积分模块上线

## 代码编写规范：
<pre>
├─1.编辑器统一设置：
│   tab = 2个空格
├─2.字符长度限制：
│   字符长度判断，文本框全部使用maxlength，不区分字符汉字
├─3.注释：
│   所有变量、变量定义必须添加注释(无论如何保证自己代码可阅读性），
│   所有方法定义使用多行注释，如:
│   /**
│    * 定义方式注释
│    */
</pre>

## 目录结构
``` bash
<pre>
│  index.html               # 首页
│  package.json             # 项目配置
│  README.md                # 项目说明
│  项目更新文档.txt            # 项目说明文档，每次更新上线都需要添加新的更新内容,便于其他人员了解项目版本更新情况
│
├─build                     # webpack配置文件
│
├─src
│  │  App.vue               # 主vue
│  │  main.js               # 启动配置，配置路由，过滤器
│  │  common.js             # 公共方法脚本
│  │  config.js             # 各种配置都在这里，包括服务器访问地址（data.js调用）、常用正则表达式、其他的一些常用配置项(common.js调用)
│  │
│  ├─api
│  │  ├─index.js            # 接口访问配置文件，请求拦截器也在这里
│  │  ├─
│  │
│  ├─assets                 # 静态文件
│  │  ├─less                # 所有模块化的公共样式
│  │  │  ├─index.less       # 主less文件，颜色定义、表单组件等
│  │  │  ├─common.less      # form，和table,间距，字体
│  │  │
│  │  └─img                 # 图片资源
│  │     ├─dev              # 开发使用图片，后期可删除
│  │     ├─icons            # 图标
│  │
│  ├─components             # 组件
│  │  ├─appheader.vue       # 头部公共组件
│  │  ├─navbarLeft.vue      # 左侧导航栏组件
│  │  ├─pager.vue           # 分页组件
│  │  ├─ addGoodsprops.vue  # 商品规格组件
│  │  ├─ Select.vue         # select组件
│  │  ├─ bankSelect.vue     # 银行select组件
│  │  ├─ checkbox.vue       # checkbox组件
│  │  ├─ Radio.vue          # radio组件
│  │  ├─ Date.vue           # 日期组件
│  │  ├─ Editor.vue         # 富文本组件
│  │  └─ imgStore.vue       # 图片库组件
│  │
│  ├─router                 # 路由配置文件夹
│  │  ├─index.js            # 主路由配置，汇总子路由文件
│  │  ├─good.js             # 商品管理模块
│  │  ├─enter.js            # 未入驻模块
│  │  ├─fund.js             # 资金管理模块
│  │  ├─order.js            # 订单管理模块
│  │  ├─setting.js          # 设置模块
│  │  ├─vip.js              # 会员管理模块
│  │  └─shop.js             # 店铺管理模块
│  │
│  ├─filter                 # 自定义过滤
│  │  ├─date.js             # 日期格式过滤器
│  │  ├─filter.js           #
│  │
│  └─views                  # 页面
│     ├─ 404                # 错误页面
│     ├─ login              # 登录
│     ├─ shop               # 商家管理
│     │  ├─ materialManage  # 图片库（商家后台首页）
│     │  └─ index           # 登录时验证页面（空白）
│     │
│     ├─ good               # 商品管理模块
│     │  ├─ goodEdit        # 商商品新增、编辑
│     │  ├─ goodManage      # 商品列表
│     │  ├─ goodDetial      # 商品详情
│     │  ├─ marketEdit      # 分销商品编辑
│     │  ├─ marketList      # 分销商品列表
│     │  └─ goodPublish     # 品类管理
│     │
│     ├─ delivery           # 配送模块
│     │  ├─ index           # 运费模板列表
│     │  └─ edit            # 运费模板编辑
│     │
│     ├─ enter              # 入驻模块
│     │  ├─ index           # 入驻主vue
│     │  ├─ MyStoreCreate   # 入驻编辑资料页面
│     │  └─ others...       # 入驻其他展示静态页面
│     │
│     │
│     ├─ fund               # 资金模块
│     │  ├─ index           # 资金概况
│     │  ├─ detial          # 收支明细
│     │  └─ check           # 对账单
│     │
│     ├─ order              # 订单模块
│     │  ├─ index           # 订单管理
│     │  ├─ detial          # 订单详情
│     │  ├─ estimateDetial  # 订单评价详情
│     │  ├─ set             # 订单设置
│     │  ├─ afterSale       # 维权订单列表
│     │  ├─ afterSaleDetial # 维权订单详情
│     │  └─ estimate        # 评价管理
│     │
│     ├─ setting            # 设置模块
│     │  └─index            # 设置主页
│     │
│     └─ vip                # 会员模块
│        ├─ finishOrder     # 单个会员完成的订单
│        └─ index           # 会员列表
│
├─test                     # 测试
│
└─static                   # 静态资源
   ├─css                   # 静态样式文件
   │  └─reset.css          # 基础样式
   ├─js                    # 所有静态脚本资源
   └─lib                   # 其他插件
</pre>

## 过滤器
<pre>
├─名称                                  语法                                                                                   参数说明
├─日期格式化                       this.$dateFormat(date, reg)         date:格式化后的日期 如：new Date(1137075575000) new Date(2006,0,12);
│                                                      reg:日期格式，如："yyyy年MM月dd日 hh:ss"
├─格式化2位小数点              {{1024|FloatTwo}}
</pre>

## 公共方法 —— src/api/common.js
<pre>
├─名称                                                        语法                                                          参数说明
├─isEmpty(value)           作用判断是否为空                                   字符串、对象、空值、未定义等均可
├─deepCopy(source)         深度克隆对象                                        对象
├─deepCopeArray(source)    深度克隆数组                                        数组
├─getUrlKey(name)          获取Url中指定的参数                         vue专用（vue中location.search已经不适用）
├─getCookie(name)          获取Cookie
├─validatePhone(phone)     验证手机号码格式
├─validatePwd(pwd)         验证密码格式
├─validateSmsCode(pwd)     验证短信验证码格式
├─extendsProp(source, key, params)             根据key值 合并数组中某个对象
├─layerOpen(options)       弹框插件，options为弹框初始化参数
├─layerMsg{}       tip提示：success， error, warning
</pre>

## 关键业务逻辑说明
<pre>
├─登录状态同步：
│
├─设置别名——build > webpack.base.conf.js：
│   'vue$': 'vue/dist/vue.esm.js',
│   '@': resolve('src'),
│   'view':resolve('src/views'),
│   'comp': resolve('src/components'),
│   'imgs':resolve('src/assets/img'),
│   'less':resolve('src/assets/less'),
│   'api':resolve('src/api')
├─导航选中状态保存：
│   导航选中状态通过获取当前页面路由控制，需要同时在组件实例创建完成(created)以及路由监听中监听当前路由
│   created: 获取当前页面路由（刷新的时候有效）
│   watch: 获取当前页面路由（切换路由有效）

</pre>

## Build Setup
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
