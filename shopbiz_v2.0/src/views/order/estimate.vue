<template>
  <div class="g_main" @click="offSelete()">
    <div class="title">全部评价</div>
    <div class="section_b">
    <!-- form 查询 start-->
      <div class="m-search">
        <div class="layui-form">
          <div class="layui-form-item">
            <div class="layui-inline">
              <label for="" class="layui-form-label">商品名称：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model.trim="model.goodsName">
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">买家信息：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model.trim="model.buyer">
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">评分：</label>
              <div class="layui-input-inline">
               <my-select class="inline_block selcet_box" ref="refPayType" v-model="model.score" :options="selectScore"></my-select>
              </div>
            </div>

            <div class="layui-inline">
              <label for="" class="layui-form-label">购买时间：</label>
              <div class="layui-input-inline">
                <my-date v-model="model.startTime" class="input_date" @input="startTimeChange" placeholder="开始时间" ref="startTime" :isTime="false"
                  dateFormat="yyyy-MM-dd HH:mm:ss"></my-date>
                <!-- <input type="text" class="layui-input input_date" readonly v-model="model.startTime" placeholder="开始时间" id="start"> -->
              </div>
              <div class="layui-form-mid">
                <i class="separator"></i>
              </div>
              <div class="layui-input-inline">
                <my-date v-model="model.endTime" @input="endTimeChange" ref="endTime" :isEnd="true" placeholder="结束时间" class="input_date" :isTime="false"
                  dateFormat="yyyy-MM-dd HH:mm:ss"></my-date>
              </div>
            </div>
            <!-- query & export -->
            <div class="btn_group f_right">
              <input type="button" class=" btn_light_orange query" value="查询" @click="queryData()" />
            </div>
          </div>
        </div>
      </div>
      <!-- form 查询 end-->

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
              <th>购买时间</th>
              <th>评价商品名称</th>
              <th>买家信息</th>
              <th style="min-width: 60px;">评分</th>
              <th>评价详情</th>
              <th>操作</th>
            </tr>
          </thead>

          <tbody class="f_label">
            <tr v-for="item in orderLists" :key="item.key">
              <td>
                {{item.orderTime}}
              </td>
              <td class="clear_padding">
                <dl>
                  <dt class="f_left">
                    <img :src="item.picUrl" />
                  </dt>
                  <dd class="good_title f_point">{{item.goodsName | strLenght(20)}}</dd>
                  <dd class="c_gray good_size f_label font_12"><span class="margin_right20" v-show="index<2" v-for="(sku, index) in item.skuList" :key="`sku${index}`">{{sku.attrName | strLenght(5)}}：{{sku.attrValName | strLenght(5)}}</span></dd>
                </dl>
              </td>
              <td>{{item.buyer || '--'}}</td>
              <td class="clear_padding">
                <p class="score_content"><span>评分：</span>
                  <span v-for="(a, index) in Number(item.score)" :key="`hight${index}`"><i class="icon-star icon-star-active inline_block"></i>&nbsp;</span>
                  <span v-for="(b, index) in (5-Number(item.score))" :key="`gray${index}`"><i class="icon-star inline_block"></i>&nbsp;</span>
                </p>
                <p class="font_12 f_label">（{{item.scoreLevel}}）</p>
              </td>
              <td class="estimate_info" style="width: 350px">
                <div class="clearfix"><span class="f_left">感受：</span><p class="replay_content f_left">{{item.content}}</p></div>
                <p><img v-for="img in item.commentPicList" :src="img" alt="" :key="img"></p>
                <div v-show="item.shopReply !=''" class=""><span class="f_left">回复：</span><p class="replay_content f_left">{{item.shopReply}}</p></div>
              </td>
              <td><a href="javascript:;" v-show="item.shopReply ==''" class="handle" @click="toReplay(item)">回复</a><span v-show="item.shopReply !=''">--</span></td>
            </tr>
          </tbody>
        </table>
    </div>

    <!-- 分页 -->
    <div class="pager clearfix">
      <pager class="f_right page_box" :options="pageInfo" @changePagerNum="recievePage"></pager>
      <div v-show="pageInfo.total == 0" class="text_center">当前没有任何数据</div>
    </div>

    <!-- 回复弹框 dialog -->
    <div class="hide reply_dialog" id="replyDialog">
      <textarea name="" id="" cols="30" rows="10" maxlength="100" v-model="reply" placeholder="请输入不超过100个字符的回复"></textarea>
    </div>
  </div>
