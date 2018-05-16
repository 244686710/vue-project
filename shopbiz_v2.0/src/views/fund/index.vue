<template>
  <div class="g-main">
    <div class="title">我的资产</div>
    <ul class="m_panel total">
      <li :class="{'col-4': !flag}">
        <label for="" class="f_label">我的收入</label>
        <p>
          <span class="price f_bold f_orange">
            {{shopData!=''&&shopData.shopIncome>0?shopData.shopIncome+'元':'0.00 元'}}
          </span>
          <router-link class="handle f_right" :to="{path:'/fundDetial',query: {type: 0,status:1, isReset: true}}" tag="a">收支明细</router-link>
        </p>
      </li>
      <li :class="{'col-4': !flag}">
        <label for="" class="f_label">我的支出</label>
        <p>
          <span class="price f_bold f_orange">
            {{shopData!=''&&shopData.shopExpense>0?shopData.shopExpense+'元':'0.00 元'}}
          </span>
          <router-link class="handle f_right" :to="{path:'/fundDetial',query: {type: 4,status:1, isReset: true}}" tag="a">收支明细</router-link>
        </p>
      </li>
      <li v-show="flag == 1" :class="{'col-4': !flag}">
        <label for="" class="f_label">我的分销</label>
        <p>
          <span class="price f_bold f_orange">
            {{shopData!=''&&shopData.shopDistributionProfit>0?shopData.shopDistributionProfit+'元':'0.00 元'}}
          </span>
          <router-link class="handle f_right" :to="{path:'/fundDetial',query: {isMarket: true, isReset: true}}" tag="a">分销记录</router-link>
        </p>
      </li>
      <li :class="{'col-4': !flag}">
        <label for="" class="f_label">待结算金额</label>
        <p>
          <span class="price f_info f_bold">
            {{shopData!=''&&shopData.pendingAuditAmount>0?shopData.pendingAuditAmount+'&nbsp;元':'0.00 元'}}
          </span>
        </p>
      </li>
      <li :class="{'col-4': !flag}">
        <label for="" class="f_label">销售服务费
          <i class="tip">（销售费率{{shopData.settleRate*100}}%）</i>
        </label>
        <p>
          <span class="price f_info f_bold">
            {{shopData!=''&&shopData.saleServiceAmount>0?shopData.saleServiceAmount+'&nbsp;元':'0.00 元'}}
          </span>
        </p>
      </li>
    </ul>

    <div class="title" v-if="goodsStatus==0">待结算记录列表</div>
    <div class="title" v-if="goodsStatus==1">已结算记录列表</div>
    <div class="section_b">
      <ul class="m-subtab">
        <li v-bind:class="{active:goodsStatus==0}" @click="changeStatus(0)">待结算</li>
        <li v-bind:class="{active:goodsStatus==1}" @click="changeStatus(1)">已结算</li>
      </ul>

      <!-- form 查询 start-->
      <div class="m-search">
        <div class="layui-form">
          <div class="layui-form-item">

            <div class="layui-inline">
              <label for="" class="layui-form-label">结算月份：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input input_date" placeholder="请选择时间范围" v-model="search.dateScope" id="start" readonly>
              </div>
            </div>
            <!-- query & export -->
            <div class="btn_group f_right">
              <input type="button" class=" btn_light_orange query" value="查询" @click="loadList()" />
            </div>
          </div>
        </div>
      </div>
      <!-- form 查询 end-->

      <!-- table表格 -->
      <table class="layui-table" lay-skin="line" lay-even v-if="goodsStatus==0">
        <colgroup>
          <col width="340">
          <col>
          <col>
          <col>
        </colgroup>
        <thead>
          <tr class="border_top">
            <th>结算月份</th>
            <th>店铺销售额</th>
            <th>店铺退款金额</th>
            <th>销售服务费</th>
            <th style="min-width: 60px;">结算金额</th>
            <th>结算状态</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in dataList.list" :key="item.key">
            <td>{{item.settleMonth}}</td>
            <td><a class="handle f_center" @click="checkShop(item.settleMonth)">{{item.saleAmt | currency}}</a></td>
           <td><a href="javascript:;" :class="{handle: item.refundAmt>0}" @click="checkShop(item.settleMonth, item.refundAmt)">{{item.refundAmt | currency}}</a></td>
            <td>{{item.commissionAmt | currency}}</td>
            <td>{{item.settleAmt | currency}}</td>
            <td>{{item.settleStatus == 0 ? '待结算' : '已结算' }}</td>
          </tr>
        </tbody>
      </table>

      <table class="layui-table" lay-skin="line" lay-even v-if="goodsStatus==1">
        <colgroup>
          <col width="340">
          <col>
          <col>
          <col>
        </colgroup>
        <thead>
          <tr class="border_top">
            <th>结算订单编号</th>
            <th>结算月份</th>
            <th>店铺销售额</th>
            <th>店铺退款金额</th>
            <th style="min-width: 60px;">销售服务费</th>
            <th>结算金额</th>
            <th>结算状态</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in dataList.list" :key="item.key">
            <td>{{item.code}}</td>
            <td>{{item.settleMonth}}</td>
            <td><a class="handle f_center" @click="checkShop(item.settleMonth)">{{item.saleAmt | currency}}</a></td>
            <td><a href="javascript:;" :class="{handle: item.refundAmt>0}" @click="checkShop(item.settleMonth, item.refundAmt)">{{item.refundAmt | currency}}</a></td>
            <td>{{item.commissionAmt | currency}}</td>
            <td>{{item.settleAmt | currency}}</td>
            <td>{{item.settleStatus}}</td>
            <td>
              <a class="handle" @click="balance(item.settleId)">结算详情</a>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 结算 -->
      <div v-show="modal" id="balModal">
        <div class="modal_cont">
          <span class="span">结算详情</span>
          <div class="modal_type">
            <em class="modal_name">结算店铺编号：</em>
            <i class="modal_do">{{res.shopCode}}</i>
          </div>
          <div class="modal_type">
            <em class="modal_name">结算店铺名称：</em>
            <i class="modal_do">{{res.shopName}}</i>
          </div>
          <div class="modal_type">
            <em class="modal_name">结算月份：</em>
            <i class="modal_do">{{res.settleMonth}}</i>
          </div>
          <div class="modal_type mb_20">
            <em class="modal_name">结算金额：</em>
            <i class="modal_do">￥{{res.settleAmt}}</i>
          </div>
        </div>
        <div class="modal_cont">
          <span class="span">收款方信息</span>
          <div class="modal_type">
            <em class="modal_name">开户行：</em>
            <i class="modal_do">{{res.payeeBranchName}}</i>
          </div>
          <div class="modal_type">
            <em class="modal_name">
              <i>银行账号</i>：</em>
            <i class="modal_do">{{res.payeeBankCardNo}}</i>
          </div>
          <div class="modal_type mb_20">
            <em class="modal_name">
              <i v-if="res.shopType == 1">公司名称</i>
              <i v-if="res.shopType == 0">持卡人姓名</i>：</em>
            <i class="modal_do">{{res.payeeName}}</i>
          </div>
        </div>
        <div class="modal_cont modal_cont_last">
          <span class="span">付款方信息</span>
          <div class="modal_type">
            <em class="modal_name">户名：</em>
            <i class="modal_do">{{res.payerName}}</i>
          </div>
          <div class="modal_type">
            <em class="modal_name">
              <i class="red_loc">*</i>开户行：</em>
            <i class="modal_do">{{res.payerBranchName}}</i>
          </div>
          <div class="modal_type">
            <em class="modal_name">
              <i class="red_loc">*</i>账号：</em>
            <i class="modal_do">{{res.payerBankCardNo}}</i>
          </div>
          <div class="modal_type">
            <em class="modal_name">
              <i class="red_loc">*</i>转账流水号：</em>
            <i class="modal_do">{{res.tradeFlowNo}}</i>
          </div>
          <div class="modal_type">
            <em class="modal_name">金额：</em>
            <i class="modal_do"> {{res.settleAmt}}元</i>
          </div>
          <div class="modal_type">
            <em class="modal_name">付款时间：</em>
            <i class="modal_do">{{res.paymentTime}}</i>
          </div>
        </div>
      </div>

    </div>
    <!-- 分页 -->
    <div class="pager  clearfix margin_bottom40">
      <pager class="f_right page_box" :options="pageInfo" @changePagerNum="recievePage"></pager>
      <div v-show="pageInfo.total == 0" class="text_center">当前没有任何数据</div>
    </div>
  </div>
