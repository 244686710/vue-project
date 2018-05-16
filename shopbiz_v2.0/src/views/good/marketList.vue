/* * @Author: Yuyd * @Date: 2018-01-02 14:17:52 * @Last Modified by: Yuyd * @Last Modified time: 2018-01-18 14:45:20 * 分销管理
*/

<template>
  <div @click="offSelete()">
    <div class="good_content section_b">
      <!-- tab start -->
      <div class="tab_header border_bottom clearfix">
        <div class="f_left tab">
          <span :class="{actived: model.tabState == 0}" @click="changeTabList(0)">我要分销</span>
          <span :class="{actived: model.tabState == 1}" @click="changeTabList(1)">分销商品变更</span>
        </div>
      </div>
      <!-- tab end -->

      <!-- form 查询 start-->
      <div class="m-search" v-show="model.tabState == 0">
        <div class="layui-form">
          <div class="layui-form-item">
            <div class="layui-inline">
              <label for="" class="layui-form-label">商品名称：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model.trim="model.name" />
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">品牌：</label>
              <div class="layui-input-inline">
                <input type="text" class="layui-input" v-model.trim="model.brandName" />
              </div>
            </div>
            <div class="layui-inline">
              <label for="" class="layui-form-label">商品品类：</label>
              <div class="layui-input-inline">
                <my-select class="inline_block selcet_box" @input="onSelect" v-model="model.SelectValue1" :options="selectLevel1" ref="subSelect1"></my-select>
              </div>
              <div class="layui-form-mid">
                <i class="separator"></i>
              </div>
              <div class="layui-input-inline">
                <my-select class="inline_block selcet_box" ref="subSelect2" @input="onSelect2" v-model="model.SelectValue2" :options="selectLevel2"></my-select>
              </div>
              <div class="layui-form-mid">
                <i class="separator"></i>
              </div>
              <div class="layui-input-inline">
                <my-select class="inline_block selcet_box" ref="subSelect3" v-model="model.SelectValue3" :options="selectLevel3"></my-select>
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

      <div class="good_list border_top">
        <table class="layui-table lay-even" lay-skin="line" v-show="model.tabState == 0">
          <thead>
            <tr>
              <th class="clear_padding padding_left20 w40">
                <my-checkbox v-model="isCheckedAll" ref="allChecked"></my-checkbox>
              </th>
              <th>商品名称</th>
              <th>品牌</th>
              <th>供货价</th>
              <th>供货商</th>
              <th>商品分类</th>
              <th>库存</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="list in model.dataLists.list" :key="list.id">
              <td class="clear_padding padding_left20 w40">
                <my-checkbox v-model="list.isChecked" ref="itemChecked"></my-checkbox>
              </td>
              <td class="good_name">
                <img class="f_left" :src="list.picUrl">
                <div class="">
                  <p>{{list.name}}</p>
                  <span class="price">{{ list.price | currency }}</span>
                </div>
              </td>
              <td>{{list.brandName}}</td>

              <td>{{list.price | currency}}</td>
              <td>
                {{list.supplierName}}
                <!-- PV:{{list.uvValue}}
                <br>UV:{{list.pvValue}} -->
              </td>
              <td>
                <span v-for="categroy in list.mallCategoryTree">{{categroy.name}}</span>
                <span v-show="!list.mallCategoryTree">--</span>
              </td>
              <td>{{list.stock>0? '有货': '无货'}}</td>
              <td class="f_blue">
                <input type="button" class="w80 margin_bottom10 btn_light_orange" @click="putaway(list.id)" value="上架">
                <br>
                <span class="handle" @click="toDetial(list.id)">商品详情</span>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="layui-table lay-even" lay-skin="line" v-show="model.tabState == 1">
          <thead>
            <tr>
              <!-- <th class="clear_padding padding_left20 w40">
                <my-checkbox v-model="model.CheckboxIsAllValue" ref="allChecked"></my-checkbox>
              </th> -->
              <th>商品名称</th>
              <th>品牌</th>
              <th>供货商</th>
              <th>变更内容</th>
              <!-- <th>操作</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="list in changeLogs" :key="list.id">
              <!-- <td  class="clear_padding padding_left20 w40">
                <my-checkbox ref="itemChecked" v-model="list.isChecked"></my-checkbox>
              </td> -->
              <td class="good_name">
                <img class="f_left" :src="list.picUrl">
                <!-- <img class="f_left" src="../../assets/img/dev/pic_sample.png"> -->
                <div class="">
                  <p>{{list.goodsName}}</p>
                  <!-- <span class="price">{{ list.price | currency }}</span> -->
                </div>
              </td>
              <td>
                {{list.brandName}}
              </td>

              <td>{{list.supplierName || '--'}}</td>
              <td>{{list.changeContent}}</td>
              <!-- <td class="f_blue">
                <span class="handle" @click="doDelete(1)">删除</span>
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="pager clearfix" v-show="pageInfo.total != 0 && model.tabState == 0">
      <div class="f_left">
        <input type="button" class="btn_white_grey" value="批量上架" @click="putaway()">
      </div>
      <!-- 分页组件 -->
      <div class="f_right page_box">
        <pager class="f_right" :options="pageInfo" v-on:changePagerNum="recievePage"></pager>
      </div>
    </div>
    <div class="pager clearfix" v-show="pageInfo.total != 0 && model.tabState == 1">
      <!-- <div class="f_left">
        <input type="button" class="btn_white_grey" value="批量删除" @click="doDelete()">
      </div> -->
      <!-- 分页组件 -->
      <div class="f_right page_box">
        <pager class="f_right" :options="pageInfo" v-on:changePagerNum="recievePage"></pager>
      </div>
    </div>
    <div v-show="pageInfo.total === 0 && !isLoading" class="text_center">当前没有任何数据</div>
    <div v-show="isLoading" class="text_center">正在获取列表数据...</div>

    <!-- 上架 -->
    <div id="putawayDialog" class="hide">
      <p>商品分类：</p>
      <div class="putaway_box">
        <input type="text" readonly placeholder="请选择" @click.stop="showLevel" v-model="model.categroy">
        <i class="inline-block icon-select-arrow" :class="{active: isShowCategroy == true}"></i>
        <div v-show="isShowCategroy" class="dropdown" @click.stop="">
          <div class="dropdown_title">
            <ul>
              <li class="inline_block" :class="{active: FirstLevel}" @click="FirstLevel = true, firstLevel = '请选择', SecondLevel = false">
                <span>{{firstLevel }}</span>
              </li>
              <li class="inline_block" :class="{active:SecondLevel}">
                <span v-show="SecondLevel">请选择</span>
              </li>
            </ul>
          </div>
          <div class="dropdown_content">
            <ul v-show="FirstLevel">
              <li @click="checkCatFirstLevel(item)" v-for="(item, index) in categoryLists" :key="`categrory${index}`">{{item.name }}</li>
            </ul>
            <ul v-show="SecondLevel">
              <li v-for="(child, index) in categoryItemChildren" :key="`categoryItem${index}`" @click="checkCatSecondLevel(child)">{{child.name }}</li>
            </ul>
          </div>
        </div>
        <div>
          <input class="btn_light_orange" type="button" value="上架到店铺" @click="putawayToOnline()">
          <input class="btn_white_orange" type="button" value="添加到仓库" @click="putawayToBuff()">
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import api from '../../api/api'
  import apiMarket from '../../api/market'
  import fetchJson from '../../api/http'
  import MySelect from '../../components/Select.vue'
  import MyCheckbox from '../../components/Checkbox.vue'
  import Bus from '../../assets/bus'

  export default {
    name: 'MarketList',
    components: {
      MySelect,
      MyCheckbox
    },
    data() {
      return {
        isLoading: true,
        categoryLists: [], // 分类列表
        isShowCategroy: false, // 显示列表
        firstLevel: '请选择',
        secondLevel: '',
        FirstLevel: true,
        SecondLevel: false,
        isCheckedAll: false, // 是否全选
        bufferCatCategory: [],
        categoryItemChildren: [],
        goodsIds: [], // 当前的goodsids
        dialogIndex: null, // 弹出层
        changeLogs: [], // 变更记录
        model: {
          tabState: 0,
          dataLists: {
            list: []
          },
          categroy: '', // 类目名称
          name: '',
          brandName: '',
          SelectValue1: 0,
          SelectValue2: 0,
          SelectValue3: 0,
        },

        pageInfo: {
          total: 0,
          limit: 20,
          offset: 1
        },
        selectLevel1: {
          size: {
            w: "150px",
            h: "30px"
          },
          selectOptions: [{
            Value: "0",
            Text: "请选择"
          }]
        },
        selectLevel2: {
          size: {
            w: "150px",
            h: "30px"
          },
          selectOptions: [{
            Value: "0",
            Text: "请选择"
          }]
        },
        selectLevel3: {
          size: {
            w: "150px",
            h: "30px"
          },
          selectOptions: [{
            Value: "0",
            Text: "请选择"
          }]
        },
      }
    },

    created() {
      this.getMarketFlag()
      this.getMallCateGoryTree()
      // 获取商品列表
      this.getGoodsList()
      // 获取商城类目
      // 获取店铺商品类目
      this.getCategoryLists()
    },

    activated() {
      this.getGoodsList()
       // 获取店铺商品类目
      this.getCategoryLists()
    },

    watch: {
      // 监听全选的状态变化
      'isCheckedAll' (now, old) {
        this.checkAll(now)
      }
    },

    methods: {
      offSelete() {
        this.isShowCategroy = false
        this.$refs.subSelect1.offSelect()
        this.$refs.subSelect2.offSelect()
        this.$refs.subSelect3.offSelect()
      },
      async getMarketFlag() {
        const res = await fetchJson.post('/api/system/mall/sale-supplier-goods/get-enabled-flag', 'params', {})
        if (res.statusCode === '200') {
          if (res.responseContent.flag == 0) {
            this.$router.push({
              path: './shop'
            })
          }
        }
      },
      /*
       * 获取商品列表
       * param {number} state 商品状态
       */
      async getGoodsList() {
        this.isLoading = true;
        let isCache = this.$route.query.isCache;
        if (isCache) {
          if (sessionStorage.getItem('marketList')) {
            this.model = JSON.parse(sessionStorage.getItem('marketList'))
            this.model.SelectValue1 = 0,
              this.model.SelectValue2 = 0,
              this.model.SelectValue3 = 0,
              sessionStorage.removeItem('marketList')
          };
        }
        let param = {
          offset: this.pageInfo.offset,
          limit: this.pageInfo.limit,
          name: this.model.name,
          brandName: this.model.brandName,
          hideZeroStock: true, // 字段hideZeroStock：是否隐藏零库存商品?true=>隐藏，false=>不隐藏（显示）
          categoryId: this.model.SelectValue3 ? this.model.SelectValue3 : this.model.SelectValue2 && !this.model.SelectValue3 ?
            this.model.SelectValue2 : this.model.SelectValue1 ? this.model.SelectValue1 : '', // 商品品类id
        }
        this.model = Object.assign({}, this.model)
        let loading = window.layer.load(2)
        const res = await fetchJson.post(apiMarket.goodsMarketList, 'params', param)
        this.isLoading = false;
        window.layer.close(loading)
        if (res.statusCode === '200') {
          this.model.dataLists = res.responseContent;
          this.pageInfo.total = res.responseContent.total
        }
        this.$refs.allChecked.toChecked(false)
      },
      // 表格全选checkebox
      checkAll(value) {
        this.$refs.itemChecked.map(item => item.toChecked(value))
      },
      /**
       * 顶部tab切换
       * @param {Number} state
       */
      changeTabList(state) {
        this.model.tabState = state
        this.pageInfo.offset = 1
        this.isCheckedAll = false
        if (state == 0) {
          this.getGoodsList()
        } else {
          this.getChangeLogs()
        }
      },
      // 获取变更记录
      async getChangeLogs() {
        this.isCheckedAll = false;
        let loading = window.layer.load(2)
        const res = await fetchJson.post(apiMarket.goodsMarketChangeList, 'params', {
          offset: this.pageInfo.offset,
          limit: this.pageInfo.limit
        })
        window.layer.close(loading)
        if (res.statusCode === '200') {
          this.changeLogs = res.responseContent.list;
          this.pageInfo.total = res.responseContent.total
        }
      },

      /**
       * 条件筛选查询
       */
      queryData() {
        this.getGoodsList()
      },


      /**
       * 查看分销商品详情
       * @param {String} goodsId
       */
      toDetial(goodsId) {
        sessionStorage.setItem('marketList', JSON.stringify(this.model))
        this.$router.push({
          name: 'goodsDetial',
          query: {
            goodsId
          }
        })
      },
      // 页面切换
      recievePage(msg) {
        this.pageInfo.offset = msg;
        if (this.model.tabState == 0) {
          this.getGoodsList();
        } else {
          this.getChangeLogs();
        }
      },


      // 获取商城商品分类
      async getMallCateGoryTree() {
        const res = await fetchJson.post(api.getMallCategoryTree, 'params', {
          id: 0
        })
        if (res.statusCode == 200) {
          res.responseContent.map(item => {
            this.selectLevel1.selectOptions.push({
              Text: item.name,
              Value: item.id,
              children: item.children
            })

          })
        }
      },
      /**
       * 下拉列表下拉后触发
       */
      async onSelect(value) {
        this.selectLevel2.selectOptions = this.selectLevel2.selectOptions.slice(0, 1);
        this.selectLevel3.selectOptions = this.selectLevel3.selectOptions.slice(0, 1);
        this.model.SelectValue2 = 0;
        this.model.SelectValue3 = 0;
        this.$refs.subSelect2.resetDate();
        this.$refs.subSelect3.resetDate();

        let that = this;
        if (value == 0) return
        this.selectLevel1.selectOptions.map(item => {
          if (item.Value == value) {
            item.children.map(child => {
              that.model.SelectValue2 = 0;
              that.selectLevel2.selectOptions.push({
                Value: child.id,
                Text: child.name,
                children: child.children
              });
            })
          }
        })
      },

      // 选择2级分类
      async onSelect2(value) {
        this.selectLevel3.selectOptions = this.selectLevel3.selectOptions.slice(0, 1);
        this.model.SelectValue3 = 0;
        this.$refs.subSelect3.resetDate();

        let that = this;
        if (value == 0) {
          return
        }
        this.selectLevel2.selectOptions.map(item => {
          if (item.Value == value) {
            item.children.map(child => {
              that.model.SelectValue3 = 0;
              that.selectLevel3.selectOptions.push({
                Value: child.id,
                Text: child.name,
                children: child.children
              });
            })
          }
        })
      },

      /*
       *获取列表中选中的id
       * return {boole} false
       * return {array} goodsIds
       */
      getitemIds() {
        let goodsIds = []; // 选中的id 数组集合
        this.model.dataLists.list.map(item => {
          if (item.isChecked) {
            goodsIds.push(item.id)
          }
        })
        if (goodsIds.length == 0) {
          this.$utils.layerMsg.warning('请先选择商品在进行操作！')
          return false;
        } else {
          return goodsIds;
        }
      },

      // 获取商品类目
      async getCategoryLists() {
        const res = await fetchJson.post(api.getCategoryTree, "params", {
          id: 0
        });
        if (res.statusCode == 200) {
          this.categoryLists = res.responseContent;
        }
      },

      /**
       * 删除
       * @param {String} goodsId
       */
      doDelete(goodsId) {
        let goodsIds = []
        let that = this
        if (goodsId) {
          goodsIds.push(goodsId)
        } else {
          goodsIds = this.getitemIds();
        }
        if (!goodsIds) {
          return
        }
        let index = window.layer.confirm(
          '<p class="padding_top30">确定删除选中商品？</p>', {
            title: '删除商品',
            btn: ["确 定", "取 消"], // 按钮
            area: ["600px", "265px"]
          },
          async function () {
            // 执行删除操作
            window.layer.close(index)
            const res = await fetchJson.post(api.batchDelete, 'data', {
              goodsIds
            })
            if (res.statusCode == 200) {
              that.$utils.layerMsg.success('商品删除成功！')
              that.getGoodsList()
            } else {
              that.$utils.layerMsg.success(res.statusMessage)
            }
          },
          function (index) {
            // 执行取消操作
            window.layer.close(index);
          }
        );
      },

      /** 上架 */
      putaway(id) {
        this.goodsIds = []
        let that = this;
        if (id) {
          this.goodsIds.push(id);
        } else {
          this.model.dataLists.list.map(item => {
            if (item.isChecked) {
              that.goodsIds.push(item.id)
            }
          })
        }
        if (this.goodsIds.length === 0) {
          this.$utils.layerMsg.warning('请先勾选商品！')
          return
        }
        this.dialogIndex = this.$utils.layerOpen({
          title: '确定上架',
          height: '400px',
          width: '600px',
          content: $('#putawayDialog'),
          end: function () {
            that.model.categroy = ''
          }
        })
      },

      // 上架到店铺
      async putawayToOnline() {
        let shopCatId
        if (this.bufferCatCategory.length === 0) {
          this.$utils.layerMsg.warning('请选择分类')
          return ''
        }
        shopCatId = this.bufferCatCategory[this.bufferCatCategory.length - 1].id
        const loading = window.layer.load(2)
        const res = await fetchJson.post(apiMarket.putAwaySupplier, 'data', {
          goodsIds: this.goodsIds,
          shopCatId
        })
        window.layer.close(loading)
        if (res.statusCode === '200') {
          window.layer.close(this.dialogIndex)
          this.$utils.layerMsg.success('成功上架到店铺!')
          this.getGoodsList()
        }
      },
      // 上架到仓库
      async putawayToBuff() {
        let shopCatId
        if (this.bufferCatCategory.length === 0) {
          this.$utils.layerMsg.warning('请选择分类')
          return ''
        }
        shopCatId = this.bufferCatCategory[this.bufferCatCategory.length - 1].id
        const loading = window.layer.load(2)
        const res = await fetchJson.post(apiMarket.putAwayBufSupplier, 'data', {
          goodsIds: this.goodsIds,
          shopCatId
        })
        window.layer.close(loading)
        if (res.statusCode === '200') {
          window.layer.close(this.dialogIndex)
          this.$utils.layerMsg.success('成功上架到仓库!')
          this.getGoodsList()
        }
      },
      // 店铺内商品类目选择
      showLevel() {
        this.isShowCategroy = !this.isShowCategroy;
      },

      checkCatFirstLevel(item) {
        this.FirstLevel = false;
        this.categoryItemChildren = item.children;
        this.bufferCatCategory = [];
        this.bufferCatCategory.push(item);
        if (this.categoryItemChildren.length == 0) {
          this.isShowCategroy = false
          this.FirstLevel = true;
          this.model.categroy = item.name
          return;
        } else {
          this.SecondLevel = true;
        }
        this.firstLevel = item.name;
      },

      checkCatSecondLevel(child) {
        this.isShowCategroy = false;
        this.SecondLevel = false;
        this.firstLevel = '请选择';
        this.FirstLevel = true;

        this.bufferCatCategory.push(child)
        let categoryArr = [];
        this.bufferCatCategory.map(item => {
          categoryArr.push(item.name)
        })
        this.model.categroy = categoryArr.join(' — ')
      },
    }

  }

</script>

<style lang="less" scoped>
  @import url('../../assets/less/variable.less');
  @import url("../../assets/less/goods.less");
  .padding_left20 {
    padding-left: 20px !important;
  }

  .w40 {
    width: 30px;
  }

  .good_content {
    margin-top: 20px;
    border-bottom: none
  } // 上架弹框
  .putaway_box {
    position: relative;
    .icon-select-arrow {
      display: block;
      position: absolute;
      right: 20px;
      top: 38px;
      cursor: pointer;
      transition: all .3s;

      &.active {
        transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        /* IE 9 */
        -moz-transform: rotate(180deg);
        /* Firefox */
        -webkit-transform: rotate(180deg);
        /* Safari 和 Chrome */
        -o-transform: rotate(180deg);
        /* Opera */
      }
    }

    .dropdown {
      width: 362px;
      top: 62px;
      left: 0;
      height: auto;
    }
  }

  .tab_header span {
    cursor: pointer;
    &:hover {
      color: @color-orange-hover
    }
  }

</style>
