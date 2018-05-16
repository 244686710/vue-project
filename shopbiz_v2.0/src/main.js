// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import "babel-polyfill";
import './directive'

Vue.config.productionTip = false

layui.use('layer')
/***注册全局方法****/
//引入模块
import {formatDate} from './filter/date'//日期过滤器
import filter from "./filter/index"; //全局过滤器
import util from "./common.js"
//注册全局方法
Vue.prototype.$dateFormat = function(date, reg) {
    //时间格式化 yyyy-MM-dd hh:mm:ss
    return formatDate(date, reg);
};
//Vue.prototype.$filter = filter  //全局过滤器
Vue.prototype.$utils=util;

Vue.directive('onlyNumber', {
  twoWay: true,
  update: function (result) {
    this.handler = function () {
      var value = this.el.value.replace(/[^0-9]/g,'');
      this.el.value = value;
      this.set(parseFloat(value));
    }.bind(this)
    this.el.addEventListener('input', this.handler);
  }
});

//导入全局组件
import appheader from "comp/appheader"
import navbarLeft from "comp/navbarLeft"
import pager from 'comp/pager'
import MyEditor from 'comp/Ueditor'
Vue.component(appheader.name, appheader)
Vue.component(navbarLeft.name, navbarLeft)
Vue.component(pager.name, pager)
Vue.component(MyEditor.name, MyEditor)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
