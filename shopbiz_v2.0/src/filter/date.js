/**
 * 日期格式过滤器
 * 引入方式：main.js中以模块方式引入本脚本，然后注册为全局方法 
 * 参数1:date 日期格式化后的日期 如：new Date(1137075575000) new Date(2006,0,12); 
 * 参数2:reg 日期格式，如："yyyy年MM月dd日 hh:ss"
 * 使用方法:this.$dateFormat(date, reg) {{$format(date,"yyyy年MM月dd日 hh:ss")}}
 */
export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
  if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}
function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}
