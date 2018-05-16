/*
 * @Author: Yuyd
 * @Date: 2018-01-11 09:44:25
 * @Last Modified by: Yuyd
 * @Last Modified time: 2018-03-13 15:30:14
 * 已完成的订单
 */

<template>
  <div>
    <div class="title">已完成订单</div>
    <div class="order-table-box">
      <table class="layui-table" lay-skin="line">
        <colgroup>
          <col width="340">
          <col width="140">
          <col width="140">
          <col>
          <col>
          <col>
          <col>
          <col>
        </colgroup>
        <thead>
          <tr>
            <th>商品信息</th>
            <th>单价/数量</th>
            <th>实付金额</th>
            <th>收货人</th>
            <th style="min-width: 60px;">订单状态</th>
            <th>付款方式</th>
            <th style="min-width: 60px;">配送方式</th>
            <th style="min-width: 60px;">操作</th>
          </tr>
        </thead>

        <tbody v-for="orderList in orderLists.list" :key="orderList.id">
          <tr>
            <th colspan="8">
              <h4>{{orderList.createTime}} &nbsp; 订单号：{{orderList.orderNo}}</h4>
            </th>
          </tr>
          <tr class="border_left">
            <td class="clear_padding">
              <dl v-for="item in orderList.goodsList" :key="item.key">
                <dt class="f_left">
                  <img :src="item.picUrl" />
                </dt>
                <dd class="good_title inline_block text-ellipsis" :title="item.name">{{item.name}}</dd>
                <dd class="f_info good_size clearfix">
                  <span v-if="item.orderSupplierType == 2">
                  <span class="badge_orange f_left" > 分销</span>&nbsp;&nbsp;
                  </span>
                  <p class="inline_block text-ellipsis" v-show="index<2" v-for="(sku,index) in item.skuList" :key="sku.attrName">{{sku.attrName | strLenght(5)}}: {{sku.attrValName | strLenght(5)}}&nbsp;&nbsp;&nbsp;&nbsp;</p>
                </dd>
              </dl>
            </td>
            <td class="clear_padding border_right">
              <div class="price_box" v-for="item in orderList.goodsList" :key="item.key">
                <span>{{item.price | currency}}</span>
                <br>
                <span>{{item.goodsNum}}</span>
              </div>
            </td>
            <td class="border_right">
              {{orderList.orderAmt}}
              <br>
              <span v-show="orderList.deliveryAmt">含运费:{{orderList.deliveryAmt | currency}}</span>
            </td>
            <td class="border_right">
              {{orderList.receivePerson}}
              <br> {{orderList.receivePhone}}

            </td>
            <td class="border_right">{{orderList.status | orderType}}</td>
            <td class="border_right">{{orderList.payType | payType}}</td>
            <td class="border_right">{{orderList.sendType | sendType}}</td>
            <td class="border_right">
              <p href="javascript:;" v-if="orderList.status == 1 && orderList.sendType == 1 " class="handle" @click="changeDeliveryPrice(orderList)">改运费</p>
              <p v-if="orderList.status == 2">
                <input type="button" class=" btn_light_orange w80 margin_bottom10" value="发货" @click="send(orderList)" />
              </p>
              <p href="javascript:;" v-if="orderList.status == 4 && orderList.commentFlag == 1" class="handle" @click="toEstimate(orderList.id, orderList.orderNo)">查看评价</p>
              <p></p>
              <p href="javascript:;" class="handle" @click="toDetial(orderList.id)">订单详情</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pager">
      <pager class="f_right page_box" :options="pageInfo" @changePagerNum="recievePage"></pager>
      <div v-show="pageInfo.total == 0" class="text_center">当前没有任何数据</div>
    </div>
  </div>
</template>
<script>
import fetchJson from '../../api/http'
import api from '../../api/api'
export default {
  name: 'FinishOrder',
  data () {
    return {
      orderLists: [],
      pageInfo: {
        total: 0, // 总条数
        offset: 1, // 当前页面
        limit: 20 // 页面尺寸
      },
      userId: '',
      status: 4
    }
  },
  mounted () {
    this.getOrderList()
  },
  methods: {
    recievePage (msg) {
      this.pageInfo.offset = msg
      this.getOrderList()
    },
    /*
    * 获取订单列表
    */
    async getOrderList () {
      this.userId = this.$route.query.userId ? this.$route.query.userId : '';
      let params = {
        offset: this.pageInfo.offset,
        limit: this.pageInfo.limit,
        userId: this.userId,
        status: this.status
      }
      let loading = window.layer.load(2)
      const res = await fetchJson.post(api.orderList, 'params', params)
      if (res.statusCode === '200') {
        this.orderLists = res.responseContent
        this.pageInfo.total = this.orderLists.total
      }
      window.layer.close(loading)
    },
    // 查看订单详情
    toDetial (id) {
      this.$router.push({
        name: 'orderDetial',
        query: {
          id
        }
      })
    },
    /**
     * 查看评价详情
     * @param {String} id
     */
    // 查看评价详情
    toEstimate (id, no) {
      this.$router.push({
        name: 'orderEstimateDetial',
        query: {
          orderId: id,
          orderNo: no
        }
      })
    }
  }

}
</script>
<style lang="less" scoped>
@import url("../../assets/less/variable.less");
  .order-table-box {
    .layui-table thead tr th {
      // height: 50px;
      padding: 15px 20px;
      background: @color-white;
    }
  }

  .layui-table {
    border: none;

    tbody th {
      margin-top: 10px;
      height: 40px;
      padding: 0;
      background: #f4f5f7;
      h4 {
        margin-top: 10px;
        padding-left: 20px;
        height: 40px;
        line-height: 40px;
        background: @color-section-header;
        border-top: 1px solid @color-border;
      }
    }

    dl {
      box-sizing: border-box;
      min-width: 380px;
      max-width: 500px;
      height: 140px;
      padding: 20px;
      border-bottom: 1px solid @color-border;

      &:last-child {
        border-bottom: none;
      }

      img {
        width: 100px;
        height: 100px;
        margin-right: 10px;
      }
      .good_title {
        margin-top: 10px;
      }
      dd.good_size {
        margin-top: 10px;
        line-height: 18px;
      }
    }

    .price_box {
      box-sizing: border-box;
      padding: 50px 20px 0;
      height: 140px;
      border-left: 1px solid @color-border;
      &:last-child {
        border-bottom: none;
      }
    }
  }


  .pager {
    padding: 20px 0 40px;

    .page_box {
      width: 100%;
    }
  }

  .text-ellipsis{
    max-width:178px;
    line-height: 22px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
  }

</style>
