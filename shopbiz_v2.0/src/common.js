/**
 * 方法名	/变量名				作用					适用对象
 * isEmpty(value)			作用判断是否为空		字符串、对象、空值、未定义等均可
 * deepCopy(source)			深度克隆对象			对象
 * deepCopeArray(source)	深度克隆数组			数组
 * getUrlKey(name)			获取Url中指定的参数		vue专用（vue中location.search已经不适用）
 * getCookie(name)			获取Cookie
 * validatePhone(phone)		验证手机号码格式
 * validatePwd(pwd)			验证密码格式
 * validateSmsCode(pwd)		验证短信验证码格式
 * extendsProp(source, key, params)             根据key值 合并数组中某个对象
 * goodPriceValidate(price) 商品价格设置验证    1. price<= 0.01 => price=0.01 2. price>0.01 => 保留2位有效数字
 */

// 验证用的正则表达式
var regList = {
    ImgCode: /^[0-9a-zA-Z]{4}$/,        //图片验证码验证
    SmsCode: /^\d{6}$/,                 //短信验证码验证
    UserName: /^[\w|\d]{4,16}$/,        //用户名验证
    Password: /^[\w!@#$%^&*.]{6,16}$/,  //密码验证
    Mobile: /^1[0-9]{10}$/,             //手机号码验证
    RealName: /^[\u4e00-\u9fa5 ]{2,10}$/,//真实姓名验证
    BankNum: /^\d{10,19}$/,             //银行卡号验证
    Mail: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/     //邮箱验证
};
//常用配置
var commonConfig = {
    smsSeconds: 60, //发送验证码间隔时间
    loginValidTime:24*60*60*1000//登录有效时间
};
/**
 * add by czx
 * 根据key值 合并数组中某个对象
 * @key  string
 * @params Array
 */
function extendsProp(source, key, params) {
    params.map(function(e, i) {
        source = $.extend(source, e[key])
    })
    return source;
}
/**
 * 判断是否为空
 * @param {Object} | string
 * @returns true|false
 */
function isEmpty(value) {
    if (
        value == "" ||
        value == null ||
        value == "null" ||
        value == undefined ||
        JSON.stringify(value) == "{}"
    ) {
        return true;
    }
    return false;
}

/**
 * 深度克隆对象
 * @param source
 * @returns Object
 */
function deepCopy(source) {
    var result = {};
    for (var key in source) {
        result[key] =
            typeof source[key] === "object" ? deepCopy(source[key]) : source[key];
    }
    return result;
}
/**
 * 深度克隆数组
 * @param arr
 * @returns Object
 */
function deepCopeArray(arr) {
    var out = [],
        i = 0,
        len = arr.length;
    for (; i < len; i++) {
        if (arr[i] instanceof Array) {
            arr[i] = deepCopeArray(arr[i]);
        } else out[i] = arr[i];
    }
    return out;
}

/**
 * 获取Url中指定的参数
 * @param name
 * @returns string
 */
function getUrlKey(name) {
    return (
        (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            location.href
        ) || [, ""])[1]
        .replace(/\+/g, "%20") || null
    );
}

/**
 * 获取Cookie
 * @param name
 * @returns
 */
function getCookie(name) {
    var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

/**
 * 验证手机号码
 */
function validatePhone(phone) {
    var pattern = regList.Mobile;
    return pattern.test(phone);
}

/**
 * 判断是否为空
 * @param {Object} | string
 * @returns true|false
 */
function isEmpty(value) {
  if (
      value == "" ||
      value == null ||
      value == "null" ||
      value == undefined ||
      JSON.stringify(value) == "{}"
  ) {
      return true;
  }
  return false;
}

/**
 * 验证手机验证码
 * @param phone
 * @returns
 */
function validateSmsCode(smscode) {
    var pattern = regList.SmsCode;
    return pattern.test(smscode);
}

/**
 * 验证密码格式有效性
 * @param pwd
 * @returns
 */
function validatePwd(pwd) {
    var pattern = regList.Password;
    return pattern.test(pwd);
}

/**
 * 商品价格设置验证及转换
 */
function goodPriceValidate(price){

}

/**
 * 弹框函数
 * @param {*obj} options
 */
const layerOpen = (options) => {
  let index = layer.open({
    title:options.title,
    type: 1,
    closeBtn: options.closeBtn, //0不显示关闭按钮
    move: false,//禁止拖动
    area: [options.width, options.height], // 弹窗尺寸
    cancel:options.cancel, // 关闭弹窗回调
    yes: options.yes, // 确认按钮回调
    end: options.end, // 销毁弹窗时回调
    btn: options.btn,
    shadeClose: options.shadeClose || true, //开启遮罩关闭
    content: options.content
  });
  return index;
}

/**
 * 提示信息
 * @param {*string} msg
 */
const layerMsg = {
    warning (msg) { return layer.msg(msg, {icon: 0, time: 2000})},
    success (msg) { return layer.msg(msg, {icon: 1, time: 2000})},
    error (msg) { return layer.msg(msg, {icon: 2, time: 2000})}
}

export default {
    isEmpty: isEmpty, //是否为空（对象、字符串）
    cloneObj: deepCopy, //深度克隆
    cloneArray: deepCopeArray, //深度克隆
    getUrlKey: getUrlKey, //获取链接中的参数
    getCookie: getCookie, //获取cookie
    validatePhone: validatePhone, //验证手机号码
    validateSmsCode: validateSmsCode, //验证手机验证码
    validatePwd: validatePwd, //验证密码有效性
    extendsProp: extendsProp,
    regList:regList,//验证用的正则表达式
    config:commonConfig, //公共配置项
    layerOpen: layerOpen,
    goodPriceValidate:goodPriceValidate,    //商品价格设置及重置
    layerMsg
};
