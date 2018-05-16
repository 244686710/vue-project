<template>
  <div >
    <div class="step1" v-show="step == 3" style="background: #fff">
      <div class="banner">
        <div class="banner-msg container">
          <h3 class="banner-title">拼太良商城平台</h3>
          <p class="banner-content">助力商家快速在线开店销售商品</p>
        </div>
      </div>
      <div class="main container">
        <div class="panel panel-1">
          <h4 class="panel-title">阶段 ① 入驻申请</h4>
          <ul class="panel-content overflow">
            <li class="item fl margin_left20">
              <dl>
                <dt class="fl icon-enter-pen margin_right20"></dt>
                <dd class="item-title">填写店铺基础信息</dd>
                <dd class="item-info">店铺名称 </dd>
                <dd class="item-info">主营类目 </dd>
                <dd class="item-info">售后方式</dd>
              </dl>
            </li>
            <li class="fl item">
              <dl>
                <dt class="fl icon-enter-note margin_right20"></dt>
                <dd class="item-title">填写认证主体信息</dd>
                <dd class="item-info">进行个人认证</dd>
                <dd class="item-info">进行公司企业认证</dd>
              </dl>
            </li>
            <li class="fl item">
              <dl>
                <dt class="fl icon-enter-set  margin_right20"></dt>
                <dd class="item-title">提交入驻资料</dd>
                <dd class="item-info">已确定的基础信息</dd>
                <dd class="item-info">店铺资料</dd>
              </dl>
            </li>
          </ul>
        </div>
        <div class="panel panel-2">
          <h4 class="panel-title text_right">阶段 ② 资质审核</h4>
          <dl class="overflow">
            <dt class="icon-enter-book fr margin_left20"></dt>
            <dd class="item-info">资质真实有效</dd>
            <dd class="item-info">达到入驻要求</dd>
            <dd class="item-info">授权有效，链路完整</dd>
            <dd class="item-info">生产、经营范围、产品安全性资质完整、符合国家行政法 规许可要求·</dd>
          </dl>
        </div>
        <div class="panel panel-3">
          <h4 class="panel-title">阶段 ③ 入驻申请</h4>
          <ul class="margin_left20">
            <li class="fl item">
              <dl>
                <dt class="icon-enter-flower fl"></dt>
                <dd class="fl">发布商品</dd>
              </dl>
            </li>
            <li class="fl item space">
              <dl>
                <dt class="icon-enter-room fl">
                </dt>
                <dd class="fl">店铺装修</dd>
              </dl>
            </li>
            <li class="fr item">
              <dl>
                <dt class="icon-enter-store fl">
                </dt>
                <dd class="fl">上线店铺</dd>
              </dl>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Bus from "../../assets/bus";
import api from "../../api/api";
import fetchJson from "../../api/http";
export default {
  name: "StoreStep",
  data() {
    return {
      step: 3, // 未入驻
      remark: ""
    };
  }
};
</script>
<style lang="less" scoped>
@import url("../../assets/less/index.less");
.banner {
  height: 200px;
  background: url("../../assets/img/enter/step-banner.jpg")center center no-repeat;
  color: @color-white;

  .banner-title {
    padding-top: 56px;
    font-size: 36px;
  }

  .banner-content {
    font-size: 24px;
    padding-top: 30px;
  }
  .banner-msg {
    padding-left: 50px;
  }
}

.main {
  height: 1085px;
  margin-top: 80px;
  background: url("../../assets/img/enter/step-bg.png")no-repeat;
}

.panel-1 {
  padding-left: 56px;

  .item {
    width: 374px;
  }
}

.panel-title {
  font-size: 24px;
  color: @color-6;
  padding-bottom: 76px;
}

.item-title {
  padding-bottom: 8px;
  font-size: 18px;
  color: #333;
}

.item-info {
  position: relative;
  width: 200px;
  float: left;
  font-size: 14px;
  line-height: 24px;
  color: @color-6;

  &:before {
    content: "";
    display: block;
    float: left;
    margin-top: 10px;
    margin-right: 6px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: @color-6;
  }
}

.panel-2 {
  padding-top: 150px;
  padding-right: 190px;

  .item-info {
    float: right;
    width: 700px;
    text-align: right;

    &:before {
      float: right;
      margin-right: 0;
      margin-left: 6px;
    }
  }
}

.panel-3 {
  padding-top: 180px;
  padding-left: 56px;

  .item {
    width: 254px;
  }

  .space {
    margin-left: 180px;
  }

  dd {
    line-height: 98px;
    margin-left: 20px;
    color: @color-6;
  }
}
.step1 {
  background: #fff;
}
.step3 {
  height: 600px;
  background: #fff;
  width: 1200px;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 50px;
  .step_content {
    width: 460px;
    height: 210px;
    padding-top: 170px;
    margin: 0 auto; // background: #eee;
  }

  .icon-success {
    width: 42px;
    height: 42px; // background: url('../../assets/img/store/success.png') no-repeat;
  }

  .icon-error {
    width: 42px;
    height: 42px; // background: url('../../assets/img/store/error.png') no-repeat;
  }

  .return-title {
    margin-top: 30px;
    line-height: 1.44;
    font-size: 24px;
    color: @color-3;
  }

  .return-detail {
    color: @color-9;
    margin-top: 10px;
  }

  .btn-tostore {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    width: 260px;
    margin-top: 50px;
  }
}
</style>
