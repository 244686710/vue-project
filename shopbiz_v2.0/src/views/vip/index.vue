<template>
   <div class="g-main">
    <div class="title">会员管理</div>
    <div class="section_b">
       <!-- form 查询 start-->
      <div class="m-search">
        <div class="layui-form">
          <div class="layui-form-item">
            <div class="layui-inline">
              <label for="" class="layui-form-label">会员昵称：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model.trim="model.nickName">
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">手机号码：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model.trim="model.mobile">
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">最近登录时间：</label>
              <div class="layui-input-inline">
                <my-date v-model="model.beginTime" class="input_date" @input="startTimeChange" placeholder="开始时间" ref="startTime" :isTime="false"
                  dateFormat="yyyy-MM-dd HH:mm:ss"></my-date>
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
              <input type="button" class=" btn_light_orange query" @click="queryData()" value="查询" />
              <input type="button" class="f_right btn_light_orange query" value="导出" @click="exportData()"/>
            </div>
          </div>
        </div>
      </div>
      <!-- form 查询 end-->

      <!-- table表格 -->
       <table class="layui-table">
          <colgroup>
            <col width="340">
            <col>
            <col>
            <col>
          </colgroup>
          <thead>
            <tr class="border_top">
              <th>用户昵称</th>
              <th>手机号码</th>
              <th>最近登录时间</th>
              <th style="min-width: 60px;">成交订单笔数</th>
              <th>消费金额</th>
              <th>积分消耗</th>
              <th>积分余额</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in dataLists" :key="item.id">
              <td>
                {{item.nickName}}
              </td>
              <td>
                {{item.mobile}}
              </td>
              <td>{{item.lastLoginDate}}</td>
              <td><a class="handle" @click="toOrderList(item.id)">{{item.orderCount || '0'}}</a></td>
              <td>{{item.orderAmt | currency}}</td>
              <td>{{item.integralDeductionAmount || 0 }}</td>
              <td>{{item.integralBalance || 0 }}</td>

            </tr>
          </tbody>
        </table>
    </div>

    <!-- 分页 -->
    <div class="pager clearfix">
      <pager class="f_right page_box" :options="pageInfo" @changePagerNum="recievePage"></pager>
      <div v-show="pageInfo.total == 0 && !isLoading" class="text_center">当前没有任何数据</div>
      <div v-show="isLoading" class="text_center">正在获取列表数据...</div>
    </div>

      <!-- exprot dialog -->
    <div class="hide export_dialog" id="exportDialog">
      <ul>
        <li>
          <label for="">用户昵称：</label>{{model.nickName || '--'}}
        </li>
        <li>
          <label for="">手机号码：</label>{{model.mobile || '--'}}
        </li>
        <li>
          <label for="">最近登录时间：</label> {{model.beginTime || '--'}} 至 {{model.endTime || '--'}}
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
              <input type="text" v-model="max" @keyup="max = max ? max.replace(/\D/g,''): ''"/>
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
import MyDate from '../../components/Date.vue';
export default {
  name: 'VipIndex',
  components: {MyDate},
  data () {
    return {
      isLoading: true,
      dataLists: [],
      exportTotal: 0,
      model: {
        beginTime: '',
        endTime: '',
        mobile: '',
        nickName: '',
      },
      max: '',
      min: '',
      pageInfo: {
        total: 0,
        offset: 1,
        limit: 20
      }
    }
  },
  mounted () {
    this.getList();
  },
  methods: {
    // 获取列表
    async getList() {
      this.isLoading = true
      let loading = layer.load(2)
      let params = {
        ...this.model,
        limit: this.pageInfo.limit,
        offset: this.pageInfo.offset,
      }
      const res = await fetchJson.post(api.getVipList, 'params', params);
      this.isLoading = false
      layer.close(loading);
      if( res.statusCode == 200 ){
        this.pageInfo.total = res.responseContent.total;
        this.dataLists = res.responseContent.list;
      }
    },
    // 查询列表
    queryData() {
      this.getList();
    },
    // 导出列表
    async exportData(){
        let params = {
          ...this.model,
          offset: 1,
          limit: 1,
        }
        const res = await fetchJson.post(api.getVipList, 'params', params)
        if(res.statusCode ==200 && res.responseContent.total> 0){
          this.exportTotal = res.responseContent.total;
          let dialog = this.$utils.layerOpen({
            title: '导出会员列表',
            height: '360px',
            width: '650px',
            content: $('#exportDialog'),
          })
        }else if(res.statusCode ==200 && res.responseContent.total == 0){
          this.$utils.layerMsg.warning('当前条件无可导出的订单！');
        }
    },
    async exportOrder () {
      let that = this;
     if(Number(this.min)> Number(this.exportTotal)|| Number(this.max)>Number(this.exportTotal)){
          this.$utils.layerMsg.warning(`输入数据有误，最大可导出${this.exportTotal}条`);
          return;
        }
      if(this.max>0 && this.min>0 && Number(this.max)>=Number(this.min)&& Number(this.max)-Number(this.min)<1000){

      }else {
        this.$utils.layerMsg.error('请输入正确的导出值，开始值要大于等于1,结束值大于等于开始值，单次最多导出1000条');
        return ;
      }
      let params = {
        ...this.model,
        start: this.min,
        end: this.max
      };
      const res = await fetchJson.export(api.exportVipList, params)
      layer.closeAll();
        this.min = '';
        this.max ='';
        var blob = new Blob([res], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
      });
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.download = "会员列表.xlsx";
      a.href = URL.createObjectURL(blob);
      a.click();
    },

     /**
     * 分页器
     * @param {Number} msg 分页数
     * */
    recievePage(msg) {
      this.pageInfo.offset = msg;
      this.getList();
    },

    /**
     *查看会员订单
     */
    toOrderList (id) {
      this.$router.push({name: 'finishOrder', query: {userId: id}})
    },

    // 日期切换
    endTimeChange(value) {
      if (this.model.beginTime) {
        if(Date.parse(new Date(value)) < Date.parse(new Date(this.model.beginTime))) {
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
  }
}
</script>
<style lang="less" scoped>
 @import url('../../assets/less/variable.less');
 .section_b{
   border: none !important
 }
  .m-search{
    border: 1px solid @color-border;
    border-bottom: none
  }
 .layui-table td{
   padding: 20px 15px;
 }
 .layui-table th{
   padding: 15px
  }

  .layui-table {
    margin: 0;
  }
  .layui-form-item {
    margin-bottom: 0;
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

  table{
    border: none !important;
  }

  table tr, th, td {
    border: none !important
  }
  table thead{
    border: 1px solid @color-border;
  }
  table tbody tr:nth-child(2n-1){
    background: #F9FAFC;
    &:hover{
      background: #F9FAFC !important;
    }
  }

</style>
