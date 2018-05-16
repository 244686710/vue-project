<template>
  <div class="g-main" @click="offSelect()">
    <div class="title">收支明细</div>
    <div class="section_b">
      <!-- tab start -->
      <div class="tab_header border clearfix">
        <div class="f_left tab">
          <span :class="{actived: tabState == 0}" @click="changeTabList(0)">交易记录</span>
          <span v-show="flag" :class="{actived: tabState == 1}" @click="changeTabList(1)">分销记录</span>
        </div>
      </div>
      <!-- tab end -->

      <!-- form 查询 start-->
      <div class="m-search">
        <div class="layui-form">
          <div class="layui-form-item">
            <div class="layui-inline">
              <label for="" class="layui-form-label">订单编号：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model="search.orderNo">
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">支付单号：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model="search.payNo">
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">类型：</label>
              <div class="layui-input-inline">
                <my-select v-model="search.type" ref="select1" :options="selectType"></my-select>
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">状态：</label>
              <div class="layui-input-inline">
                <my-select v-model="search.status" ref="select2" :options="selectStatus"></my-select>
              </div>
            </div>

            <div class="layui-inline">
              <label for="" class="layui-form-label">创建时间：</label>
              <div class="layui-input-inline">
                <my-date v-model="search.startTime" class="input_date" @input="startTimeChange" placeholder="开始时间" ref="startTime" :isTime="false"
                  dateFormat="yyyy-MM-dd HH:mm:ss"></my-date>
              </div>
              <div class="layui-form-mid">
                <i class="separator"></i>
              </div>
              <div class="layui-input-inline">
                <my-date v-model="search.endTime" @input="endTimeChange" ref="endTime" :isEnd="true" placeholder="结束时间" class="input_date" :isTime="false"
                  dateFormat="yyyy-MM-dd HH:mm:ss"></my-date>
              </div>
            </div>
            <!-- query & export -->
            <div class="btn_group f_right">
              <input type="button" class=" btn_light_orange query" value="查询" @click="loadList" />
              <input type="button" class="f_right btn_light_orange query" value="导出" @click="exportData()" />
            </div>
          </div>
        </div>
      </div>
      <!-- form 查询 end-->

      <!-- table表格 -->
      <table class="layui-table" lay-skin="line" v-show="tabState == 0">
        <colgroup>
          <col width="340">
          <col>
          <col>
          <col>
        </colgroup>
        <thead>
          <tr class="border_top">
            <th>创建时间</th>
            <th>订单编号</th>
            <th>支付单号</th>
            <th style="min-width: 60px;">收入/支出</th>
            <th>类型</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataList.list" :key="item.key">
            <td>{{item.createTime}}</td>
            <td>{{item.orderNo}}</td>
            <td>{{item.payNo}}</td>
            <td>
              <span v-if="item.tradeType != 1" class="red_loc">{{item.amount || 0}}</span>
              <span v-if="item.tradeType == 1" class="green_loc">+ {{item.amount || 0}}</span>
            </td>
            <td>
              <span v-if="item.tradeType == 1">消费-商城购物</span>
              <span v-if="item.tradeType == 2">售后-退货退款</span>
              <span v-if="item.tradeType == 3">店铺结算</span>
            </td>
            <td>
              <span v-if="item.status == 1">已完成</span>
              <span v-if="item.status == 0">进行中</span>
              <span></span>
            </td>
            <td>
              <a class="handle" v-if="item.tradeType !=3" @click="checkShop(item.orderNo,item.tradeType,item.orderId)">查看</a>
              <span v-else="item.tradeType">--</span>
            </td>
          </tr>
        </tbody>
      </table>

       <!-- 分销记录 -->
      <table class="layui-table" lay-odd lay-skin="nob" style="table-layout: fixed;" v-show="tabState == 1">
        <thead>
          <tr>
            <th>创建时间</th>
            <th>订单编号</th>
            <th>支付单号</th>
            <th>订单金额</th>
            <th>分销成本</th>
            <th>利润</th>
            <th>收入/支出</th>
            <th>类型</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody v-if="dataList">
          <tr v-for="item in dataList.list" :key="item.id">
            <td>{{item.createTime}}</td>
            <td>{{item.orderNo}}</td>
            <td>{{item.payNo}}</td>
            <td>{{item.orderAmt | currency}}</td>
            <td>{{item.distributionCost | currency}}</td>
            <td>{{item.profit}}</td>
            <td>
              <span class="red_loc" v-show="item.type != 1">{{item.amount || 0}}</span>
              <span  v-show="item.type == 1" class="green_loc">+{{item.amount || 0}}</span>
            </td>
            <td>
              <span v-if="item.type == 1">消费-商城购物</span>
              <span v-if="item.type ==2">售后-退货退款</span>
              <span v-if="item.type ==3">店铺结算</span>
            </td>
            <td>
              <span v-if="item.status == 0">进行中</span>
              <span v-else="item.status">已完成</span>
            </td>
            <td>
              <a href="javascript:;" class="handle" @click="seeMarketDetial(item.type, item.orderId)">查看</a>

            </td>
          </tr>
        </tbody>
      </table>

    </div>
    <!-- 分页 -->
    <div class="pager margin_bottom40 clearfix">
      <pager class="f_right page_box" :options="pageInfo" @changePagerNum="recievePage"></pager>
      <div v-show="pageInfo.total == 0" class="text_center">当前没有任何数据</div>
    </div>

    <!-- 导出模块 -->
    <!-- exprot dialog -->
    <div class="hide export_dialog" id="exportDialog">
      <ul>
        <li>
          <label for=""> 订单编码：</label>{{search.orderNo || '--'}}
        </li>
        <li>
          <label for="">支付号码：</label>{{search.payNo || '--'}}
        </li>

        <li>
          <label for="">创建时间：</label> {{search.startTime || '--'}} 至 {{search.endTime || '--'}}
        </li>
        <li>
          <label for="">状态</label>
          <span v-if="search.tradeType == 1">消费-商城购物</span>
          <span v-if="search.tradeType == 2">消费-商城购物</span>
          <span v-else>全部</span>
        </li>
        <li>
          <label for="">类型：</label>
          <span v-if="search.status == 1">已完成</span>
          <span v-if="search.status == 0">进行中</span>
          <span v-if="search.status == 2">全部</span>
          <span></span>
        </li>
        <li class="clearfix count">
          <div class="clearfix">
            <label for="" class="f_left">选择导出数量</label>
            <div class="layui-input-inline f_left">
              <input type="text" v-model="search.min" @keyup="search.min = search.min ? search.min.replace(/\D/g,''): ''">&nbsp;&nbsp;
            </div>
            <div class="layui-form-mid">
              <i class="separator"></i>
            </div>
            <div class="layui-input-inline f_left">
              <input type="text" v-model="search.max" @keyup="search.max = search.max ? search.max.replace(/\D/g,''): ''" />
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
  import fetchJson from '../../api/http';
  import fund from '../../api/fund';
  import MySelect from '../../components/Select.vue'
  import MyDate from '../../components/Date.vue'

  export default {
    name: "FundDetial",
    components: {
      MySelect,
      MyDate
    },
    data() {
      return {
        flag: 0,
        tabState: 0,
        exportTotal: 0, // 可导出数量
        modal: false, //弹窗默认隐藏
        cancelIndex: '',
        /* 弹窗索引 */
        goodsStatus: 0, //结算状态（0.待结算/1.已结算）
        dataList: [],
        shopData: '',
        pageInfo: {
          total: 0,
          offset: 1,
          limit: 20
        },
        search: {
          orderNo: '',
          payNo: '',
          type: 0, // 类型
          status: 2,
          startTime: '',
          endTime: '',
          min: '',
          max: ''
        },
        res: {},
        selectType: {
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
              Text: "消费-商城购物"
            },
            {
              Value: "2",
              Text: "售后-退货退款"
            },
            {
              Value: "3",
              Text: "店铺结算"
            }
          ]
        },
        selectStatus: {
          size: {
            w: "150px",
            h: "30px"
          },
          selectOptions: [{
              Text: '全部',
              Value: 2
            },
            {
              Text: '已完成',
              Value: 1
            },
            {
              Text: '进行中',
              Value: 0
            }
          ],
        }
      }
    },
    activated () {
      let isMarket = this.$route.query.isMarket;
      if (this.$route.query && this.$route.query.isReset) {
        Object.assign(this.$data, this.$options.data())
        this.$router.push({name: 'fundDetial', query: {...this.$route.query, isReset: false}})
      }
      if (this.$route.query.type==1) {
        this.dataList = [];
        this.pageInfo.total = 0;
      } else if (this.$route.query.type==4 && this.$route.query.status==1) {
        this.dataList = [];
        this.pageInfo.total = 0;
        this.search.type=4;
        this.search.status=1;
      } else{
        if(this.$route.query.type==0 && this.$route.query.status==1){
          this.search.type=1;
          this.search.status=1;
        }else if(this.$route.query.type=='saleAmt'){
          this.search.startTime=this.$route.query.curStartTime;
          this.search.endTime=this.$route.query.curEndTime;
          this.search.type=1;
          this.search.status=2;
        }else if(this.$route.query.type=='refundAmt'){
          this.search.startTime=this.$route.query.curStartTime;
          this.search.endTime=this.$route.query.curEndTime;
          this.search.type=2;
          this.search.status=2;
        }else if(this.$route.query.type==undefined){
          this.search.status=2;
          this.search.type=0;
        }

        if(this.$route.query.timeType!=undefined){
          this.search.status=1;
          this.search.startTime=this.$route.query.curStartTime;
          this.search.endTime=this.$route.query.curEndTime;
        }
      }
      if (isMarket) {
        this.tabState = 1
      } else {
        this.tabState = 0
      }
      this.loadList()
      this.getMarketFlag()
    },

    methods: {
      // 关闭下拉列表
      offSelect () {
        this.$refs.select1.offSelect();
        this.$refs.select2.offSelect();
      },

      /**
       * tab 切换
       * @param {Number} tabState
       */
      changeTabList (tabState) {
        this.tabState = tabState
        this.search.orderNo = '';
        this.search.payNo = '';
        this.search.type = 0;
        this.search.status = 2;
        this.search.startTime ='';
        this.search.endTime = '';
        this.pageInfo.offset = '';
        this.loadList()

      },

      // 获取是否开启分销
      async getMarketFlag () {
        const res = await fetchJson.post('/api/system/mall/sale-supplier-goods/get-enabled-flag', 'params',{})
        if(res.statusCode === '200') {
          this.flag = res.responseContent.flag;
        }
      },

      /**
       * 分页
       * @param {Number} msg
       */
      recievePage(msg) {
        this.pageInfo.offset = msg;
        this.getPageList();
      },
      /**
       *获取列表数据
       */
      async getPageList() {
        let self = this
        let offset = self.pageInfo.offset;
        let limit = self.pageInfo.limit
        let loading = layer.load(2);
        let params = {
          orderNo: self.search.orderNo,
          payNo: self.search.payNo,
          type: self.search.type,
          status: self.search.status,
          startTime: self.search.startTime,
          endTime: self.search.endTime,
          offset: self.pageInfo.offset,
          limit: self.pageInfo.limit,
        }
        let res = null;
        if( this.tabState == 0) {
          res = await fetchJson.post(fund.getMallTransList, 'params', params)
        }else {
          res = await fetchJson.post(fund.marketlog, 'params', params)
        }
        layer.close(loading);
        if (res.statusCode == 200) {
          self.dataList = res.responseContent
          self.pageInfo.total = res.responseContent.total;
        }
      },

      /**
       *查询
       * @param {String}
       */
      loadList() {
        let self = this
        self.pageInfo.offset = 1
        self.getPageList()
      },

       // 日期切换
    endTimeChange(value) {
      if (this.search.startTime) {
        if(Date.parse(new Date(value)) < Date.parse(new Date(this.search.startTime))) {
          layer.msg('结束时间必须大于开始时间', {
            icon: 0
          })
          this.$refs.endTime.resetDate()
        }
      }

    },
    startTimeChange(value) {
      if (this.search.endTime) {
        if(Date.parse(new Date(value)) > Date.parse(new Date(this.search.endTime))){
          layer.msg('开始时间必须小于结束时间', {
            icon: 0
          })
          this.$refs.startTime.resetDate()
        }
      }
    },

      /*
       * 导出列表
       */
      async exportData() {
        let self = this;
        let params = {
          orderNo: self.search.orderNo,
          payNo: self.search.payNo,
          type: self.search.type,
          status: self.search.status,
          startTime: self.search.startTime,
          endTime: self.search.endTime,
          offset: 1,
          limit: 1,
        }
        let apiUrl = '';
        let title = ''
        if(this.tabState == 0) {
          apiUrl = fund.getMallTransList;
          title = '导出收支列表'
        }else {
          apiUrl = fund.marketlog;
          title = '分销记录列表'
        }
        const res = await fetchJson.post(apiUrl, 'params', params)
        if (res.statusCode == 200 && res.responseContent.total > 0) {
          this.exportTotal = res.responseContent.total;
          let dialog = this.$utils.layerOpen({
            title,
            height: '520px',
            width: '650px',
            content: $('#exportDialog'),
          })
        } else if (res.statusCode == 200 && res.responseContent.total == 0) {
          this.$utils.layerMsg.warning('当前条件无可导出的订单！');
        }
      },

      async exportOrder () {
        let self = this;
        if(Number(this.search.min)> Number(this.exportTotal)|| Number(this.search.max)>Number(this.exportTotal)){
          this.$utils.layerMsg.warning(`输入数据有误，最大可导出${this.exportTotal}条`);
          return;
        }
        if(!this.search.max || !this.search.min){
          this.$utils.layerMsg.error('请输入导出数量');
          return ;
        }
        if(this.search.max && this.search.min && Number(this.search.min)>Number(this.search.max)&& Number(this.search.max)-Number(this.search.min)>=1000){
          this.$utils.layerMsg.error('请输入正确的导出值，开始值要大于等于1,结束值大于等于开始值，单次最多导出1000条');
          return ;
        }
        let params = {
          start: this.search.min,
          end: this.search.max,
          orderNo: self.search.orderNo,
          payNo: self.search.payNo,
          type: self.search.type === 0 ? 1 : self.search.type,
          status: self.search.status,
          startTime: self.search.startTime,
          endTime: self.search.endTime,
        };
        let exportApi = '';
        let text = '';
        if(this.tabState == 0) {
          exportApi = fund.exportTrans
          text = '订单列表'
        }else {
          exportApi = fund.exportMarketLog
          text = '分销记录'
        }
        const res = await fetchJson.export(exportApi, params)
        layer.closeAll();
         var blob = new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",

        });
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.download = `${text}.xlsx`;
        a.href = URL.createObjectURL(blob);
        a.click();
      },

      /**
       * 关闭弹窗
       */
      close: function () {
        layer.close(this.cancelIndex);
      },
      /**
       *在无退款、充值、提现功能的条件下，点击查看跳转至对应订单号的正向订单详情页面
       * type 消费-商城购物传1，店铺退款传2，
       * @param {Object} orderNo,type
       */
      checkShop: function (orderNo, type, orderId) {
        if (type == 1) {
          this.$router.push({
            name: 'orderDetial',
            query: {
              id: orderId
            }
          })
        }
        if (type == 2) {
          this.$router.push({
            name: 'afterSaleDetial',
            query: {
              id: orderId
            }
          })
        }
      },

      /**
       * 分销记录查看
       * @param { Number} type 判断跳转页面 0订单详情，1售后详情
       */
      seeMarketDetial (type, orderId) {
        if(type == 1){
          this.$router.push({name:'orderDetial', query: {id: orderId}})
        }else {
          this.$router.push({name:'afterSaleDetial', query: {id: orderId}})
        }
      }
    }
  }
