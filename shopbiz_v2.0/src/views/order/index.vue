<template>
  <div class="g-main" @click="offSelete()">
    <div class="title">全部订单</div>
    <div class="section_b">
      <!-- form 查询 start-->
      <div class="m-search">
        <div class="layui-form">
          <div class="layui-form-item">
            <div class="layui-inline">
              <label for="" class="layui-form-label">订单编号：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model.trim="model.orderNo">
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">收货人姓名：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model.trim="model.receivePerson">
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">收货人手机：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model.trim="model.receivePhone">
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">付款方式：</label>
              <div class="layui-input-inline">
                <my-select class="inline_block selcet_box" ref="refPayType" v-model="model.payType" :options="selectPayType"></my-select>
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">订单类型：</label>
              <div class="layui-input-inline">
                <my-select class="inline_block selcet_box" ref="refOrderType" v-model="model.supplierType" :options="selectOrderType"></my-select>
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">配送方式：</label>
              <div class="layui-input-inline">
                <my-select class="inline_block selcet_box" ref="refSendType" v-model="model.sendType" :options="selectSendType"></my-select>
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">下单时间：</label>
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
            <div class="layui-inline">
              <a class="f_blue font_14 f_left" href="javascript:;" @click="subSectionDay(7)">近7天</a>
              <a class="f_blue font_14 f_left last" href="javascript:;" @click="subSectionDay(30)"> 近30天</a>
            </div>

            <!-- query & export -->
            <div class="btn_group f_right">
              <input type="button" class=" btn_light_orange query" value="查询" @click="queryData()" />
              <input type="button" class="f_right btn_light_orange query" value="导出" @click="exportData()" />
            </div>
          </div>
        </div>
      </div>
      <!-- form 查询 end-->

      <div class="m-tab">
        <ul class="m-subtab">
          <li :class="{active: model.status == orderType.value }" @click="changeStatusLists(orderType.value)" v-for="(orderType, index) in orderTypes" :key="`orderType${index}`">{{orderType.title}}</li>
        </ul>
      </div>
    </div>

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
            <th>订单类型</th>
            <th style="min-width: 60px;">订单状态</th>
            <th>付款方式</th>
            <th style="min-width: 60px;">配送方式</th>
            <th style="min-width: 60px;">操作</th>
          </tr>
        </thead>

        <tbody v-for="orderList in orderLists.list" :key="orderList.id">
          <tr>
            <th colspan="9">
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
                  <span v-show="orderList.orderSupplierType == 2">
                  <span class="badge_orange f_left" > 分销</span>&nbsp;&nbsp;
                  </span>
                  <p class="inline_block text-ellipsis" v-show="index<2"  v-for="(sku,index) in item.skuList" :key="sku.attrName">{{sku.attrName | strLenght(5)}}: {{sku.attrValName | strLenght(5)}}&nbsp;&nbsp;&nbsp;&nbsp;</p>
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
              {{orderList.receivePerson}}<br>
              {{orderList.receivePhone}}

            </td>
            <td class="border_right">{{orderList.orderSupplierTypeDesc || '--'}}</td>
            <td class="border_right">{{orderList.statusDesc}}</td>
            <td class="border_right">{{orderList.payType | payType}}</td>
            <td class="border_right">{{orderList.sendType | sendType}}</td>
            <td class="border_right">
              <p href="javascript:;" v-if="orderList.status == 1 && orderList.sendType == 1 && orderList.supplierId<1" class="handle" @click="changeDeliveryPrice(orderList)">改运费</p>
              <p v-if="orderList.status == 2 && orderList.supplierId<1&&orderList.payType!=5">
                <input type="button" class=" btn_light_orange w80 margin_bottom10" value="发货" @click="send(orderList)"/>
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
      <div v-show="pageInfo.total == 0 && !isLoading" class="text_center">当前没有任何数据</div>
      <div v-show="isLoading" class="text_center">正在获取列表数据...</div>
    </div>

    <!-- 修改运费 dialog -->
    <div class="hide change_dialog" id="changeDialog">
      <label for="">邮费：</label>
      <input type="text" v-model="model.amount" @change="writePrice('amount')" @keyup="model.amount = model.amount ? model.amount.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,''): ''" maxlength="5">
    </div>

    <!-- exprot dialog -->
    <div class="hide export_dialog" id="exportDialog">
      <ul>
        <li>
          <label for=""> 订单编码：</label>{{model.orderNo || '--'}}
        </li>
        <li>
          <label for="">收货人姓名：</label>{{model.receivePerson || '--'}}
        </li>
        <li>
          <label for="">收货人手机：</label>{{model.receivePhone || '--'}}
        </li>
        <li>
          <label for="">订单状态：</label>{{model.status | orderType}}
        </li>
        <li>
          <label for="">下单时间：</label> {{model.startTime || '--'}} 至 {{model.endTime || '--'}}
        </li>
        <li>
          <label for="">付款方式：</label> {{model.payType | payType}}
        </li>
        <li>
          <label for="">订单类型：</label> {{model.supplierType | supplierType}}
        </li>
        <li>
          <label for="">配送方式：</label> {{model.sendType | sendType}}
        </li>
        <li class="clearfix count">
          <div class="clearfix">
            <label for="" class="f_left">选择导出数量</label>
            <div class="layui-input-inline f_left">
              <input type="text" v-model="model.min" @keyup="model.min = model.min ? model.min.replace(/\D/g,''): ''">&nbsp;&nbsp;
            </div>
            <div class="layui-form-mid">
              <i class="separator"></i>
            </div>
            <div class="layui-input-inline f_left">
              <input type="text" v-model="model.max" @keyup="model.max = model.max ? model.max.replace(/\D/g,''): ''"/>
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

    <!-- send dialog -->
    <div class="hide send_default select_h150" id="sendDefault">
      <ul>
        <li>
          <label for="">物流公司：</label>
          <my-select class="inline_block selcet_box" ref="refFacType" v-model="model.deliveryCompanyId" :options="deliveryFactoryLists"></my-select>
        </li>
        <li>
          <label for="">运单号码：</label>
          <input type="text" v-model="model.deliveryNo" @change="model.deliveryNo == ''? deliveryNoError = true : deliveryNoError = false" maxlength="20">
          <p v-show="deliveryNoError" class="c_error error_tip"> <label for=""></label>&nbsp;运单号码不可以为空</p>
        </li>
      </ul>
    </div>
    <div class="hide send_dummy" id="sendDummy">
      <label for="">发货说明：</label>
      <textarea name="" id="" cols="30" rows="10" maxlength="200" v-model="model.sendDummy" placeholder="请输入不要超过200字的说明"></textarea>
    </div>
  </div>
