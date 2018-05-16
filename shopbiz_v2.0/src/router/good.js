/**
 * 商品管理
 */
const goodManage = resolve => require(['view/good/goodManage'], resolve)
const goodPublish = resolve => require(['view/good/goodPublish'], resolve)
const goodEdit = resolve => require(['view/good/goodEdit'], resolve)
const marketList = resolve => require(['view/good/marketList'], resolve)
const marketEdit = resolve => require(['view/good/marketEdit'], resolve)
const goodsDetial = resolve => require(['view/good/goodsDetial'], resolve)
const BindClass = resolve => require(['view/good/bindClass'], resolve)
const title = {
  goodsManage: '全部商品',
  goodPublish: '品类管理',
  goodEdit: '发布商品'
}

const router = [
  {
    path: '/good',
    component: goodManage,
    name: 'goodManage'
  },
  {
    path: '/goodManage',
    component: goodManage,
    name: 'goodsManage'
  }, {
    path: '/goodPublish',
    component: goodPublish,
    name: 'goodPublish'
  }, {
    path: '/goodEdit',
    component: goodEdit,
    name: 'goodEdit'
  },{
    path: '/goodAdd',
    component: goodEdit,
    name: 'goodAdd'
  }, {
    path: '/marketList',
    component: marketList,
    name: 'marketList',
    mate: {market: true}

  }, {
    path: '/marketEdit',
    component: marketEdit,
    name: 'marketEdit'
  }, {
    path: '/goodsDetial',
    component: goodsDetial,
    name: 'goodsDetial'
  }, {
    path: '/bindClass',
    component: BindClass,
    name: 'bindClass'
  }
]

export default {
  router: router,
  title: title
}
