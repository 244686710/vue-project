<template>
  <div class="index">
    <div class="banner">
      <div class="container">
        <h3>
          <span>拼太良商城平台</span>
        </h3>
        <p class="banner-info">助力商家快速在线开店销售商品</p>
        <a class="btn btn-jion" @click="toCreateStore()">立即入驻</a>
      </div>
    </div>
    <div class="panel panel-1">
      <h4 class="panel-title">
        <span>入驻流程</span>
      </h4>
      <ul class="container overflow panel-content">
        <li class="fl">
          <div>
            <h4 class="f-18 item-title">
              <i class="icon-enter-small-star inline-block fl"></i>
              <span>提交入驻资料</span>
            </h4>
            <ul class="item-content">
              <li>
                <i class="fl inline_block icon-enter-samll-arrow"></i>选择店铺主营类目</li>
              <li>
                <i class="fl inline_block icon-enter-samll-arrow"></i>店铺命名</li>
              <li>
                <i class="fl inline_block icon-enter-samll-arrow"></i>填写个人/企业认证信息</li>
              <li>
                <i class="fl inline_block icon-enter-samll-arrow"></i>提交审核</li>
            </ul>
          </div>
        </li>
        <li class="fl padding_left90">
          <div>
            <h4 class="f-18 item-title">
              <i class="fl icon-enter-small-note"></i>商家等待审核</h4>
            <ul class="item-content">
              <li>
                <i class="fl icon-enter-samll-arrow"></i>个人店铺资质审核</li>
              <li>
                <i class="fl icon-enter-samll-arrow"></i>企业店铺资质审核</li>
              <li>
                <i class="fl icon-enter-samll-arrow"></i>审核周期1-3个工作日</li>
            </ul>
          </div>
        </li>
        <li class="fr">
          <div>
            <h4 class="f-18 item-title">
              <i class="fl icon-enter-small-order"></i>店铺入驻成功</h4>
            <ul class="item-content last">
              <li>
                <i class="fl icon-enter-samll-arrow"></i>发布商品</li>
              <li>
                <i class="fl icon-enter-samll-arrow"></i>管理店铺</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <div class="panel panel-2">

      <h3 class="panel-title">
        <span>入驻优势</span>
      </h3>
      <ul class="container overflow panel-content">
        <li class="fl" v-for="advantageList in advantageLists" :key="advantageList.key">
          <dl>
            <dt class="text_center icon-box">
              <i class="inline-block" v-bind:class="[
           {'icon-enter-car': advantageList.icon == 'icon-enter-car'},
           {'icon-enter-broken': advantageList.icon == 'icon-enter-broken'},
           {'icon-enter-mobile':advantageList.icon == 'icon-enter-mobile' }]
           "></i>
            </dt>
            <dd class="item-title">{{advantageList.title}}</dd>
            <dd class="item-content">{{advantageList.content}}</dd>
          </dl>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Bus from "../../assets/bus";
