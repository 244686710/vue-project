<template>
  <div id="app">
    <div id="content">
      <appheader v-show="isShopkeeper" :user="user"></appheader>
      <navbarLeft v-show="isShopkeeper" :isFlag="isFlag"></navbarLeft>

        <keep-alive include="goodsManage,MarketList,OrderIndex,VipIndex,AfterSaleList,EstimateList,FundIndex,FundDetial,FundCheck">
          <router-view  :class="{content: isShopkeeper}" :payClassify= "payClassify"/>
        </keep-alive>

    </div>
  </div>
</template>

<script>
import api from "./api/api";
import fetchJson from "./api/http";
import bus from './assets/bus'
import config from "./config.js";
export default {
  name: "app",
  data () {
    return {
      isShopkeeper: false, // 是否店家 true=>是 false=>否
      haveStore: true,
      isFlag: 0,
      payClassify: 1,
      user: {
        userName: "",
        userPic: ""
      }
    };
  },
  created () {
    try {
      if (window.opener.title == undefined) {
        sessionStorage.removeItem("isFirst");
        console.log("Window was refreshed!");
      }
    } catch (err) {
      sessionStorage.removeItem("isFirst");
      console.log("Window was closed!");
    }

  },
  watch: {
    async $route(now, old) {
      let that = this;
      if (now.name == "loading") {
        let token = now.query.token;

        if (token) {
          localStorage.setItem("token", token);
          const res = await fetchJson.post(api.getUserMsg, "params", {});
          if (res.statusCode == 200) {
            localStorage.setItem(
              "userMsg",
              JSON.stringify(res.responseContent)
            );
            this.user.userName = res.responseContent.mobile;
            this.user.userPic = res.responseContent.logoUrl;
            this.user = Object.assign({}, this.user);
            that.isShopkeeper = res.responseContent.isShopkeeper;
            if (that.isShopkeeper) {
              that.$router.push({
                name: "materialManage"
              });
              that.isShopkeeper = true;
            } else {
              that.$router.push({
                name: "enter"
              });
              that.isShopkeeper = false;
            }
          }
          this.getMarketFlag();
        } else {
          window.location.href = config.webUrl;
        }
      } else if (now.name.indexOf("enter") !== -1) {
        that.isShopkeeper = false;
      } else {
        that.isShopkeeper = true;
      }
    }
  },

  mounted () {
    this.getMarketFlag()
    this.getPayClassify()
  },
  methods: {
    // 获取是否开启分销
    async getMarketFlag () {
      const res = await fetchJson.post('/api/system/mall/sale-supplier-goods/get-enabled-flag', 'params',{})
      if(res.statusCode === '200') {
        this.isFlag = res.responseContent.flag;
        bus.$emit('marketFlag', this.isFlag) // 分销状态是否开启
      }
    },
    // 获取支付方式分类
    async getPayClassify () {
      const res = await fetchJson.post('api/pay-type/pay-classify', 'params', {})
      if(res.statusCode === '200') {
        //1=>仅现金 2=>仅积分 3=>积分&现金
        this.payClassify = res.responseContent.payClassify
      }
    }

  }
};
</script>

<style lang="less">
@import url("../static/lib/layui/css/layui.css");
@import url("assets/less/index.less");
@import url('assets/less/common.less');
body {
  background: @color-bg;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: @color-3;
  min-width: 1366px;
  overflow-x: hidden;
  // height: 100%;  设置高度后会影响路由切换时页面滚动
}
</style>
