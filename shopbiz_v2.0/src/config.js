/**
 * 项目配置文件
 * author:cch1040
 * 2017.11.3
 */
var env = "dev"; //环境名称变量
var config = {
  local: {
    domain: "localhost:8887", //本地环境，服务器地址需要在host配置
    server: "http://192.168.74.110:9202",
    login: 'http://localhost:8888/login',
    h5Url: 'http://sit.m-mall-b2b.1332255.com',
    webUrl: 'http://localhost:8888',
    upLoad: 'http://img.1332255.com'
  },
  dev: { //开发环境
    domain: "dev.mall-biz-b2b.1332255.com", // 域名
    server: "http://192.168.74.110:9202", // 服务器地址
    login: 'http://dev.mall-b2b.1332255.com/login',
    h5Url: 'http://dev.m-mall-b2b.1332255.com',
    webUrl: 'http://dev.mall-b2b.1332255.com',
    upLoad: 'http://img.1332255.com'

  },
  sit: { // 测试环境
    domain: "sit.mall-biz-b2b.1332255.com",
    server: "http://sit.mall-biz-b2b.1332255.com/mall-biz-b2b-api",
    login: 'http://sit.mall-b2b.1332255.com/login',
    h5Url: 'http://sit.m-mall-b2b.1332255.com',
    webUrl: 'http://sit.mall-b2b.1332255.com',
    upLoad: 'http://img.1332255.com'
  },
  pre: { //预发布环境
    domain: "mall-biz-b2b.yxlsg.com",
    server: "http://mall-biz-b2b.yxlsg.com/mall-b2b-api",
    login: 'http://mall-b2b.yxlsg.com/login',
    h5Url: 'http://m-mall-b2b.yxlsg.com',
    webUrl: 'http://mall-b2b.yxlsg.com',
    upLoad: 'http://pre.img.yxlsg.com'
  },
  uat: { //对外环境
    domain: "uat.mall-biz.1332255.com",
    server: "http://uat.mall-biz-b2b.1332255.com/mall-biz-b2b-api",
    login: 'http://uat.mall-b2b.1332255.com/login',
    h5Url: 'http://uat.m-mall-b2b.1332255.com',
    webUrl: 'http://uat.mall-b2b.1332255.com',
    upLoad: 'http://pre.img.yxlsg.com'
  },
  prod: { //生产环境
    domain: "shop.ptlmall.com",
    server: "http://shop.ptlmall.com/mall-b2b-api",
    login: 'http://www.ptlmall.com/login',
    h5Url: 'http://m.ptlmall.com',
    webUrl: 'http://www.ptlmall.com',
    upLoad: 'http://img.yxlsg.com'
  }
}

//根据域名判断环境
var hostname = location.host;
for (var i in config) {
  if (config[i].domain == hostname) {
   env = i;
    break;
  } else {
    continue;
  }
}

////其他默认配置
//var defaultConfig = {
//
//};

export default {
  cokieDomain: config[env].domain,
  loginPath: config[env].login,
  domain: config[env].domain,
  serverPath: {
    server: config[env].server,
    jsessionid: function () {
      return (sessionStorage.getItem("JSESSIONID") ? ';jsessionid=' + sessionStorage.getItem("JSESSIONID") : '');
    }
  },
  h5Url: config[env].h5Url,
  webUrl: config[env].webUrl,
  upLoad: config[env].upLoad
};
