import configPath from "../config"
import axios from "axios"

//axios配置
axios.defaults.baseURL = configPath.serverPath.server;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 30000; //默认6s超时
// axios.defaults.headers.Authorization = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MSIsImF1ZGllbmNlIjoid2ViIiwiY3JlYXRlZCI6MTUxMTg1NTYxNTY0MywiZXhwIjoxNTE0NDQ3NjE1fQ.G83mn0ru6R3HAptC_4gkctEFk8QlWkRH08LmFzhnwYNvTVylB_5FTmTYEKSwRjYQfQowbbdJu0CamFTIN2Hl3Q"

//导入其他接口
//import good from "./good"

//request拦截器
axios.interceptors.request.use(
  config => {
    let token = ''
    token = localStorage.getItem("token")
    if (token != null && token != undefined && token != "undefined") {
      config.headers.Authorization = token;
    }
    return config
  }, error => {
    window.location.href = configPath.loginPath
    Promise.reject(error);
  }
)

// response拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  switch (response.status) {
    case 200:
      switch (response.data.statusCode) {
        case '200' :
          break
        case '400' :
          window.layer.msg(response.data.statusMessage, {icon: 2})
          break
        case '401' :
          let URL = response.config.url
          if ( URL.indexOf('/api/shop/latest-audit-info') === -1 && URL.indexOf('/api/shop/settle-agreement') === -1 && URL.indexOf('/api/system/mall/sale-supplier-goods/get-enabled-flag') === -1 && URL.indexOf('api/pay-type/pay-classify') === -1) {
            window.layer.msg('未授权的用户', {icon: 2})
            window.location.href = configPath.loginPath
          }
          break
        case '403' :
          window.layer.msg('未登录', {icon: 2})
          window.location.href = configPath.loginPath
          break
        case '500' :
          window.layer.msg('服务器异常', {icon: 2})
          break
      }
      return response.data
    case 500 :
      this.$utils.layerMsg('服务器异常')
  }
}, function (error) {
  Promise.reject(error)
})

export default {
  /**
   *  POST 请求
   * @param {String} url
   * @param {String} paramtype //data,params
   * @param {Object} data
   */
  async post (url, paramtype, data) {
    try {
      const res = await axios({
        method: 'post',
        url,
        [paramtype]: data,
      })
      return res
    } catch (error) {
      console.log(error)
    }

  },
  /**
   * GET 请求
   * @param {String} url
   * @param {Object} params
   */
  async get(url, params) {
    const res = await axios({
      method: 'get',
      url,
      params, // get 请求时带的参数
    })
    return res

  },

  /**
   * export 导出列表
   * @param {String} url
   * @param {Object} params
   */
  async export(url, params) {
    const res = await axios({
      method: 'post',
      responseType: 'blob',
      url,
      params, // get 请求时带的参数
    })
    return res
  }
}
