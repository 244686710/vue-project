const enter = resolve => require(['view/enter/index'], resolve)
const index = resolve => require(['view/enter/MyStoreIndex'], resolve)
const Step = resolve => require(['view/enter/MyStoreStep'], resolve)
const Info = resolve => require(['view/enter/MyStoreInfo'], resolve)
const Question = resolve => require(['view/enter/MyStoreQuestion'], resolve)
const Create = resolve => require(['view/enter/MyStoreCreate'], resolve)

const title = {
    enterIndex: '未入住',
    enterStep: '入驻流程',
    enterInfo: '招商说明',
    enterQuestion: '常见问题',
    enterCreate: '创建店铺'
}
const router = [{
    path: '/enter',
    component: enter,
    name: 'enter',
    meta: { noheader: true, noLeftnav: true },
    redirect: {
        name: 'enterIndex'
    },
    meta: {
        noNeedLogin: true
    },
    children: [{
            path: '/index',
            name: 'enterIndex',
            component: index
        },
        {
            path: '/step',
            name: 'enterStep',
            component: Step
        },
        {
            path: '/info',
            name: 'enterInfo',
            component: Info
        },
        {
            path: '/question',
            name: 'enterQuestion',
            component: Question
        },
        {
            path: '/create',
            name: 'enterCreate',
            component: Create,
            meta: { noHeader: true },
        }
    ]
}]

export default {
    router: router,
    title: title
}