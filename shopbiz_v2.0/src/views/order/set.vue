<template>
  <div class="g_main">
    <div class="title">售后保障</div>
    <div class="section_b">
      <div class="hd" :class="{border_bottom: isShow}">
        <h4  class="strong"><span @click="isShow=!isShow"> 提供发票&nbsp; <i  class="inline_block icon-accordion" :class="{'icon-accordion-active': isShow == true}"></i></span> </h4>
        <p class="font_12 f_label">启用提供发票功能后，买家可在提交订单时填写发票所需信息，下单后你需要依据填写内容开具发票</p>

        <div class="switch f_right" v-if="mallInvoiceFlag == 1">
          <a href="javascript:;" :class="{active: invoiceFlag == 1}" @click="setInvoice(1)">启用</a>
          <a href="javascript:;" :class="{active: invoiceFlag == 0}" @click="setInvoice(0)">未启用</a>
        </div>
      </div>

      <div class="bd" v-show="isShow">
        <ul>
          <li><label for=""><i>*</i>支持发票类型：</label>普通发票</li>
          <li><label for=""><i>*</i>支持开票方式：</label>电子发票、纸质发票 </li>
          <li><label for=""><i>*</i>支持发票抬头：</label>个人、公司</li>
        </ul>
      </div>

    </div>
  </div>
</template>
<script>
import fetchJson from '../../api/http'
import api from '../../api/api'
export default {
  name: 'OrderSet',
  data () {
    return {
      isShow: false,
      invoiceFlag: false,
      mallInvoiceFlag: ''  // 拉取商城后台总开关0停用、1启用
    }
  },
  created () {
    this.getOrderDefaultSet();
  },
  methods: {
    // 获取订单开启状态
    async getOrderDefaultSet () {
      let that = this;
      const res = await fetchJson.post(api.orderSetDefault, 'params', {})
      if(res.statusCode == 200) {
        that.invoiceFlag = res.responseContent.invoiceFlag;
        that.mallInvoiceFlag = res.responseContent.mallInvoiceFlag;
      }else{
        this.$utils.layerMsg.error('获取设置状态失败！')
      }
    },

    /**
     * 设置是否开发票
     * @param {Number} flag
     */
    async setInvoice (flag) {
      if (flag == this.invoiceFlag) return;
      this.invoiceFlag = flag;
      const res = await fetchJson.post(api.orderSet, 'params', {enableFlag: flag})
      if (res.statusCode === '200') {
        this.$utils.layerMsg.success('设置成功！')
      } else {
        this.$utils.layerMsg.error('设置失败！')
      }
    }
  }
}
</script>
<style lang="less" scoped>
 @import url('../../assets/less/variable.less');
  .hd {
    height: 90px;
    box-sizing: border-box;
    padding: 20px;
    position: relative;
    .font_12{
      padding-top: 10px;
      color: @color-9
    }

    h4 span{
      cursor: pointer;
    }
  }

  .icon{
    cursor: pointer;
  }

  .switch{
    position: absolute;
    z-index: 1;
    right: 20px;
    top: 30px;
    width: 150px;
    height: 30px;
    a {
      box-sizing: border-box;
      float: left;
      text-align: center;
      width: 70px;
      height: 30px;
      line-height: 30px;
      background: @color-bg;
      color: @color-9;
      border: 1px solid @color-border;
      &.active{
        color: @color-white;
        border: 1px solid @color-orange;
        background:  @color-orange
      }
    }
  }

  .bd{
    padding:15px 30px 30px;
    li{
      padding-bottom: 30px;
      label{margin-right: 35px}
    }
  }
</style>
