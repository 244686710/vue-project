<template>
  <div>
    <div class="title">对账单</div>
    <div class="section_b">
      <ul class="m-subtab">
        <li v-bind:class="{active:goodsStatus==0}" @click="changeStatus(0)">日汇总</li>
        <li v-bind:class="{active:goodsStatus==1}" @click="changeStatus(1)">月汇总</li>
      </ul>

      <!-- form 查询 start-->
      <div class="m-search">
        <div class="layui-form">
          <div class="layui-form-item">

            <div class="layui-inline">
              <label for="" class="layui-form-label" v-if="goodsStatus == 0">结算日期：</label>
              <label for="" class="layui-form-label" v-if="goodsStatus == 1">结算月份：</label>
              <div class="layui-inline layui-unselect layui-form-select ml_20" v-show="goodsStatus == 0">
                <input class="layui-input" placeholder="" id="start" v-model="time" readonly>
                <i class="layui-edge"></i>
              </div>
              <div class="layui-inline layui-unselect layui-form-select ml_20" v-show="goodsStatus == 1">
                <input class="layui-input" placeholder="" id="end" v-model="time" readonly>
                <i class="layui-edge"></i>
              </div>
            </div>
            <!-- query & export -->
          </div>
        </div>
      </div>
      <!-- form 查询 end-->

      <!-- table表格 -->
      <table class="layui-table" lay-skin="line">
        <colgroup>
          <col width="340">
          <col>
          <col>
          <col>
        </colgroup>
        <thead>
          <tr class="border_top">
            <th>结算日期</th>
            <th>收入（元）</th>
            <th>支出（元）</th>
            <th style="min-width: 60px;">操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in dataList.list" :key="item.key">
            <td>{{item.createTime}}</td>
            <td class="green_loc">
              <i v-if="item.income != 0">+￥</i>{{item.income}}</td>
            <td class="red_loc">
              <i v-if="item.expense != 0">-￥</i>{{item.expense}}</td>
            <td>
              <a class="handle" @click="checkShop(item.createTime)">查看</a>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
    <!-- 分页 -->
    <div class="pager clearfix margin_bottom40">
      <pager class="f_right page_box" :options="pageInfo" @changePagerNum="recievePage"></pager>
      <div v-show="pageInfo.total == 0" class="text_center">当前没有任何数据</div>
    </div>
  </div>
</template>
<script>
  import fetchJson from '../../api/http';
  import fund from '../../api/fund';

  export default {
    name: "FundCheck",
    data () {
      return {
        goodsStatus: 0, // 汇总类型（0.日汇总/1.月汇总）
        dataList: [],
        pageInfo: {
          total: 0,
          offset: 1,
          limit: 20
        },
        time: '',
        search: {
          startTime: '',
          endTime: ''
        }
      }
    },
    mounted: function () {
      this.initDate(); // 初始化日期插件
      this.getPageList();
    },
    methods: {
      /**
       * 初始化日期插件
       */
      initDate() {
        var self = this
        /*日历控件*/
        var start = {
          elem: '#start',
          format: 'yyyy-MM-dd',
          //min: laydate.now(), //设定最小日期为当前日期
          max: '2099-06-16', // 最大日期
          istoday: true,
          istime: true,
          isclear: true,
          range: '~',
          type: "date",
          theme: '#FA8C64',
          done: function (datas) {
            let date = datas.split('~')
            self.time = datas;
            self.search.startTime = date[0] && date[0].trim();
            self.search.endTime = date[1] && date[1].trim();
            self.loadList()
          },
        };

        // laydate_clear
        var end = {
          elem: '#end',
          //min: laydate.now(),
          format: 'yyyy-MM',
          max: '2099-06-16',
          istoday: true,
          istime: true,
          isclear: true,
          range: '~',
          type: "month",
          theme: '#FA8C64',
          done: function (datas) {
            let date = datas.split('~')
            self.time = datas;
            self.search.startTime = date[0] && date[0].trim();
            self.search.endTime = date[1] && date[1].trim();
            self.loadList()
          }
        };
        layui.use('laydate', function () {
          var laydate = layui.laydate;
          laydate.render(start);
          laydate.render(end);
        });

      },

      // 查看
      checkShop(curTime) {
        //根据当前时间获取当前日或者当前月
        if (this.goodsStatus == 0) {
          var curStartTime = curTime + ' 00:00:00';
          var curEndTime = curTime + ' 23:59:59';
        }
        if (this.goodsStatus == 1) {
          var now = curTime;
          var year = now.substring(0, 4);
          var month = now.substring(5, 7);
          var curStartTime = year + "-" + month + "-" + 1 + " " + "00:00:00";
          var endDay = this.getLastDay(year, month);
          var curEndTime = year + "-" + month + "-" + endDay + " " + "23:59:59";
        }
        this.$router.push({
          path: '/fundDetial',
          query: {
            timeType: this.goodsStatus,
            curStartTime: curStartTime,
            curEndTime: curEndTime,
            isReset: true
          }
        });
      },
      /* 获取一个月的最后一天 */
      getLastDay(year, month) {
        var new_year = year; //取当前的年份
        var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
        if (month > 12) { //如果当前大于12月，则年份转到下一年
          new_month -= 12; //月份减
          new_year++; //年份增
        }
        var new_date = new Date(new_year, new_month, 1); // 取当年当月的 下个 月中的第一天
        // 获取当月最后一天日期
        return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();
      },
      /**
       * 切换状态栏0,1
       * 搜索数据清空
       * @param {Object} params
       */
      changeStatus(obj) {
        let self = this;
        self.goodsStatus = obj
        self.pageInfo.offset = 1;
        self.time = ''
        self.search.startTime = ''
        self.search.endTime = ''
        self.getPageList();
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
       * @param {String} folderId
       */
      async getPageList(folderId) {
        let self = this
        let offset = self.pageInfo.offset;
        let limit = self.pageInfo.limit
        let loading = layer.load(2);
        let params = {
          flag: self.goodsStatus,
          startTime: self.search.startTime,
          endTime: self.search.endTime,
          offset: self.pageInfo.offset,
          limit: self.pageInfo.limit,
        }
        const res = await fetchJson.post(fund.getTransSummaryList, 'params', params)
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
      loadList () {
        let self = this
        self.pageInfo.offset = 1
        self.getPageList()
      }
    }
  }
</script>
<style lang="less" scoped>
  @import url('../../assets/less/index.less');
  .m-subtab {
    padding-top: 16px;
    border: 1px solid @color-border;
    border-bottom: none
  }

  .layui-table td,
  .layui-table th {
    padding: 20px 15px;
  }

  .m-search .layui-form-item .layui-inline {
    margin-right: 10px;
    margin-bottom: 5px;
  }

  .layui-input {
    width: 220px;
  }

  .m-search {
    border: 1px solid @color-border;
  }

  .section_b {
    border: none !important;
  }

  table thead {
    border: 1px solid @color-border;
    border-top: none;
  }

  table thead th {
    padding: 15px !important
  }

  table tbody tr,
  table thead tr {
    border: none !important;
    td,
    th {
      border: none !important;
    }
  }

  table tbody tr:nth-child(2n-1) {
    background: #F9FAFC;
    &:hover {
      background: #F9FAFC !important;
    }
  }

</style>