</template>
<script>
  import fetchJson from '../../api/http';
  import fund from '../../api/fund';
  import bus from '../../assets/bus' // 获取组件通信

  export default {

    name: "FundIndex",
    data() {
      return {
        flag: 0,
        modal: false, //弹窗默认隐藏
        cancelIndex: '',
        /* 弹窗索引 */
        goodsStatus: 0, //汇总标志（0日汇总，1月汇总）
        dataList: [],
        shopData: '',
        pageInfo: {
          total: 0,
          offset: 1,
          limit: 20
        },
        search: {
          dateScope: '',
          startSettleMonth: '',
          endSettleMonth: '',
          settleMonth: '',
        },
        res: {},
      }
    },
    created: function () {
      this.getShopAsset(); //获取资产概况
      this.getPageList();
      setTimeout(this.initDate, 0);
      this.getMarketFlag(); //
    },
    methods: {
      /**
       * @param {number} refundAmt 大于0时查看退款详情
       * 点击店铺销售额跳转到当前月已完成订单页面
       */
      checkShop (curTime, refundAmt) {
        var now = curTime;
        var year = now.substring(0,4);
        var month = now.substring(5,now.length-1);
        var curStartTime = year+"-"+month+"-"+1+" "+"00:00:00";
        var endDay = this.getLastDay(year,month);
        var curEndTime = year+"-"+month+"-"+endDay+" "+"23:59:59";
        if (refundAmt != undefined) {
          if (refundAmt<0) {
            return '';
          } else {
            this.$router.push({path:'/fundDetial',query: {type:'refundAmt',curStartTime:curStartTime,curEndTime:curEndTime}});
          }
        } else {
          this.$router.push({path:'/fundDetial',query: {type:'saleAmt',curStartTime:curStartTime,curEndTime:curEndTime}});
        }

      },
      /* 获取一个月的最后一天 */
      getLastDay(year,month){
         var new_year = year;        //取当前的年份
         var new_month = month++;    //取下一个月的第一天，方便计算（最后一天不固定）
         if(month>12){                //如果当前大于12月，则年份转到下一年
              new_month -=12;            //月份减
              new_year++;                //年份增
         }
         var new_date = new Date(new_year,new_month,1);   // 取当年当月的 下个 月中的第一天
         // 获取当月最后一天日期
         return (new Date(new_date.getTime()-1000*60*60*24)).getDate();
      },
      /**
       * 初始化日期插件
       */
      initDate() {
        var self = this
        /*日历控件*/
        var start = {
          elem: '#start',
          format: 'yyyy-MM',
          //min: laydate.now(),   //设定最小日期为当前日期
          max: '2099-12-31', // 最大日期
          istoday: true,
          istime: true,
          isclear: true,
          // isclear: true,
          theme: '#FA8C64',
          range: '~',
          type: "month",
          done: function (datas) {
            self.search.dateScope = datas;
            let date = datas.split('~')
            self.search.startSettleMonth = date[0].trim();
            self.search.endSettleMonth = date[1].trim();
          }
        };

        layui.use('laydate', function () {
          var laydate = layui.laydate;
          laydate.render(start);
        });

      },

      /**
       * 切换状态栏0,1
       * 搜索数据清空
       * @param {Object} params
       */
      changeStatus(obj) {
        let self = this;
        self.goodsStatus = obj
        self.search.dateScope="";
        self.pageInfo.offset = 1;
        self.search.startSettleMonth = ''
        self.search.endSettleMonth = ''
        self.getPageList();
      },

      /**
       * 切换状态栏0,1
       * 搜索数据清空
       */
      async getShopAsset() {
        let self = this;
        const res = await fetchJson.post(fund.getShopAsset, 'params', {})
        if (res.statusCode == 200) {
          self.shopData = res.responseContent
        }
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
       *settleStatus 结算状态（0.待结算/1.已结算）
       * @param {String} folderId
       */
      async getPageList(folderId) {
        let self = this
        let offset = self.pageInfo.offset;
        let limit = self.pageInfo.limit
        let loading = layer.load(2);
        let params = {
          settleStatus: self.goodsStatus,
          startSettleMonth: self.search.startSettleMonth,
          endSettleMonth: self.search.endSettleMonth,
          offset: self.pageInfo.offset,
          limit: self.pageInfo.limit,
        }
        const res = await fetchJson.post(fund.getShopList, 'params', params)
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
      /**
       * 结算凭证
       * @param {Number} id
       */
      async balance(id) {
        let self = this
        const res = await fetchJson.post(fund.getSettleVoucher, 'params', {settleId:id})
        if (res.statusCode == 200) {
          self.res = res.responseContent
        }
        self.cancelIndex = self.$utils.layerOpen({
          title: '结算凭证',
          height: '750px',
          width: '580px',
          content: $('#balModal'),
        })
      },
      /**
       * 关闭弹窗
       */
      close: function () {
        layer.close(this.cancelIndex);
      },
    }
  }

</script>
<style lang="less" scoped>
  @import url('../../assets/less/index.less');
  .m_panel {
    background: @color-white;
  }

  .f_label {
    .tip {
      color: @color-error;
      font-size: 10px;
    }
  }
  table thead th {
    padding: 15px !important
  }
  table tbody tr {
    border: none !important;
    td{
      border: node!important
    }
  }
  table tbody tr:nth-child(2n-1){
    background: #F9FAFC;
    &:hover{
      background: #F9FAFC !important;
    }
  }
  .total {
    overflow: hidden;
    border: 1px solid @color-border;
    border-right: none;
    li {
      box-sizing: border-box;
      float: left;
      width: 20%;
      height: 120px;
      padding: 10px 20px;
      border-right: 1px solid @color-border;

      p {
        padding-top: 50px;
        line-height: 20px;
        .price {
          font-size: 20px;
        }
      }
    }
  } // tab
  .m-subtab {
    padding-top: 16px;
    border-bottom: 1px solid @color-border
  }

  .layui-table td,
  .layui-table th {
    padding: 20px 15px;
  }

  #balModal {
    .modal_cont {
      border-bottom: 1px solid #f8f8f8;
      span{
        text-align:left;
      }
    }
    .modal_cont_last{
      padding-bottom:30px;
    }
    .modal_type {
      clear: both;
      overflow: hidden;
    }
    .span::before {
      content: "|";
      width: 3px;
      height: 12px;
      font-size: 12px;
      color: #ff6600;
      background-color: #ff6600;
      border-radius: 1px;
      margin-right: 10px;
    }
    .span {
      color: #999;
      font-weight: bold;
      font-size: 14px;
      display: block;
      padding-left: 20px;
      padding-top: 20px;
    }
    .modal_title {
      font-size: 14px;
      color: #333;
      display: block;
      float: left;
      padding-left: 30px;
      padding-top: 20px;
      width: 142px;
      height: 40px;
      line-height: 40px;
    }
    .input {
      width: 288px;
      height: 40px;
      background-color: #ffffff;
      box-shadow: inset 1px 0px 5px 0px rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      border: solid 1px #cccccc;
      padding-left: 10px;
      margin-top: 18px;
    }
    .modal_name {
      font-size: 14px;
      color: #333;
      display: block;
      float: left;
      padding-left: 30px;
      padding-top: 20px;
      width: 142px;
    }
    .modal_do {
      font-size: 14px;
      color: #666;
      display: block;
      float: left;
      padding-top: 20px;
    }
    .modal_do_money {
      font-size: 14px;
      color: #666;
      display: block;
      float: left;
      padding-top: 30px;
    }
  }

  .mb_20 {
    margin-bottom: 20px;
  }
  .col-4{
    width: 25
  }
</style>
