const DeliveryIndex = resolve => require(['view/delivery/index'], resolve)
const DeliveryEdit = resolve => require(['view/delivery/edit'], resolve)

const title = {
  delivery: '运费模板',
  deliveryEdit: '运费模板编辑'
}


const router = [
  {
    path: '/delivery',
    component: DeliveryIndex,
    name: 'delivery'
  },
  {
    path: '/deliveryEdit',
    component: DeliveryEdit,
    name: 'deliveryEdit'
  }
]

export default {
  router: router,
  title: title
}
