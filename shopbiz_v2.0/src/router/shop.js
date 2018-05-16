/**
 * 商家管理
 */
const materialManage = resolve => require(['view/shop/materialManage'], resolve)
// const img = resolve => require(['@/components/imgStore'], resolve)
const addprops = resolve => require(['@/components/addGoodsprops'], resolve)
const Ueditor = resolve => require(['@/components/newEditor'], resolve)
const loading = resolve => require(['view/shop/index'], resolve)

const title = {
  materialManage: '素材管理',
  loading: '商家后台管理',
}

const router = [{
  path: '/',
  component: loading,
  meta:{auth: true},
  name: 'loading'
}, {
  path: '/shop',
  component: materialManage,
  name: 'materialManage'
},{
  path: '/addprops',
  component: addprops,
  name: 'addprops'
}
,{
  path: '/ueditor',
  component: Ueditor,
  name: 'Ueditor'
}
]

export default {
  router: router,
  title: title
}
