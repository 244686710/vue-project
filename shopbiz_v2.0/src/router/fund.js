const FundIndex = resolve => require(['view/fund/index'], resolve)
const FundDetial = resolve => require(['view/fund/detial'], resolve)
const FundCheck = resolve => require(['view/fund/check'], resolve)

const title = {
  fund: '资金概况',
  fundDetial: '收支明细',
  fundCheck: '对账单'
}

const router = [
  {
    path: '/fund',
    component: FundIndex,
    name: 'fund'
  },
  {
    path: '/fundDetial',
    component: FundDetial,
    name: 'fundDetial'
  },
  {
    path: '/fundCheck',
    component: FundCheck,
    name: 'fundCheck'
  }
]

export default {
  router: router,
  title: title
}
