<template>
  <div @click="offSelete()">
    <div class="title_crumbs">
      商品 > 销售中
    </div>
    <div class="good_content section_b">
      <div class="tab_header border_bottom clearfix">
        <div class="f_left tab">
          <span :class="{actived: model.goodsState == 1}" @click="changeGoodsStateList(1)">销售中</span>
          <span :class="{actived: model.goodsState == 0}" @click="changeGoodsStateList(0)">仓库中</span>
          <span :class="{actived: model.goodsState == 2}" @click="changeGoodsStateList(2)">商品回收站</span>
        </div>
        <input type="button" class="f_right btn_white_orange" value="发布商品" @click="toEdit(0)" />
      </div>

      <!-- form 查询 start-->
      <div class="m-search">
        <div class="layui-form">
          <div class="layui-form-item">
            <div class="layui-inline">
              <label for="" class="layui-form-label">商品名称：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model.trim="model.name" />
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">商品类型：</label>
              <div class="layui-input-inline">
                <my-select class="inline_block selcet_box first" ref="selectType" v-model="model.goodsType" :options="selectGoodsType" ></my-select>
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">创建时间：</label>
              <div class="layui-input-inline">
                <my-date v-model="model.startTime" class="input_date" @input="startTimeChange" placeholder="开始时间" ref="startTime" :isTime="false" dateFormat="yyyy-MM-dd HH:mm:ss"></my-date>
                <!-- <input type="text" class="layui-input input_date" readonly v-model="model.startTime" placeholder="开始时间" id="start"> -->
              </div>
              <div class="layui-form-mid">
                <i class="separator"></i>
              </div>
              <div class="layui-input-inline">
                <my-date v-model="model.endTime" @input="endTimeChange" ref="endTime" :isEnd="true" placeholder="结束时间" class="input_date" :isTime="false" dateFormat="yyyy-MM-dd HH:mm:ss"></my-date>
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">商品品类：</label>
              <div class="layui-input-inline">
                <my-select class="inline_block selcet_box first" ref="select" @input="onSelect" v-model="model.SelectValue1" :options="selectGroupMsg1"></my-select>
              </div>
              <div class="layui-form-mid">
                <i class="separator"></i>
              </div>
              <div class="layui-input-inline">
                <my-select class="inline_block selcet_box" ref="subSelect" v-model="model.SelectValue2" :options="selectGroupMsg2"></my-select>
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

      <div class="good_list">
        <table class="layui-table lay-even" lay-skin="line">
          <thead>
            <tr>
              <th>
                <my-checkbox v-model="model.CheckboxIsAllValue" ref="allChecked"></my-checkbox>
              </th>
              <th>商品名称</th>
              <th>商城分类</th>
              <th>商品品类</th>
              <th>商品类型</th>
              <th>访问量</th>
              <th>库存</th>
              <th style="width: 80px;cursor:pointer;" @click="sortBySale()">销量 <a href="javascript:;" class="">&darr;</a></th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="list in model.dataLists.list" :key="list.id" :style="{color:list.noSell!=0?'#999999':''}">
              <td>
                <my-checkbox v-model="list.isChecked" :isDisabled="list.noSell!=0" ref="itemChecked"></my-checkbox>
              </td>
              <!--商品名称-->
              <td class="good_name">
                <img class="f_left" :src="list.picUrl">
                <div class="">
                  <p>{{list.name}}</p>
                  <span class="inline_block badge_orange" v-if="list.supplierGoodsId>0">分销</span>
                  <span class="price">{{ list.price | currency }}</span>
                  <br>
                  <!--商品品类是否缺失判断，需要添加禁止销售标识noSell-->
                  <!--当分销商品存在缺失商城分类的条件下，无论是否存在店铺分类，都默认提示：该商品禁止销售，带颜色标识-->
                  <span v-if="list.noSell==1" class="disSell">该商品禁止销售</span>
                  <!--当普通商品同时缺失商城分类以及店铺分类的条件下，普通商品默认提示：请编辑设置商城分类，带颜色标识-->
                  <span v-if="list.noSell==2" class="disSell">请编辑设置商城分类</span>
                  <!--当商城分类存在，店铺分类缺失的条件下，普通商品以及分销商品都默认提示：请编辑设置店铺分类，带颜色标识-->
                  <span v-if="list.noSell==3" class="disSell">请编辑设置店铺分类</span>
                </div>
              </td>
              <!--商城分类-->
              <td>
                  <div v-if="!$utils.isEmpty(list.categoryTree)&&list.categoryTree.length>0">
                      <span v-for="(item, index) in list.categoryTree" :key="item.id">
                          {{item.name | strLenght(6)}}
                          <i v-show="index != list.categoryTree.length-1"> — </i>
                      </span>
                  </div>
                  <span v-else>-</span>
              </td>
              <!--商品品类-->
              <td>
                  <div v-if="!$utils.isEmpty(list.shopCategoryTree)&&list.shopCategoryTree.length>0">
                  <span v-for="(item, index) in list.shopCategoryTree" :key="item.id">
                      {{item.name | strLenght(6)}}
                      <i v-show="index != list.shopCategoryTree.length-1"> — </i>
                  </span>
                  </div>
                  <span v-else>-</span>
              </td>
              <!--商品类型-->
              <td><span v-if="list.supplierGoodsId == 0">{{list.goodsType | goodsType}}</span><span v-else>分销商品</span></td>
              <td>PV:{{list.pvValue}}
                <br>UV:{{list.uvValue}}</td>
              <td><span v-if="list.supplierGoodsId == 0">{{list.stock}}</span><span v-else> <i v-if="list.stock>0">有货</i><i v-else="list.stock">库存不足</i></span></td>
              <td>{{list.saleQuantity}}</td>
              <td>{{list.createTime}}</td>
              <td class="f_blue">
                <span @click="toEdit(list.id, list.supplierGoodsId)">编辑</span>
                <i>|</i>
                <span @click="copyLink(list.id)">复制链接</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="pager clearfix" v-show="pageInfo.total != 0" >
      <div class="f_left">
        <div v-show="model.goodsState == 1">
          <input type="button" class="btn_white_grey" value="下架" @click="soldout()">
          <input type="button" class="btn_white_grey" value="删除" @click="delcet()">
          <input type="button" class="btn_white_grey" value="批量修改价格" @click="changePrice()">
        </div>
        <div v-show="model.goodsState == 0">
          <input type="button" class="btn_white_grey" value="上架" @click="putawayStore()">
          <input type="button" class="btn_white_grey" value="删除" @click="delcet()">
          <input type="button" class="btn_white_grey" value="批量修改价格" @click="changePrice()">
        </div>
        <div v-show="model.goodsState == 2">
          <input type="button" class="btn_white_grey" value="上架至仓库" @click="trashPutawayBuffer()">
          <input type="button" class="btn_white_grey" value="上架至商城" @click="trashPutawayStore()">
        </div>
      </div>

      <!-- 分页组件 -->
      <div class="f_right page_box">
         <pager class="f_right" :options="pageInfo" v-on:changePagerNum="recievePage"></pager>
      </div>

    </div>

    <div v-show="pageInfo.total == 0 && !isLoading" class="text_center">当前没有任何数据</div>
    <div v-show="isLoading" class="text_center">正在获取列表数据...</div>

    <!-- 复制链接弹框 -->
    <div class="copy_dialog hide" id="copyDialog">
      <ul>
        <li>
          <label for="">商品页H5端链接：</label>
          <br>
          <input id="h5Url" readonly type="text" v-model="model.h5Url">
          <a href="javascript:;" @click="copy('h5Url')" class="handle">复制</a>
        </li>
        <li>
          <label for="">商品页PC端链接：</label>
          <br>
          <input id="webUrl" readonly type="text" v-model="model.webUrl">
          <a href="javascript:;" @click="copy('webUrl')" class="handle">复制</a>
        </li>
      </ul>
    </div>

    <!-- 修改价格弹框 -->
    <div class="hide text_left" id="changePrice">
      <div class="clearfix">
        <h4 class="font_14">
          <a class="icon-radio-blue-default icon_radio f_left" :class="{'icon-radio-blue-checked': setPriceType == 1}"
          @click="setPriceType = 1, model.value = ''"></a>统一零售价
        </h4>
        <p class="" v-show="setPriceType == 1">
          <input type="text" class="f_left"
          v-model="model.value"
          @input="model.value = model.value ? model.value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'') : ''"
          @change="writePrice('value')"
          maxlength="7"
          >
          <i class="padding_top30 f_left">&nbsp;&nbsp;元</i></p>
      </div>
      <div class="padding_top20">
        <div class="clearfix">
          <a class="icon-radio-blue-default icon_radio f_left margin_top10" :class="{'icon-radio-blue-checked': setPriceType !== 1}"
           @click="setPriceType = 2, model.value = ''"></a>
          <my-select class="f_left"
          v-model="setPriceType"
          :options="selectPriceType"
          @input="model.value = ''"
          ref="selectRef2"
          ></my-select>
        </div>
        <p v-show="setPriceType == 2">
          <input class="f_left" type="text"
            v-model="model.value"
            @input="model.value = model.value ? model.value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'') : ''"
            @change="writePrice('value')"
            maxlength="7"
           ><i class="f_left padding_top30">&nbsp;&nbsp;元</i>
        </p>
        <p v-show="setPriceType == 3">
          <input type="text" class="f_left"
            v-model="model.value"
            @input="model.value = model.value ? model.value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'') : ''"
            @change="writePrice('value')"
          ><i class="f_left padding_top30">&nbsp;&nbsp;%</i>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import fetchJson from "../../api/http";
  import api from "../../api/api";
  import MyCheckbox from "../../components/Checkbox.vue";
  import MySelect from "../../components/Select.vue";
  import MyDate from '../../components/Date.vue';
  import config from '../../config';

  export default {
    name: "goodsManage",
    components: { MyCheckbox, MySelect, MyDate},
    data() {
      return {
        pageInfo: {
          total: "", // 总条数
          offset: 1, // 当前页面
          limit: 20 // 页面尺寸
        },
        isLoading: true,
        model: {
          name: "", // 模糊查询商品名称
          value: '', // 商品价格
          goodsState: 1, // 商品状态 0,1,2 销售中，仓库，回收站
          goodsType: 0, // 商品类型 0,1,2 全部，实物，虚拟
          deletedFlag: 0, // 是否已删除（1：是，0：否）
          h5Url: '',
          webUrl: '',
          RadioValue: 1,
          CheckboxIsAllValue: false, // checkbox全选状态
          SelectValue1: 0,
          SelectValue2: 0,
          startTime: "", // 开始时间
          endTime: "", // 结束时间
          dataLists: {},
          sort: 'create_time', // 排序（销量=>sale_quantity, create_time=>创建时间）
        },

        setPriceType: 1, // 价格设置
        selectPriceType: {
          size: {
            w: "300px",
            h: "40px"
          },
          selectOptions: [{
              Value: "2",
              Text: "按金额批量加价"
            },{
              Value: "3",
              Text: "按百分比批量加价"
            }
          ]
        },
        selectGoodsType: {
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
              Text: "实物商品"
            },
            {
              Value: "2",
              Text: "虚拟商品"
            },
            {
              Value: '3',
              Text: '分销商品'
            }
          ]
        },
        selectGroupMsg1: {
          size: {
            w: "150px",
            h: "30px"
          },
          selectOptions: [{
            Value: 0,
            Text: "请选择"
          }]
        },
        selectGroupMsg2: {
          size: {
            w: "150px",
            h: "30px"
          },
          selectOptions: [{
            Value: 0,
            Text: "请选择"
          }]
        }
      };
    },
    created: function () {
      this.getCategoryTree();
    },
    activated () {
      this.getGoodsList(this.model.state)
    },

    // mounted: function () {
    //   // 加载商品列表
    // },

    watch: {
      // 监听全选的状态变化
      'model.CheckboxIsAllValue' () {
        this.checkAll(this.model.CheckboxIsAllValue)
      }
    },

    methods: {
      offSelete () {
        this.$refs.select.offSelect()
        this.$refs.selectType.offSelect()
        this.$refs.subSelect.offSelect()
        this.$refs.selectRef2.offSelect()
      },


        /**
       * 保留两位小数
       */
      writePrice (value) {
        var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/

        if(Number(this.model[value])){
          this.model[value] = parseFloat(this.model[value]).toFixed(2)
        }
        if (this.model[value]) {
          if(this.model[value]>= 10000000) {
            this.model[value] = '';
            this.model = Object.assign({}, this.model)
            this.$utils.layerMsg.warning('商品最大价格不可以超过10000000！')
            return false;
          }
          var val = this.model[value];
          if (reg.test(val)) {
            if (val.toString().indexOf('.') == -1 && val.toString().length <= 6) {
              this.model[value] = parseFloat(val).toFixed(2)
            }
          } else {
            return
          }
        }
        this.model = Object.assign({}, this.model)
      },

      //表格全选checkebox
      checkAll (value) {
        this.$refs.itemChecked.map(item => item.toChecked(value))
        // this.model.dataLists.list.map(item => {
        //   item.isChecked = value;

        // })
      },

      // 按销量排序
      sortBySale () {
        this.model.sort = 'sale_quantity';
        this.getGoodsList();
      },

      /*
      *获取列表中选中的id
      * return {boole} false
      * return {array} goodsIds
      */
      getitemIds () {
        let goodsIds = []; // 选中的id 数组集合
        this.model.dataLists.list.map(item => {
          if(item.isChecked) {
            goodsIds.push(item.id)
          }
        })
        if(goodsIds.length == 0){
          this.$utils.layerMsg.warning('请先选择商品在进行操作！')
          return false;
        }else{
          return goodsIds;
        }
      },

      // 日期切换
      endTimeChange(value) {
        if(this.model.startTime) {
          if(Date.parse(new Date(value))< Date.parse(new Date(this.model.startTime))){
            layer.msg('结束时间必须大于开始时间', {icon: 0})
            this.$refs.endTime.resetDate()
          }
        }
      },
      startTimeChange(value){
        if(this.model.endTime) {
          if(Date.parse(new Date(value))> Date.parse(new Date(this.model.endTime))){
            layer.msg('开始时间必须小于结束时间', {icon: 0})
            this.$refs.startTime.resetDate()
          }
        }
      },

      // selecet 切换
      onSelect (value) {
        this.selectGroupMsg2.selectOptions = this.selectGroupMsg2.selectOptions.slice(0, 1);
        this.model.SelectValue2 = 0;
        this.$refs.subSelect.resetDate();

        let that = this;
        this.selectGroupMsg1.selectOptions.map(item => {
          if (item.Value == value) {
            that.model.SelectValue2 = 0;
            item.children && item.children.map(child => {
              that.selectGroupMsg2.selectOptions.push({
                Value: child.id,
                Text: child.name
              });
            });
          }
        });
      },

      recievePage (msg) {
        this.pageInfo.offset = msg;
        this.getGoodsList();
      },
      changePagerNum: function (pageIndex) {
        this.pageInfo.curPage = pageIndex;
      },

      /**
       * 复制商品链接
       * @param{String} id
       */
      copyLink(id) {
        this.model.h5Url = config.h5Url+ '/goodDetail/'+ id
        this.model.webUrl = config.webUrl +'/goodDetail/' + id,
        this.$utils.layerOpen({
          title: "复制链接",
          height: "300px",
          width: "650px",
          content: $("#copyDialog"),
          cancel() {

          }
        });
      },
      /**
       *复制URL
       *@param {对应的input id} id
       */
      copy(id) {
        let e = document.getElementById(id); //对象是contents
        e.select(); //选择对象
        let tag = document.execCommand("Copy"); //执行浏览器复制命令
        if (tag) {
          layer.closeAll();
          layer.msg("复制成功", {
            icon: 1
          });
        }
      },

      /**
       *跳转到编辑页面
       * @param {string} goodId
       * @param {string} supplierGoodsId
       */
      toEdit(goodsId, supplierGoodsId) {
        sessionStorage.setItem('goodManage', JSON.stringify(this.model))
        let name = 'goodEdit'
        if(supplierGoodsId>0){
          name = 'marketEdit'
        }
        this.$router.push({
          name,
          query: {
            goodsId
          }
        });
      },

      /*
       * 获取商品列表
       * param {number} state 商品状态
       */
      async getGoodsList() {
        this.isLoading = true;
        let isCache = this.$route.query.isCache;
        if(isCache) {
          if(sessionStorage.getItem('goodManage')){
            this.model = JSON.parse(sessionStorage.getItem('goodManage'))
            sessionStorage.removeItem('goodManage')
          };
        }
        let param = {
          offset: this.pageInfo.offset,
          limit: this.pageInfo.limit,
          name: this.model.name,
          startTime: this.model.startTime,
          endTime: this.model.endTime,
          goodsType: this.model.goodsType || '',
          deletedFlag: this.model.deletedFlag,
          shopCatId: this.model.SelectValue2 == 0 ? this.model.SelectValue1 : this.model.SelectValue2,
          status: this.model.goodsState == 2 ? "" : this.model.goodsState, // 货物状态
          sort: this.model.sort,
          order: 'DESC' // 方向（ASC=>升序, DESC=>降序）
        };
        let loading = window.layer.load(2);
        const res = await fetchJson.post(api.getGoodsList, "params", param);
        this.isLoading = false;
        window.layer.close(loading);
        if(res.statusCode != 200) {
          return
        }
        this.model.dataLists = res.responseContent;
        //判断商品品类是否齐全，是否可以上架
        //noSell 0:默认允许出售   1:分销商品缺失商城分类    2:普通商品缺失商城分类和店铺分类   3:当商城分类存在，店铺分类缺失
        var noSell;
        for(var list of this.model.dataLists.list){
            if(list.supplierGoodsId>0&&(this.$utils.isEmpty(list.categoryTree)||list.categoryTree.length==0)){
                noSell=1
            }else if(list.supplierGoodsId==0&&(this.$utils.isEmpty(list.categoryTree)||list.categoryTree.length==0)){
                noSell=2
            }else if(!this.$utils.isEmpty(list.categoryTree)&&list.categoryTree.length>0&&(this.$utils.isEmpty(list.shopCategoryTree)||list.shopCategoryTree.length==0)){
                noSell=3
            }else{
                noSell=0
            }
            list["noSell"]=noSell
        }
        this.pageInfo.total = this.model.dataLists.total;
        this.$refs.allChecked.toChecked(false);
      },

      /**
       *获取分类列表
       *@param {string} id  '0' 全部分类
       */
      async getCategoryTree(id = 0) {
        const res = await fetchJson.post(api.getCategoryTree, "params", {
          id
        });
        this.selectGroupMsg1;
        let that = this;
        res.responseContent.map(item => {
          that.selectGroupMsg1.selectOptions.push({
            Value: item.id,
            Text: item.name,
            children: item.children
          });
        });
      },

      // 点击查询
      queryData() {
        this.pageInfo.offset = 1;
        this.getGoodsList();
      },

      // 查询商品列表，销售，仓库，回收站
      changeGoodsStateList(state) {
        this.model.goodsState = state;
        this.pageInfo.offset = 1;
        this.pageInfo.total = 0;
        this.model.SelectValue1 = 0;
        this.model.SelectValue2 = 0;
        this.model.name = '';
        this.model.goodsType = 0;
        this.model.startTime = '';
        this.model.endTime = '';
        this.model.deletedFlag = state == 2 ? 1 : 0;
        this.$refs.subSelect.resetDate();
        this.$refs.select.resetDate();
        this.$refs.selectType.resetDate();

        this.$refs.startTime.resetDate()
        this.$refs.endTime.resetDate()

        this.getGoodsList();
      },

      // 下架商品
      soldout() {

        let that = this;
        let goodsIds = this.getitemIds(); // 选中的id 数组集合
        if( !goodsIds){
          return false;
        }
        let index = layer.confirm(
          '<p class="padding_top30">确定下架选中商品？</p>', {
            title: "下架商品",
            btn: ["确 定", "取 消"], // 按钮
            area: ["600px", "265px"]
          },
          async function () {
            //执行删除操作
            layer.close(index);
            const res = await fetchJson.post(api.batchSolduot, 'data', {goodsIds})
            if(res.statusCode == 200) {
              that.$utils.layerMsg.success('商品下架成功！')
              that.getGoodsList()
            }else {
              that.$utils.layerMsg.success(res.statusMessage)
            }
          },
          function (index) {
            //执行取消操作
            layer.close(index);
          }
        );
      },

      // 删除商品
      delcet() {
        let that = this;
        let goodsIds = this.getitemIds();
        if(!goodsIds){
          return
        }
        let index = layer.confirm(
          '<p class="padding_top30">确定删除选中商品？</p>', {
            title: "删除商品",
            btn: ["确 定", "取 消"], // 按钮
            area: ["600px", "265px"]
          },
          async function () {
            //执行删除操作
            layer.close(index);
             const res = await fetchJson.post(api.batchDelete, 'data', {goodsIds})
            if(res.statusCode == 200) {
              that.$utils.layerMsg.success('商品删除成功！')
              that.getGoodsList()
            }else {
              that.$utils.layerMsg.success(res.statusMessage)
            }
          },
          function (index) {
            //执行取消操作
            layer.close(index);
          }
        );
      },

      /**
      * 修改供货价格
      */
      changePrice () {
        //判断是否勾选
        let that = this;
        let goodsIds = this.getitemIds(); // 选中的id 数组集合
        if( !goodsIds){
          return false;
        }
        let dialog = this.$utils.layerOpen({
          title: '修改供货价',
          content: $('#changePrice'),
          btn: ['确定', '取消'],
          height: '440px',
          width: '580px',
          yes: async () => {

            let isSave = true;
            let prices = [];
            that.model.dataLists.list.map(item => {
                if(item.isChecked){
                  prices.push(item.purchasePrice)
                }
              })
            if(that.setPriceType == 1){
              let minPrice = Math.max.apply(Math.max, prices);
              if(that.model.value === ''){
                that.$utils.layerMsg.warning(`价格设置错误！价格不可以为空`)
                isSave = false;

              }
              else if(that.model.value<minPrice){
                that.$utils.layerMsg.warning(`价格设置错误！价格不可以低于供货价￥${minPrice}`)
                isSave = false;
              }
            }
            else{
              if(that.model.value<=0){
                 that.$utils.layerMsg.warning(`加价必须大于0`)
                 isSave = false;
                 return
              }
            }
            if ( !isSave ) return '';
            let NumVal = Number(this.model.value)
            if(!NumVal){
              that.$utils.layerMsg.warning(`只可以输入数字`)
              return false;
            }
            let res = await fetchJson.post(api.changePrice, 'data', {
              value: that.model.value,
              goodsIds,
              changeType: that.setPriceType
            })
            if(res.statusCode === '200'){
              window.layer.close(dialog);
              that.$utils.layerMsg.success('修改价格成功！')
              that.getGoodsList()
            }
          },
          end () {
            that.model.value = ''
          }

        },)
      },

      //上架到商城
      putawayStore() {
        let that = this;
        let goodsIds = this.getitemIds();
        if(!goodsIds){
          return
        }
        let index = layer.confirm(
          '<p class="padding_top30">确定上架选中商品？</p>', {
            title: "上架商品",
            btn: ["确 定", "取 消"], // 按钮
            area: ["600px", "265px"]
          },
          async function () { //执行上架操作
            layer.close(index);
             const res = await fetchJson.post(api.batchputawayStore, 'data', {goodsIds})
            if(res.statusCode == 200) {
              that.$utils.layerMsg.success('商品上架成功！')
              that.getGoodsList()
            }else {
              that.$utils.layerMsg.error(res.statusMessage)
            }
          },
          function (index) {
            //执行取消操作
            layer.close(index);
          }
        );
      },

      // 回收站上架至商城
      trashPutawayStore() {
        let that = this;
        let goodsIds = this.getitemIds();
        if(!goodsIds){
          return
        }
        let index = layer.confirm(
          '<p class="padding_top30">确定将选中商品上架到商城？</p>', {
            title: "上架商品",
            btn: ["确 定", "取 消"], // 按钮
            area: ["600px", "265px"]
          },
          async function () {
            layer.close(index);
             const res = await fetchJson.post(api.trashPutawayStore, 'data', {goodsIds})
            if(res.statusCode == 200) {
              that.$utils.layerMsg.success('商品上架成功！')
              that.getGoodsList()
            }else {
              that.$utils.layerMsg.error(res.statusMessage)
            }
          },
          function (index) {
            //执行取消操作
            layer.close(index);
          }
        );
      },
      trashPutawayBuffer () {
        let that = this;
        let goodsIds = this.getitemIds();
        if(!goodsIds){
          return
        }
        let index = layer.confirm(
          '<p class="padding_top30">确定将选中商品上架到仓库？</p>', {
            title: "上架商品",
            btn: ["确 定", "取 消"], // 按钮
            area: ["600px", "265px"]
          },
          async function () {
            layer.close(index);
             const res = await fetchJson.post(api.trashPutawayBuffer, 'data', {goodsIds})
            if(res.statusCode == 200) {
              that.$utils.layerMsg.success('商品上架成功！')
              that.getGoodsList()
            }else {
              that.$utils.layerMsg.error(res.statusMessage)
            }
          },
          function (index) {
            //执行取消操作
            layer.close(index);
          }
        );
      }
    }
  };

