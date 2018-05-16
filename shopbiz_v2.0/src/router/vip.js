const VipIndex = resolve => require(['view/vip/index'], resolve)
const FinishOrder = resolve => require(['view/vip/finishOrder'], resolve)

const title = {
  vip: '会员管理'
}

const router = [
  {
    path: '/vip',
    component: VipIndex,
    name: 'setting'
  },
  {
    path: '/finishOrder',
    component: FinishOrder,
    name: 'finishOrder'
  }
]

export default {
  router: router,
  title: title
}