</script>
<style lang="less" scoped>
    @import url('../../assets/less/index.less');
    .m-search{
      border: 1px solid @color-border;
    }
    .section_b{
      border:none !important;
    }
    table thead{
      border: 1px solid @color-border;
      border-top: none;
    }
  table thead th {
    padding: 15px !important
  }
  table tbody tr, table thead tr {
    border: none !important;
    td, th{
      border: none !important;
    }
  }
  table tbody tr:nth-child(2n-1){
    background: #F9FAFC;
    &:hover{
      background: #F9FAFC !important;
    }
  }
  .content .section_b {
    // border: 1px solid #E8E8E9;
    background: #ffffff;
    margin-bottom: 20px;
    border-bottom: none;
  }

  .layui-table td,
  .layui-table th {
    padding: 20px 15px;
  }

  .green_loc {
    color: #1BA128;
    font-size: 12px;
  }

  .red_loc {
    color: #D21111;
    font-size: 12px;
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

/*** 顶部tab样式 ***/
.tab_header {
  border-bottom: none;
  .f_left.tab {
    span {
      display: inline-block;
      font-size: 14px;
      margin: 0 20px;
      line-height: 58px;
      padding: 0 10px;
    }
    span:first-child {
      margin-left: 30px;
    }
    span.actived {
      color: @color-orange;
      border-bottom: 2px solid @color-orange;
    }
  }
  .f_right.btn_white_orange {
    margin: 15px 20px;
  }
}


</style>