import api from "../../api/api";
import fetchJson from "../../api/http";
export default {
  name: 'StoreIndex',
  data() {
    return {
      advantageLists: [
        {
          key: "key1",
          title: "海量货源供应",
          content: "商城提供多品类、多品牌的商品货源，由苏宁直供并负责售后，免去卖家店铺缺少货源的难点",
          icon: "icon-enter-car"
        },
        {
          key: "key2",
          title: "运营服务",
          content: "商城提供店铺托管运营服务，省心省力。帮助卖家进行店铺装修、店铺运营、客户服务、营销推广等",
          icon: "icon-enter-broken"
        },
        {
          key: "key3",
          title: "店铺定制",
          content: "商城提供个性化店铺定制服务，为卖家打造独一无二的店铺风格设计、营销工具、数据统计分析工具，帮助卖家实现有效运营",
          icon: "icon-enter-mobile"
        }
      ]
    };
  },
  created() {
    this.getAuditInfo();
  },
  methods: {
    // 获取入驻进度
    async getAuditInfo() {

      var isFirst = sessionStorage.getItem("isFirst");
      if (!isFirst) {
        sessionStorage.setItem("isFirst", 1);

        // 获取入驻进度
        const res = await fetchJson.post(api.getJoinStep, "params", {});
        if (res.statusCode == 200) {
          switch (res.responseContent.auditStatus) {
            case 0:
              Bus.$emit("enterStep", 0);
              this.$router.push({
                name: "enterCreate"
              });
              break;
            case 1:
              Bus.$emit("enterStep", 1);
              this.$router.push({
                name: "enterCreate"
              });
              break;
            case 2:
              Bus.$emit("enterCreate", 2);
              this.$router.push({
                name: "enterCreate"
              });

              break;
            default:
              break;
          }
        }
      }
    },

    async toCreateStore() {
      if (localStorage.getItem("userMsg")) {
        // 获取入驻进度
        const res = await fetchJson.post(api.getJoinStep, "params", {});
        if (res.statusCode == 200) {
          switch (res.responseContent.auditStatus) {
            case 0:
              Bus.$emit("enterStep", 0);
              this.$router.push({
                name: "enterCreate"
              });
              break;
            case 1:
              Bus.$emit("enterStep", 1);
              this.$router.push({
                name: "enterCreate"
              });
              break;
            case 2:
              Bus.$emit("enterStep", 2);
              this.$router.push({
                name: "enterCreate"
              });

              break;
            default:
              this.$emit("message", true);
              this.$router.push({
                name: "enterCreate"
              });
          }
        }
      } else {
        this.$utils.layerMsg.warning("请先登录！");
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/less/index.less");
.border {
  border: 1px solid #ddd;
}

.banner {
  height: 520px;
  width: 100%;
  background: url("../../assets/img/enter/store-index.jpg")center center no-repeat;
  background-size: cover;

  h3 {
    padding-top: 90px;
    font-size: 60px;
    color: @color-white;
    font-weight: 600;
    text-align: center;
    line-height: 100px;
  }

  .banner-info {
    font-size: 30px;
    text-align: center;
    color: @color-white;
    padding-top: 10px;
  }

  .btn-jion {
    position: relative;
    display: block;
    margin: 70px auto 0;
    color: @color-white;
    width: 280px;
    padding-right: 10px;
    height: 58px;
    line-height: 58px;
    text-align: center;
    font-size: 24px;
    background: @color-orange;

    &:hover {
      background: @color-orange-hover;
    }

    &:after {
      content: "";
      display: block;
      position: absolute;
      top: 22px;
      right: 72px;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-left: 10px solid #fff;
    }
  }
}

.panel {
  padding-top: 40px;
  .panel-title {
    padding-top: 20px;
    position: relative;
    font-weight: 500;
    width: 290px;
    margin: 0 auto;
    text-align: center;
    font-size: 24px;
    color: @color-3;
    span {
      position: relative;
      z-index: 2;
      background: @color-white;
      padding: 0 10px;
    }
    &:after {
      content: "";
      display: block;
      position: absolute;
      z-index: 1;
      top: 32px;
      left: 0;
      width: 100%;
      border-top: 3px dotted #666;
    }
  }

  .panel-content {
    padding-bottom: 45px;
  }
}

.panel-1 {
  background: #fff;
  .panel-content {
    padding: 70px 100px 50px;

    & > li:first-child {
      margin-right: 260px;
    }

    .item-title {
      padding-bottom: 15px;

      i {
        margin-right: 16px;
      }
    }
    .item-content {
      position: relative;
      width: 170px;

      &:after {
        content: "";
        position: absolute;
        top: 0;
        right: -100px;
        display: block; // background: url("../../assets/img/store/store-sprite.png")no-repeat;
        background-position: -474px -183px;
        width: 28px;
        height: 24px;
      }

      &.last:after {
        display: none;
      }
    }
    .item-content li {
      height: 30px;
      line-height: 24px;
      color: @color-6;

      i {
        margin-top: 8px;
        margin-right: 10px;
      }
    }
  }
}

.panel-2 {
  background: #fafafa;
  .panel-title span {
    background: #fafafa;
  }

  .panel-content {
    padding: 56px 50px 56px;

    .icon-box {
      height: 125px;
      line-height: 190px;
    }
    li {
      box-sizing: border-box;
      width: 354px;
      height: 352px; // background: @color-f;
      padding: 35px;
      margin-right: 68px;
      background: #fff;
      &:last-child {
        margin-right: 0;
      }
    }

    .item-title {
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
    }

    .item-content {
      line-height: 30px;
      color: @color-6;
    }
  }
}

.item-title {
  line-height: 30px;
  height: 30px;
}

.padding_left90 {
  padding-left: 90px;
}
</style>
