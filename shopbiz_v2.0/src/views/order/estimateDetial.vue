<template>
  <div>
    <div class="title_crumbs">
      <router-link class="link font_14" :to="{path: '/orderDetial', query:{id: $route.query.orderId}}">订单详情</router-link> > 订单评价 <span class="f_label">( 订单编号{{orderNO}})</span>
    </div>
    <div class>
      <!-- 评价列表 -->
       <table class="layui-table" lay-skin="line">
          <colgroup>
            <col>
            <col>
            <col>
            <col>
          </colgroup>
          <thead>
            <tr class="border_top">
              <th>商品信息</th>
              <th>单价</th>
              <th>评价时间</th>
              <th style="min-width: 60px;">评分</th>
              <th>评价</th>
            </tr>
          </thead>

         <tbody class="f_label">
            <tr v-for="item in orderLists" :key="item.key">
              <td class="clear_padding">
                 <dl>
                  <dt class="f_left">
                    <img :src="item.picUrl" />
                  </dt>
                  <dd class="good_title f_point">{{item.goodsName}}</dd>
                  <dd class="c_gray good_size f_label font_12"><span class="margin_right20" v-for="(sku, index) in item.skuList" :key="`sku${index}`">{{sku.attrName}}：{{sku.attrValName}}</span></dd>
                  <dd class="c_gray font_12">购买日期： {{item.orderTime}}</dd>
                </dl>

              </td>
              <td >
                {{item.goodsPrice | currency}}
              </td>
              <td>{{item.commentTime || '--'}}</td>
              <td class="clear_padding">
                <p class="score_content"><span>评分：</span>
                  <span v-for="(a, index) in Number(item.score)" :key="`hight${index}`"><i class="icon-star icon-star-active inline_block"></i>&nbsp;</span>
                  <span v-for="(b, index) in (5-Number(item.score))" :key="`gray${index}`"><i class="icon-star inline_block"></i>&nbsp;</span>
                </p>
                <p class="font_12 f_label">（{{item.scoreLevel}}）</p>
              </td>
              <td class="estimate_info" style="width: 350px">
                <div class="clearfix">
                  <span class="f_left">感受：</span>
                  <p class="replay_content f_left">{{item.content}}</p>
                </div>
                <p><img v-for="img in item.commentPicList" :src="img" alt="error" :key="img"></p>
                <div v-show="item.shopReply !=''" class=""><span class="f_left">回复：</span><p class="replay_content f_left">{{item.shopReply}}</p></div>
              </td>
            </tr>
          </tbody>
        </table>
    </div>
  </div>
</template>
<script>
import fetchJson from '../../api/http'
import api from '../../api/api'
export default {
  name: 'EstimateDetial',
  data () {
    return {
      reply: '', // 回复
      titleId: this.$route.query.orderId,
      orderLists: []
    }
  },

  mounted () {
    this.getDetial();
  },

  computed: {
    orderNO () {
      return this.$route.query.orderNo
    }
  },
  methods: {
    async getDetial () {
      const id = this.$route.query.orderId
      const res = await fetchJson.post(api.orderEstimate, 'params', {orderId: id})// 测试数据暂时传1
      if (res.statusCode === '200') {
        this.orderLists = res.responseContent.list
      }
    }
  }

}
</script>
<style lang="less" scoped>
.estimate_info{
    img {
      width: 30px;
      height: 30px;
      background: #eee;
      margin: 4px 4px 4px 0;
    }
  }

  .reply_dialog {
    padding-top: 40px;
    textarea {
      box-sizing: border-box;
      padding: 10px;
      width: 400px !important;
      height: 80px !important;
      }
  }
  .replay_content{
    max-width: 300px;
  }
  .score_content{
    min-width: 150px;
  }
</style>