</script>
<style lang="less" scoped>
  @import url('../../assets/less/variable.less');
  @import url("../../assets/less/goods.less");
.good_content {
  // margin-top: 20px;
  border-bottom: none
}
  .selcet_box {
    width: 150px;
  }

  table thead tr {
    border-top: 1px solid @color-border;
  }

  table tbody tr td:first-child {
    padding-left: 20px;
  }

  .good_list {
    table {
      border-left: 0px;
      border-right: 0px;
      thead {
        height: 50px;
        tr {
          height: 50px;
          background: @color-white;
          th {
            font-weight: bold;
          }
        }
      }
      input[type="checkbox"]:after {
        width: 20px;
        height: 20px;
        margin-left: 15px !important;
      }
      tr {
        td {
          padding: 30px 20px!important;
          font-size: 12px;
        }
        td.good_name {
          img.f_left {
            width: 100px;
            height: 100px;
          }
          div {
            padding-left: 110px;
            width: 57%;
            p {
              margin-bottom: 12px;
              margin-top: 15px;
            }
            span.price {
              color: #ff6503;
            }
            span.disSell{
                display: inline-block;
                margin-top:5px;
                background:url(../../assets/img/icons/warn_red.png) no-repeat center left;
                padding-left:18px;
                color:#ff0101;
            }
          }
        }
        td:last-child {
          min-width: 130px;
          i {
            display: inline-block;
            margin: 0 8px;
          }
        }
      }
    }
  }

  // copydialog
  .copy_dialog {
    ul {
      padding-top: 20px;
    }
    li {
      padding-top: 10px;
      text-align: left;
      line-height: 40px;
      width: 450px;
      margin: 0 auto;
    }
    input[type="text"] {
      box-sizing: border-box;
      width: 380px;
      height: 40px;
      line-height: 40px;
      margin-right: 20px;
      padding: 0 6px;
    }
  }
  .page_box{
    width: 568px;
  }
  .pager {
    padding-bottom: 40px;
    .f_left {
      input[type="button"] {
        padding: 0 30px;
        margin-right: 20px;
        width: auto;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }

  // 修改价格样式；
  #changePrice {
    margin-left: 110px;
    padding-top: 34px;

    .icon_radio {
      margin-right: 20px;
    }
    input{
      box-sizing: border-box;
      margin-left: 36px;
      margin-top: 20px;
      padding: 0 6px;
      width: 300px;
      height: 40px;
      border-radius: 2px;
      border: 1px solid @color-c;
    }

    .set_info {
      padding-left: 36px;
      color: @color-9;
      font-size: 12px;
    }
  }

</style>
