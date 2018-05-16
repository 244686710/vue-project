const OrderIndex = resolve => require(['view/order/index'], resolve)
const OrderSet = resolve => require(['view/order/set'], resolve)
const OrderEstimate = resolve => require(['view/order/estimate'], resolve)
const OrderDetial = resolve => require(['view/order/detial'], resolve)
const OrderEstimateDetial = resolve => require(['view/order/estimateDetial'], resolve)
const AfterSale = resolve => require(['view/order/afterSale'], resolve)
const AfterSaleDetial = resolve => require(['view/order/afterSaleDetial'], resolve)

const title = {
  order: '全部订单',
  orderSet: '订单设置',
  orderEstimate: '订单评价',
  orderDetial: '订单详情',
  orderEstimateDetial: '评价详情'
}

const router = [
  {
    path: '/order',
    component: OrderIndex,
    name: 'order'
  },

  {
    path: '/orderEstimate',
    component: OrderEstimate,
    name: 'orderEstimate'
  },
  {
    path: '/orderDetial',
    component: OrderDetial,
    name: 'orderDetial'

  },
  {
    path: '/orderEstimateDetial',
    component: OrderEstimateDetial,
    name: 'orderEstimateDetial'
  },
  {
    path: '/orderSet',
    component: OrderSet,
    name: 'orderSet'
  }, {
    path: '/afterSale',
    component: AfterSale,
    name: 'afterSale'
  }, {
    path: '/afterSaleDetial',
    component: AfterSaleDetial,
    name: 'afterSaleDetial'
  }
]

export default {
  router: router,
  title: title
}