</template>
<script>
  import fetchJson from "../../api/http";
  import api from "../../api/api";
  import MySelect from "../../components/Select.vue";
  import MyDate from '../../components/Date.vue';
  export default {
    name: 'OrderIndex',
    components: {
      MySelect,
      MyDate
    },
    data () {
      return {
        deliveryNoError: false, // 运单验证信息 是否显示
        exportTotal: 0, // 可导出数量
        isLoading: true, // 加载中
        flag:0,//默认未设置免支付权限
        pageInfo: {
          total: 0, // 总条数
          offset: 1, // 当前页面
          limit: 20 // 页面尺寸
        },
        deliveryFactoryLists: {
          size: {h:'40px', w: '400px'},
          selectOptions:[{
            Value: 0,
            Text: "请选择"
          }]
        },
        orderLists: [], // 订单列表数据
        orderTypes: [{
            value: '',
            title: '全部'
          },
          {
            value: '1',
            title: '待付款'
          },
          {
            value: '9',
            title: '审核中'
          },
          {
            value: '2',
            title: '待发货'
          },
          {
            value: '3',
            title: '待收货'
          },
          {
            value: '4',
            title: '已完成'
          },
          {
            value: '5',
            title: '已关闭'
          },
        ],
        selectPayType: {
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
              Text: "微信"
            },
            {
              Value: "2",
              Text: "支付宝"
            },
            {
              Value: "3",
              Text: "京东快捷支付"
            },
            {
              Value: "4",
              Text: "积分支付"
            }
          ]
        },
        selectSendType: {
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
            Text: "普通快递"
          },
          {
            Value: "2",
            Text: "虚拟发货"
          }]
        },
        selectOrderType: {
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
            Text: "普通订单"
          },
          {
            Value: "2",
            Text: "分销订单"
          }]
        },
        model: {
          userId: '',
          orderNo: '', // 订单编号;
          receivePerson: '', // 收货人姓名
          receivePhone: '', // 收货人电话
          supplierType: 0, // 订单类型
          payType: 0, // 付款方式
          sendType: 0, // 发货方式
          status: 0, // 订单状态
          amount: '', // 运费
          min: '',
          max: '',
          deliveryCompanyId: 0, // 运输公司Id
          deliveryNo: '', // 运单号
          sendDummy: '', // 虚拟发货商品描述
          startTime: '',
          endTime: ''
        }
      }
    },
    created:function(){
        //获取vip免密支付设置信息
        this.shopVipFlag();
    },
    mounted: function () {
      this.getOrderList();
      this.getDeliveryLists()
    },

    // activated () {
    //   this.getOrderList();
    // },
    methods: {
      // 下拉列表关闭
      offSelete () {
        this.$refs.refPayType.offSelect()
        this.$refs.refOrderType.offSelect()
        this.$refs.refSendType.offSelect()
        this.$refs.refFacType.offSelect()
      },

      recievePage (msg) {
        this.pageInfo.offset = msg;
        this.getOrderList();
      },

      // 获取物流公司信息
      async getDeliveryLists() {
        const res = await fetchJson.post(api.deliveryList, 'params', {})
        let that = this;
        if(res.statusCode == 200) {
          res.responseContent.list.map( item => {
            that.deliveryFactoryLists.selectOptions.push(
              {Value: item.id, Text: item.name}
            )
          })
        }
        that.deliveryFactoryLists = Object.assign({}, that.deliveryFactoryLists)
      },

      // 日期切换
      endTimeChange(value) {
        if (this.model.startTime) {
          Date.parse(new Date(value)) < Date.parse(new Date(this.model.startTime)) ? layer.msg('结束时间必须大于开始时间', {
            icon: 0
          }) : ''
        }
      },
      startTimeChange(value) {
        if (this.model.endTime) {
          Date.parse(new Date(value)) > Date.parse(new Date(this.model.endTime)) ? layer.msg('开始时间必须小于结束时间', {
            icon: 0
          }) : ''
        }
      },

      // 价格格式化
      writePrice (key) {
        var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
        if(this.model[key]){
          var val = this.model[key];
          if (reg.test(val)) {
            if (val.toString().indexOf('.') == -1 && val.toString().length <= 6) {
              this.model[key] = parseFloat(val).toFixed(2);
            }
          } else {
            return;
          }
        }
        this.model = Object.assign({}, this.model)
      },

      //获取某段时间范围
      checkDate(t) {
        return t >= 10 ? t : '0' + t;
      },

      /**
       *发货
       * param {Object} orderList
       */
      send(orderList) {
        let that = this;
        if(orderList.sendType == 1){ // 普通发货
          let dialog = this.$utils.layerOpen({
            title: '发货信息',
            height: '380px',
            width: '650px',
            content: $('#sendDefault'),
            btn: ['提交'],
            yes: async() => {
              if(!that.model.deliveryCompanyId){
                 that.$utils.layerMsg.warning('请选择物流公司！')
                 return;
              }
              if(!that.model.deliveryNo){
                that.deliveryNoError = true
                return false;
              }
              let data = {
                orderId: orderList.id,
                deliveryNo: that.model.deliveryNo,
                deliveryCompanyId: that.model.deliveryCompanyId,
                sendType: orderList.sendType
              }
              const res = await fetchJson.post(api.orderSend, 'params', data)
              if (res.statusCode == 200) {
                that.$utils.layerMsg.success('发货成功')
                layer.close(dialog);
                that.getOrderList() // 刷新列表
                that.model.deliveryNo = '';
                that.model.deliveryCompanyId = 0
              } else {
              }
            },
            cancel () {
              that.deliveryNoError =false
              that.model.deliveryNo = '';
              that.model.deliveryCompanyId = 0
            }
          })

        }else{ // 虚拟发货
           let dialog = this.$utils.layerOpen({
            title: '发货信息',
            height: '340px',
            width: '650px',
            content: $('#sendDummy'),
            btn: ['提交'],
            yes: async() => {
              if(!that.model.sendDummy){
                that.$utils.layerMsg.warning('发货说明不可以为空');
                return ;
              }
              let data = {
                orderId: orderList.id,
                deliveryNo: '',
                deliveryCompanyId: '',
                sendType: orderList.sendType,
                deliveryDesc: that.model.sendDummy
              }
              const res = await fetchJson.post(api.orderSend, 'params', data)
              if (res.statusCode == 200) {
                that.$utils.layerMsg.success('发货成功')
                that.model.sendDummy = '';
                layer.close(dialog);
                that.getOrderList()
              }
            },
            cancel () {
              that.model.sendDummy = '';
            }
          })
        }

      },

      getDate(index) {
        let date = new Date(); //当前日期
        let newDate = new Date();
        newDate.setDate(date.getDate() + index); //官方文档上虽然说setDate参数是1-31,其实是可以设置负数的
        var time = newDate.getFullYear() + "-" + this.checkDate(newDate.getMonth() + 1) + "-" + this.checkDate(newDate.getDate());
        return time;
      },
      // 时间分段
      subSectionDay(day) {
        // $("#start").val('2018-08-08 12:20');
        let now = new Date();
        let nowTime = now.getFullYear() + "-" + this.checkDate(now.getMonth() + 1) + "-" + this.checkDate(now.getDate());
        this.model.startTime = this.getDate(-day) + ' 00:00:00';
        this.model.endTime = nowTime + ' 23:59:59';
        this.model = Object.assign({}, this.model);
        this.getOrderList();
      },

      // 查看订单详情
      toDetial(id) {
        //将查询信息存储
        sessionStorage.setItem('order',JSON.stringify(this.model))
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
      toEstimate(id, no) {
        sessionStorage.setItem('order',JSON.stringify(this.model))
        this.$router.push({
          name: 'orderEstimateDetial',
          query: {
            orderId: id,
            orderNo: no
          }
        })
      },

      /*
       *点击查询按钮时查询列表
       */
      queryData() {
        this.pageInfo.offset = 1;
        this.getOrderList();
      },

      /*
       * 导出列表
       */
      async exportData() {
        let params = {
          orderNo: this.model.orderNo, // 订单编号
          status: this.model.status == 0 ? '' : this.model.status,
          payType: this.model.payType == 0 ? '': this.model.payType,
          supplierType: this.model.supplierType == 0 ? '' :  this.model.supplierType,
          startTime: this.model.startTime,
          endTime: this.model.endTime,
          offset: 1,
          limit: 1,
          receivePerson: this.model.receivePerson, // 收货人姓名
          receivePhone: this.model.receivePhone
        }
        const res = await fetchJson.post(api.orderList, 'params', params)
        if(res.statusCode ==200 && res.responseContent.total> 0){
          this.exportTotal = res.responseContent.total;
          let dialog = this.$utils.layerOpen({
            title: '导出订单',
            height: '560px',
            width: '650px',
            content: $('#exportDialog'),
          })
        }else if(res.statusCode ==200 && res.responseContent.total == 0){
          this.$utils.layerMsg.warning('当前条件无可导出的订单！');
        }

      },

      async exportOrder () {
        let that = this;
        if(Number(this.model.min)> Number(this.exportTotal)|| Number(this.model.max)>Number(this.exportTotal)){
          this.$utils.layerMsg.warning(`输入数据有误，最大可导出${this.exportTotal}条`);
          return;
        }
        if (this.model.max>0 && this.model.min>0 && Number(this.model.max)>= Number(this.model.min)&&  Number(this.model.max)-Number(this.model.min)<1000) {

        }else{
          this.$utils.layerMsg.error('请输入正确的导出值，开始值要大于等于1,结束值大于等于开始值，单次最多导出1000条');
          return ;
        }

        let params = {
          start: this.model.min,
          end: this.model.max,
          orderNo: this.model.orderNo, // 订单编号
          status: this.model.status == 0 ? '' : this.model.status,
          startTime: this.model.startTime,
          endTime: this.model.endTime,
          supplierType: this.model.supplierType == 0 ? '' :  this.model.supplierType,
          receivePerson: this.model.receivePerson, // 收货人姓名
          payType: this.model.payType == 0 ? '' : this.model.payType, // 付款方式
          sendType: this.model.sendType == 0 ? '' : this.model.sendType, // 发货方式
          receivePhone: this.model.receivePhone
        };
        const res = await fetchJson.export(api.orderExport, params)
        // if(res.statusCode == 200){
          layer.closeAll();
          this.model.min = '';
          this.model.max ='';
           var blob = new Blob([res], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",

          });
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.download = "订单列表.xlsx";
          a.href = URL.createObjectURL(blob);
          a.click();
        // }else{
          // this.$utils.layerMsg.error('导出异常！');
        // }
      },

      /*
       * 更改订单状态，获取列表
       * param {Number} index
       */
      changeStatusLists(index) {
        this.model.status = index;
        this.pageInfo.offset = 1;
        this.model.orderNo = '',
        this.model.receivePerson = '',
        this.model.receivePhone = '',

        this.model.payType = 0,
        this.model.supplierType = 0,
        this.model.sendType = 0,
        this.$refs.refOrderType.resetDate();
        this.$refs.refPayType.resetDate();
        this.$refs.refSendType.resetDate();
        this.$refs.startTime.resetDate()
        this.$refs.endTime.resetDate()
        this.getOrderList()
      },
      /*
       *获取订单列表
       */
      async getOrderList() {
        this.isLoading = true
        let isCache = this.$route.query.isCache;
        if(isCache) {
          if(sessionStorage.getItem('order')){
            this.model = JSON.parse(sessionStorage.getItem('order'))
            sessionStorage.removeItem('order')
          };
        }
        this.model.userId = this.$route.query.userId ? this.$route.query.userId : '';
        if(this.model.userId){
          this.model.status = 4
        }
        let params = {
          orderNo: this.model.orderNo, // 订单编号
          status: this.model.status == 0 ? '' : this.model.status,
          payType: this.model.payType == 0 ? '': this.model.payType,
          startTime: this.model.startTime,
          supplierType: this.model.supplierType  == 0 ? '': this.model.supplierType,
          endTime: this.model.endTime,
          offset: this.pageInfo.offset,
          limit: this.pageInfo.limit,
          userId: this.model.userId,
          receivePerson: this.model.receivePerson, // 收货人姓名
          receivePhone: this.model.receivePhone,
          sendType: this.model.sendType == 0 ? '' : this.model.sendType, // 发货方式
        }
        let loading = layer.load(2);
        const res = await fetchJson.post(api.orderList, 'params', params)
        this.isLoading = false
        if (res.statusCode == 200) {
          this.orderLists = res.responseContent;
          this.pageInfo.total = this.orderLists.total;
        }
        layer.close(loading);
      },

      /*
       * 修改运费
       * param {Number} list 订单
       */
      changeDeliveryPrice(list) {
        let that = this;
        let dialog = this.$utils.layerOpen({
          title: '修改运费',
          height: '260px',
          width: '650px',
          content: $('#changeDialog'),
          btn: ['确 认', '取 消'],
          yes: async() => {
            let data = {
              orderId: list.id,
              amount: that.model.amount
            }
            if(that.model.amount === '') {
              that.$utils.layerMsg.warning('运费不可以为空')
              return ;
            }
            const res = await fetchJson.post(api.orderChangeDelivery, 'params', data)
            if (res.statusCode == 200) {
              that.$utils.layerMsg.success('修改运费成功')
              list.deliveryAmt = that.model.amount;
              list = Object.assign({}, list);
              that.model.amount = ''
              layer.close(dialog);
            }else{
              layer.close(dialog);
              that.getOrderList();
            }

          },
          end() {
            that.model.amount = ''
          },
        })
      },
      /**
       * 店铺是否开通VIP免支付
       */
      async shopVipFlag(){
          const res = await fetchJson.post(api.shopVipFlag,"params")
          if(res&&res.statusCode=="200"){
              var flag=res.responseContent
              if (flag=="1") {
                let vipOrder = {
                  title: '待核验',
                  value: '10'
                }
                var vipOrderPay = {
                  Value: 5,
                  Text: "VIP免支付"
                }
                //增加待核验状态
                this.orderTypes.splice(1, 0, vipOrder)
                this.selectPayType.selectOptions.push(vipOrderPay)
              }
          }
      }
    }
  }

