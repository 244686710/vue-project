/* * @Author: Yuyd * @Date: 2018-01-02 14:24:22 * @Last Modified by: Yuyd * @Last Modified time: 2018-01-22 14:27:28 * 售后维权
*/
<template>
  <div class="g_main" @click="offSelete()">
    <div class="title">维权订单</div>
    <div class="section_b">
      <!-- form 查询 start-->
      <div class="m-search">
        <div class="layui-form">
          <div class="layui-form-item">
            <div class="layui-inline">
              <label for="" class="layui-form-label">售后订单编号：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model.trim="model.orderRefundNo">
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">订单编号：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model.trim="model.orderNo">
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">商品名称：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model.trim="model.goodsName">
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">商品类型：</label>
              <div class="layui-input-inline">
                <my-select class="inline_block selcet_box" ref="refPayType" v-model="model.supplierType" :options="selectSupplierType"></my-select>
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">售后状态：</label>
              <div class="layui-input-inline">
                <my-select class="inline_block selcet_box" ref="refStatusType" v-model="model.status" :options="selectStatus"></my-select>
              </div>
            </div>

            <div class="layui-inline">
              <label for="" class="layui-form-label">申请时间：</label>
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
              <input type="button" class=" btn_light_orange query" value="导出" @click="exportData()" />
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
          <col>
          <col>
          <col>
          <col>
        </colgroup>
        <thead>
          <tr class="border_top">
            <th>售后订单编号</th>
            <th>订单编号</th>
            <th>商品信息</th>
            <th style="min-width: 60px;">商品类型</th>
            <th>申请时间</th>
            <th>售后类型</th>
            <th>售后状态</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody class="f_label">
          <tr v-for="item in orderLists" :key="item.key">
            <td>
              {{item.orderRefundNo}}
            </td>
            <td>
              {{item.orderNo}}
            </td>
            <td class="clear_padding">
              <dl>
                <dt class="f_left">
                  <a href="javascript:;" @click="toGoodsDetial(item.goodsId)">
                    <img :src="item.picUrl" />
                  </a>
                </dt>
                <a href="javascript:;" @click="toGoodsDetial(item.goodsId)">
                  <dd class="good_title f_point hover">{{item.goodsName | strLenght(25)}}</dd>
                </a>
                <dd class="c_gray good_size f_label font_12">
                   <a href="javascript:;" @click="toGoodsDetial(item.goodsId)">
                  <span class="margin_right20 hover" v-show="index<2" v-for="(sku, index) in item.skuList" :key="`sku${index}`">{{sku.attrName | strLenght(5)}}：{{sku.attrValName | strLenght(5)}}</span>
                  </a>
                </dd>
              </dl>
            </td>
            <td>{{item.supplierType == '2' ? '分销商品' : '普通商品'}}</td>
            <td class="clear_padding">
              {{item.createTime}}
            </td>
            <td class="estimate_info" style="width: 350px">
              {{item.refundTypeDesc}}
            </td>
            <td>
              {{item.refundStatusDesc}}
              <td>
                <a href="javascript:;" class="handle" @click="toDetial(item.id)">退货详情</a>
              </td>
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

    <!-- exprot dialog -->
    <div class="hide export_dialog" id="exportDialog">
      <ul>
        <li>
          <label for=""> 售后订单编码：</label>{{model.orderRefundNo || '--'}}
        </li>
        <li>
          <label for=""> 订单编码：</label>{{model.orderNo || '--'}}
        </li>
        <li>
          <label for="">商品名称：</label>{{model.goodsName || '--'}}
        </li>
        <li>
          <label for="">商品类型：</label>{{model.supplierType | supplierType}}
        </li>
        <li>
          <label for="">售后状态：</label>{{model.status | refundStatus}}
        </li>
        <li>
          <label for="">申请时间：</label> {{model.startTime || '--'}} 至 {{model.endTime || '--'}}
        </li>
        <li class="clearfix count">
          <div class="clearfix">
            <label for="" class="f_left">选择导出数量</label>
            <div class="layui-input-inline f_left">
              <input type="text" v-model="min" @keyup="min = min ? min.replace(/\D/g,''): ''">&nbsp;&nbsp;
            </div>
            <div class="layui-form-mid">
              <i class="separator"></i>
            </div>
            <div class="layui-input-inline f_left">
              <input type="text" v-model="max" @keyup="max = max ? max.replace(/\D/g,''): ''" />
            </div>
          </div>
          <p>
            共计{{exportTotal}}条记录
            <span class="primary">（每次仅支持1000条记录导出）</span>
          </p>
        </li>
        <li class="text_center">
          <input type="button" class="btn btn_light_orange" value="生成报表" @click="exportOrder()">
        </li>
      </ul>
    </div>

  </div>
