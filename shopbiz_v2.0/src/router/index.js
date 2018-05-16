/**
 * 主路由
 */
import Vue from 'vue'
import Router from 'vue-router'
import util from '../common'
import shop from './shop'
import good from './good'
import delivery from './delivery'
import fund from './fund'
import vip from './vip'
import setting from './setting'
import order from './order'
import enter from './enter'
import config from '../config'


const error = resolve => require(['view/404'], resolve)
    // const pcIndex = resolve => require(['view/pcIndex'], resolve)
Vue.use(Router)
    // 设置路由标题
var title = {
        error: '访问错误'
    }
    // 整合所有路由标题
// title = util.extendsProp(title, 'title', [shop, good, delivery, order, vip, setting, fund, enter]);
//
// 定义非模块类公共路由
var routes = [{
        // 错误页面
        path: '*',
        component: error,
        name: 'error'
    }, {
        // 测试页面
        path: '/test',
        name: 'HelloWorld'
    }]
    // 整合所有模块路由
routes = routes.concat(shop.router, good.router, delivery.router, order.router, vip.router, setting.router, fund.router, enter.router)
    // 设置路由
const router = new Router({
  mode: "history",
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition ;
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})
// const titleMethod = (title) => {
//         // 需要jQuery
//         let $body = $('body')
//         document.title = title
//             // hack在微信等webview中无法修改document.title的情况
//             // let $iframe = $('<iframe src='/favicon.ico'></iframe>')
//             // $iframe.on('load',function() {
//             //    setTimeout(function() {
//             //        $iframe.off('load').remove()
//             //    }, 0);
//             // }).appendTo($body)
//     }
//     /**
    //  * 判断登录状态
    //  * 登录状态拦截
    //  */

router.beforeEach((to, from, next) => {
    // 动态修改微信端的title（ios）

    if (to.meta.auth) {
        next();
    } else {
        let token = window.localStorage.getItem('token')
        if (token) {
            // titleMethod(title[to.name])
            // titleMethod('拼太良')
                // 获取路由信息—— to 和 from 都是 路由信息对象
            router.toUrl = to.path
            router.from = from.path
            next();
        } else {
            //如果判断没有token，跳转到登录页面
            window.location.href = config.loginPath
        }
    }
})
// router.afterEach((to,from) => {

// })

export default router
