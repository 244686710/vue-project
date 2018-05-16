/*
 * 售后详情
 * @Author: Yuyd
 * @Date: 2018-01-02 14:27:30
 * @Last Modified by: Yuyd
 * @Last Modified time: 2018-03-27 14:57:35
 */

<template>
  <div class="aftersale_detial" v-if="goodsDetial">
    <div class="title_crumbs f_point">
      <router-link class="link font_14" :to="{path: '/afterSale'}">维权订单</router-link> > 退货详情 <span class="f_label"></span>
    </div>
    <div class="content">
      <div class="banner">
        <dl v-if="goodsDetial && goodsDetial.refundStatus == 1">
          <dt class="icon-waiting f_left"></dt>
          <dd class="state_title">{{goodsDetial.refundStatusDesc}}</dd>
          <dd class="f_orange">{{goodsDetial.refundStatusDetail}}</dd>
        </dl>
        <dl v-if="goodsDetial && goodsDetial.refundStatus == 3">
          <dt class="icon-error f_left"></dt>
          <dd class="state_title">{{goodsDetial.refundStatusDesc}}</dd>
          <dd class="f_orange">{{goodsDetial.refundStatusDetail}}</dd>
        </dl>
        <dl v-if="goodsDetial && goodsDetial.refundStatus == 2">
          <dt class="icon-success f_left"></dt>
          <dd class="state_title" style="padding-top: 16px">退货成功</dd>
        </dl>
      </div>

      <div class="margin_left10 return_msg">
        <h4 class="f_point f_bold font_16 padding_top30">退货订单详情</h4>
        <ul class="font_12 padding_top20 f_label">
          <li>
            <label class="f_info f_bold ">售后订单编号：</label>
              {{goodsDetial.orderRefundNo}}
            </li>
          <li>
            <label class="f_info f_bold" for=""> 订单编号：</label>
            {{goodsDetial.orderNo}}
          </li>
          <li>
            <label class="f_info f_bold" for=""> 配送方式：</label>
             {{goodsDetial.sendTypeDesc}}
          </li>
          <li>
            <label class="f_info f_bold" for=""> 收货地址：</label>
            {{goodsDetial.receiveAddress}}，{{goodsDetial.receivePerson}}，{{goodsDetial.receivePhone}}
          </li>
        </ul>
      </div>

      <div class="goodsDetial">
        <h4>售后商品</h4>
        <table class="layui-table" lay-skin="line">
          <thead>
            <tr>
              <th>商品编号</th>
              <th>商品信息</th>
              <th>单价</th>
              <th>售后数量</th>
            </tr>
          </thead>
          <tbody>
           <tr>
              <td class="f_bold">
                {{goodsDetial.goodsSn ||'--'}}
              </td>
              <td class="clear_padding">
                <dl>
                  <dt class="f_left">
                    <img class="f_left" v-img-error :src="goodsDetial.picUrl">
                  </dt>
                  <dd class="good_title f_point">{{goodsDetial.goodsName | strLenght(25)}}</dd>
                  <dd class="c_gray good_size f_label font_12"><span class="margin_right20" v-show="index<2" v-for="(sku, index) in goodsDetial.skuList" :key="`sku${index}`">{{sku.attrName | strLenght(5)}}：{{sku.attrValName | strLenght(5)}}</span></dd>
                </dl>
              </td>
              <td>{{ goodsDetial.price | currency}}</td>
              <td class="clear_padding">
                {{goodsDetial.goodsNum}}
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <div class="margin_left10 return_msg">
        <ul class="font_12 padding_top20 f_label">
          <li>
            <label class="f_info f_bold ">退货申请时间：</label>
            <span class="f_info f_bold">
              {{goodsDetial.createTime}}
            </span>
            </li>
          <li>
          <li v-if="goodsDetial.refundTime">
            <label class="f_info f_bold">退货成功时间：</label>
            <span class="f_info f_bold">
              {{goodsDetial.refundTime}}
            </span>
            </li>
          <li>
            <label class="f_info" for=""> 售后类型：</label>
              {{goodsDetial.refundTypeDesc}}
          </li>
          <li>
            <label class="f_info " for=""> 退款金额：</label>
             <span class="f_orange">{{ goodsDetial.refundAmt | currency}}</span>
          </li>
          <li>
            <label class="f_info " for=""> 退货说明：</label>
             {{goodsDetial.refundReason || '无'}}
          </li>
          <li class="clearfix return_pic">
            <label class="f_left" for=""> 图片凭证：</label>
            <div class="f_left" v-if="goodsDetial.picList.length>0">
              <img class="" v-img-error :src="pic" v-for="pic in goodsDetial.picList">
            </div>
            <span v-else>无</span>
          </li>

        </ul>
      </div>

    </div>
  </div>
</template>

<script>
import fetchJson from "../../api/http";
import api from "../../api/api";
import apiOrder from '../../api/order'
export default {
  name: 'AfterSaleDetial',
  data () {
    return {
      goodsDetial: null
    }
  },
  mounted () {
    this.goodsDetial = null;
    this.getDetial()
  },

  methods: {
    async getDetial () {
      let id = this.$route.query.id;
      let loading = window.layer.load(2)
      const res =await fetchJson.post(apiOrder.afterSaleDetial, 'params', {id})
      window.layer.close(loading);
      if(res.statusCode == 200) {
        this.goodsDetial = res.responseContent
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import url('../../assets/less/variable.less');
  .banner{
    height: 160px;
    background: #f5f5f5;
    dl{
      padding:55px 45px 0;
      height: 60px;
      dd {
        padding-left: 70px;
      }
    }
  }
  .aftersale_detial .content{
    background: @color-white;
    padding:20px;
  }
  .icon-waiting{
    width: 50px;
    height: 50px;
    background: url('../../assets/img/icons/waiting.png') no-repeat;
  }
  .icon-error{
    width: 50px;
    height: 50px;
    background: url('../../assets/img/icons/error.png') no-repeat;
  }
  .icon-success{
    width: 50px;
    height: 50px;
    background: url('../../assets/img/icons/success.png') no-repeat;
  }
  .state_title{
    font-size: 24px;
    padding: 6px 0;
    color: @color-3;
  }

  .return_msg {
    line-height: 30px;
    li {
      padding-bottom: 4px;
    }
    label {
      display: inline-block;
      width: 95px;
      text-align: right;
      color: @color-6 ;
      margin-right: 20px
    }
  }
  .goodsDetial{
    border: 1px solid @color-border;
    border-bottom: none;
    margin-top: 45px;
    h4{
     height: 40px;
     line-height: 40px;
     padding-left: 40px;
     background: @color-section-header;
     border-bottom: 1px solid @color-border;
   }
  }
  .return_pic {
    img{
      width: 80px;
      height: 80px;
      margin-right: 10px;
    }
  }
</style>
