import Vue from 'vue'
import util from '../common' //公共方法
import png404 from '../assets/img/blank.png'
// import $ from 'jquery'
Vue.directive("imgError", {
    bind: function(el, binding, vnode) {

        var default_value = util.isEmpty(binding.value) ? png404 : binding.value;
        var src_value = $(el).attr("src");

        if (util.isEmpty(src_value)) {
            $(el).attr("src", default_value);
        }
        $(el).on("error", function(e) {
            $(this).attr("src", default_value);
        })
    },
    update: function(el, binding, vnode) {

        var default_value = util.isEmpty(binding.value) ? png404 : binding.value;
        var src_value = $(el).attr("src");

        if (util.isEmpty(src_value)) {
            $(el).attr("src", default_value);
        }
        $(el).on("error", function(e) {
            $(this).attr("src", default_value);
        })
    }
})
