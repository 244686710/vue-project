/**
 * 过滤器
 */
import Vue from "vue";

/**
 * 格式化2位小数点
 */
Vue.filter("FloatTwo", function(value) {
    var result = parseFloat(isNaN(value) ? 0 : value).toFixed(2);
    return result;
});

/**
 * 格式化货币：￥10,000,000.00
 * Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {......}
 */
Vue.filter("currency", function(value) {
	var places=2, symbol="￥", thousand=",", decimal="."
	places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = value,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
});

/**
 * 截取字符串长度
 */
Vue.filter('strLenght', (value, length) => {
  let res = '';
  if(value.length>length){
    res = value.substring(0, length)+ '...'
  }else{
    res = value
  }
  return res;
})
/**
 * 字典 ： 商品类型 0,1
 */
Vue.filter('goodsType', (value) => {
  let res = '';
  switch (value) {
    case 1 :
    res = '实物商品'
    break;
    case 2 :
    res = '虚拟商品'
    break;
    case 3 :
    res = '分销商品'
    break;
    default :
    res = '--'
  }

  return res;
})
Vue.filter('refundStatus', (value) => {
  let res = '';
  if(value) {
    value = parseInt(value)
  }
  switch (value) {
    case 1 :
    res = '退货中'
    break;
    case 2 :
    res = '退货成功'
    break;
    case 3 :
    res = '退货关闭'
    break;
    default :
    res = '--'
  }

  return res;
})
/**
 * 字典 ： 商品类型 0,1
 */
Vue.filter('orderType', (value) => {
  let res = '';
  value = Number(value)
  switch (value) {
    case 0 :
    res = '全部'
    break;
    case 1 :
    res = '待付款'
    break;
    case 2 :
    res = '待发货'
    break;
    case 3:
    res = '待收货'
    break;
    case 4 :
    res = '已完成'
    break;
    case 5 :
    res = '交易关闭'
    break;
    case 9 :
    res = '待审核'
    break;
    case 10 :
    res = '待核验'
    break;

    default :
    res = '--'
  }

  return res;
})
Vue.filter('sendType', (value) => {
  let res = '';
  value = Number(value)
  switch (value) {
    case 0 :
    res = '全部'
    break;
    case 1 :
    res = '普通快递'
    break;
    case 2 :
    res = '虚拟发货'
    break;
    default :
    res = '--'
  }

  return res;
})
Vue.filter('supplierType', (value) => {
  let res = '';
  value = Number(value)
  switch (value) {
    case 0 :
    res = '全部'
    break;
    case 1 :
    res = '普通订单'
    break;
    case 2 :
    res = '分销订单'
    break;
    default :
    res = '--'
  }

  return res;
})
Vue.filter('payType', (value) => {
  let res = '';
  value = Number(value)
  switch (value) {
    case 1 :
    res = '微信'
    break;
    case 2 :
    res = '支付宝'
    break;
    case 3 :
    res = '京东快捷支付'
    break;
    case 4 :
    res = '积分支付'
    break;
    case 5 :
    res = 'VIP免支付'
    break;
    default :
    res = '--'
  }

  return res;
})