</template>
<script>
import fetchJson from "../../api/http";
import api from "../../api/api";
import MySelect from "../../components/Select.vue";
import MyDate from '../../components/Date.vue';
export default {
  name: 'EstimateList',
  components: {MySelect, MyDate},
  data () {
    return {
      orderLists: [], // 列表数据
      reply: '', // 回复内容
      pageInfo: { // 分页数据
        total: 0,
        offset: 1,
        limit: 20
      },
      selectScore: {
        size: {
          w: "150px",
          h: "30px"
        },
        selectOptions: [{
            Value: "0",
            Text: "全部"
          },
          {
            Value: "1",
            Text: "差评"
          },
          {
            Value: "2",
            Text: "中评"
          },
          {
            Value: "3",
            Text: "好评"
          }
        ]
      },
      model: {
        goodsName: '', // 商品名称
        buyer: '', // 买家姓名
        score: 0,
        startTime: '',
        endTime: '',
      }
    }
  },

  mounted () {
    // 获取列表数据
    this.getEstimateList()
  },
  methods: {

    // 下拉列表关闭
    offSelete () {
      this.$refs.refPayType.offSelect()
    },
    /**
     * 分页器
     * @param {Number} msg 分页数
     * */
    recievePage(msg) {
        this.pageInfo.offset = msg;
        this.getEstimateList();
    },

    // 日期切换
    endTimeChange(value) {
      if (this.model.startTime) {
        if(Date.parse(new Date(value)) < Date.parse(new Date(this.model.startTime))) {
          layer.msg('结束时间必须大于开始时间', {
            icon: 0
          })
          this.$refs.endTime.resetDate()
        }
      }

    },
    startTimeChange(value) {
      if (this.model.endTime) {
        if(Date.parse(new Date(value)) > Date.parse(new Date(this.model.endTime))){
          layer.msg('开始时间必须小于结束时间', {
            icon: 0
          })
          this.$refs.startTime.resetDate()
        }
      }
    },

    /**
     *获取评价列表
     *@param {} null
     */
    async getEstimateList () {
      let that = this;
      that.model.score = that.model.score == 0 ? '' : that.model.score;
      let paramsData = {
        ...that.model,
        offset: that.pageInfo.offset,
        limit: that.pageInfo.limit
      }
      let loading =layer.load(2);
      const res = await fetchJson.post(api.orderEstimate, 'params', paramsData)
      if(res.statusCode == 200) {
        this.orderLists = res.responseContent.list;
        this.pageInfo.total = res.responseContent.total
      }
      layer.close(loading)
    },
    // 点击查询
    queryData () {
      this.getEstimateList()
    },
    /**
     *回复评论
     * @param {Object} item // 对应的商品
     */
    toReplay(item) {
      let that = this;
      let dialog = this.$utils.layerOpen({
        title: '回复',
        formType: 2,
        content: $('#replyDialog'),
        btn: ['提交', '取消'],
        height: '300px',
        width: '600px',

        yes: async() => {

          const res = await fetchJson.post(api.orderReplyEstimate, 'params', {commentId: item.id, shopReply: that.reply})
          if(res.statusCode == 200) {
            layer.close(dialog);
            item.shopReply = that.reply
            item = Object.assign({}, item)
            that.$utils.layerMsg.success('回复成功！')
          }else{
            layer.close(dialog);
            that.getEstimateList ();
          }
        },

        cancel: () => {
          that.reply = ''
        },
        end: () => {
          that.reply = ''
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  @import url('../../assets/less/variable.less');
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

  .page_box {
    width: 100%;
  }
</style>
