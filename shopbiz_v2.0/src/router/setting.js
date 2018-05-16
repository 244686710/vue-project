const SettingIndex = resolve => require(['view/setting/index'], resolve)

const title = {
  setting: '店铺资料'
}

const router = [
  {
    path: '/setting',
    component: SettingIndex,
    name: 'setting'
  }
]

export default {
  router: router,
  title: title
}