</script>
<style lang="less" scoped>
  @import url('../../assets/less/variable.less');
  .m-search {
    a.last {
      &:before {
        content: '';
        display: block;
        width: 2px;
        height: 18px;
        float: left;
        margin: 0 10px;
        background: @color-blue
      }
    }
  }
  .g-main {
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
  }

  .pager {
    padding: 20px 0 40px;

    .page_box {
      width: 100%;
    }
  }

  .change_dialog {
    padding-top: 30px;
    line-height: 40px;
    input {
      width: 384px;
      height: 40px;
      line-height: 40px;
      padding: 0 6px;
    }
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

  .send_default {
    text-align: left;
    ul{
      height: 162px;
      overflow: hidden;
      li{
        padding-bottom: 30px;
      }

      padding: 30px;
      label{
        display: inline-block;
        width: 115px;
      }
      input{
        box-sizing: border-box;
        height: 40px;
        width: 400px;
        padding: 0 6px;
      }
    }
     .layui-layer-btn a{
      margin: 0 !important
    }
  }

  .send_dummy{
    padding: 40px 40px 0;
    text-align: left;
    label{
      float: left;
      margin-right: 20px;
    }
    textarea{
      padding: 10px;
      height: 100px !important;
      width: 420px !important;
    }
    .layui-layer-btn a{
      margin: 0 !important
    }


  }

  .error_tip{
    padding-top: 6px;
  }
  .text-ellipsis{
    max-width:178px;
    line-height: 22px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
  }

</style>