</template>
<script>
  import fetchJson from "../../api/http";
  import api from "../../api/api";
  import apiOrder from '../../api/order'
  import MySelect from "../../components/Select.vue";
  import MyDate from '../../components/Date.vue';
  import config from '../../config';
  export default {
    name: 'AfterSaleList',
    components: {
      MySelect,
      MyDate
    },
    data() {
      return {
        min: '',
        max: '',
        exportTotal: null,
        orderLists: [], // 列表数据
        reply: '', // 回复内容
        pageInfo: { // 分页数据
          total: 0,
          offset: 1,
          limit: 20
        },
        selectStatus: {
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
              Text: "退货中"
            },
            {
              Value: "2",
              Text: "退货成功"
            },
            {
              Value: "3",
              Text: "退货关闭"
            },
          ]
        },
        selectSupplierType: {
          size: {
            w: "150px",
            h: "30px"
          },
          selectOptions: [{
              Value: "0",
              Text: "全部商品"
            },
            {
              Value: "1",
              Text: "普通商品"
            },
            {
              Value: "2",
              Text: "分销商品"
            }
          ]
        },
        model: {
          goodsName: '', // 商品名称
          orderRefundNo: '', // 退货单号
          orderNo: '', // 订单号
          supplierType: 0,
          status: 0,
          startTime: '',
          endTime: '',
        }
      }
    },

    mounted() {
      // 获取列表数据
      this.getAfterSaleList()
    },
    methods: {

      // 下拉列表关闭
      offSelete () {
        this.$refs.refPayType.offSelect()
        this.$refs.refStatusType.offSelect()
      },

      /**
       * 分页器
       * @param {Number} msg 分页数
       */
      recievePage(msg) {
        this.pageInfo.offset = msg;
        this.getAfterSaleList();
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

      toGoodsDetial(goodsId) {
        let url = config.webUrl +'/goodDetail/' + goodsId;
        window.open(url)
      },

      /**
       *获取评价列表
       *@param {} null
       */
      async getAfterSaleList() {
        let that = this;
        that.model.score = that.model.score == 0 ? '' : that.model.score;
        let paramsData = {
          ...that.model,
          offset: that.pageInfo.offset,
          supplierType: this.model.supplierType == 0 ? '' : this.model.supplierType,
          status: this.model.status == 0 ? '': this.model.status,
          limit: that.pageInfo.limit
        }
        let loading = layer.load(2);
        const res = await fetchJson.post(apiOrder.afterSaleList, 'params', paramsData)
        if (res.statusCode == 200) {
          this.orderLists = res.responseContent.list;
          this.pageInfo.total = res.responseContent.total
        }
        layer.close(loading)
      },
      // 点击查询
      queryData() {
        this.getAfterSaleList()
      },

      // 查看维权详情
      toDetial(id) {
        this.$router.push({
          name: 'afterSaleDetial',
          query: {
            id
          }
        })
      },
      // 导出列表
      async exportData() {
        let params = {
          ...this.model,
          offset: this.pageInfo.offset,
          supplierType: this.model.supplierType || '',
          status: this.model.status || '',
        }
        const res = await fetchJson.post(apiOrder.afterSaleList, 'params', params)
        if (res.statusCode == 200 && res.responseContent.total > 0) {
          this.exportTotal = res.responseContent.total;
          let dialog = this.$utils.layerOpen({
            title: '导出维权订单',
            height: '520px',
            width: '650px',
            content: $('#exportDialog'),
          })
        } else if (res.statusCode == 200 && res.responseContent.total == 0) {
          this.$utils.layerMsg.warning('当前条件无可导出的订单！');
        }
      },

      async exportOrder() {
        let that = this;
      if(Number(this.min)> Number(this.exportTotal)|| Number(this.max)>Number(this.exportTotal)){
          this.$utils.layerMsg.warning(`输入数据有误，最大可导出${this.exportTotal}条`);
          return;
        }
        if (this.max > 0 && this.min > 0 && Number(this.max) >= Number(this.min) && Number(this.max)-Number(this.min)<1000) {

        } else {
          this.$utils.layerMsg.error('请输入正确的导出值，开始值要大于等于1,结束值大于等于开始值，单次最多导出1000条');
          return;
        }

        let params = {
          start: this.min,
          end: this.max,
          ...that.model,
          offset: that.pageInfo.offset,
          supplierType: this.model.supplierType || '',
          status: this.model.status || '',
          limit: that.pageInfo.limit
        };
        const res = await fetchJson.export(apiOrder.exportAfterSale, params)
        // if(res.statusCode == 200){
        layer.closeAll();
        this.model.min = '';
        this.model.max = '';
        var blob = new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",

        });
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.download = "维权订单列表.xlsx";
        a.href = URL.createObjectURL(blob);
        a.click();
        // }else{
        // this.$utils.layerMsg.error('导出异常！');
        // }
      },
    }
  }

</script>
<style lang="less" scoped>
  @import url('../../assets/less/variable.less');
  .hover:hover{
    color: @color-blue !important;
  }
  .estimate_info {
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

  .replay_content {
    max-width: 300px;
  }

  .score_content {
    min-width: 150px;
  }

  .page_box {
    width: 100%;
  }
  // 导出弹框样式
  .export_dialog {
    padding: 10px 30px 20px;
    text-align: left;
    line-height: 40px;
    li {
      font-size: @font-12;
      label {
        display: inline-block;
        width: 115px;
        color: @color-3
      }
    }
    .count {
        input {
          height: 38px !important;
          padding: 0 6px;
        }
      }
    p{
      margin: 0px 0 0 115px;
      font-size: @font-12;
      .primary {
        color: @color-error
      }
    }

    .btn{
      margin-top: 20px;
      height: 40px;
      width: 160px;
    }
  }
  .layui-table, .layui-table-view{
    margin: 0;
    margin-top: 10px;
  }
</style>
