/* * @Author: Yuyd * @Date: 2018-01-02 14:20:07 * @Last Modified by: Yuyd * @Last Modified time: 2018-01-02 17:01:17 * 商品详情
*/
<template>
  <div class="goodsDetial" @click="isShowCategroy = false">
    <div class="title_crumbs">
      <router-link class="f_14" :to="{name: 'marketList', query:{isCache: true}}">我要分销</router-link> > 商品详情
    </div>
    <div class="detial_main clearfix">
      <div class="show_img fl">
        <div class="big_pic">
          <Magnifier :src="currentImage.picUrl||goodsDetial.picUrl" :magnification="3"></Magnifier>
        </div>
        <div class="small_pic">
          <div class="text_center">
            <div class="f_left img_box" @click="changePic(item.picUrl,i)" v-for="(item,i) in goodsDetial.picUrls " :key="i" :class="{'select': i == currentImage.id }">
              <a href="javascript:">
                <img :src="item.picUrl" width="68" height="68" class="border">
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="show_attr f_left">
        <p class="attr_name">{{goodsDetial.name}}</p>
        <div class="good_price">
          <span class="padding_top20 inline_block">
            <i>供货价：
              <i class="f_orange">￥</i>
            </i>
            <span class="old-price iblock">{{ goodsDetial.price | FloatTwo }}</span>
          </span>
        </div>
        <div class="attr_address padding_top20 f_info">
          <label class="f_left">配送至：</label>
          <input ref="selectText" v-model="selectText" readonlyunselectable="on" readonly />
          <Addr ref="addr" :show="true" @onSelect="selectPosition"></Addr>
          <i @click="$refs.selectText.focus()"></i>
          <span class="deliveryFee">运费：{{ deliveryPrice | currency}}</span>
        </div>

        <div class="attr_item padding_top20 clearfix attr_gg" v-for="(goodsAttr,i) in goodsDetial.attrs" :key="i">
          <i class="f_left">{{goodsAttr.attrName}}：</i>
          <span class="f_left attr_item_info">
            <b :class="{'active': attrDetail.isChecked == true}" :key="ii" v-for="(attrDetail,ii) in goodsAttr.details" @click="changeGoodsAttr(goodsAttr, attrDetail.sortIndex)">
              {{attrDetail.attrValName}}
            </b>
          </span>
        </div>
        <div class="attr_item padding_top20">
          <i>库存：</i> {{goodsDetial.stock? '有货': '无货'}}
        </div>
        <div class="attr_item padding_top20">
          <input type="button" class="btn btn_white_orange" value="添加至仓库" @click="putaway(0)">
          <input type="button" class="btn btn_light_orange" value="上架到店铺" @click="putaway(1)">
        </div>

        <p class="padding_top20 f_label">本商品由“苏宁”供货并提供售后服务，支持7天无理由退货</p>

      </div>
    </div>

    <div class="detial_msg">
      <ul class="tab">
        <li :class="{active: detialInfo == 1}" @click="detialInfo =1">商品详情</li>
        <li :class="{active: detialInfo == 2}" @click="detialInfo =2">包装及参数</li>
      </ul>
      <div class="tab_content">
        <ul class="clearfix" v-show="detialInfo == 1">
          <li>
            <label for="">品牌：</label> {{goodsDetial.brandName || '--'}}
          </li>
          <li>
            <label for="">重量：</label> {{goodsDetial.weight | FloatTwo}} kg
          </li>
          <li>
            <label for="">型号：</label> {{goodsDetial.goodsModel}}
          </li>
          <li>
            <label for="">销售单位：</label> {{goodsDetial.salesUnit}}
          </li>
        </ul>
        <dl v-show="detialInfo == 2" v-for="item in goodsDetial.goodsPackageTypeList">
          <dt>
            {{item.name}}
          </dt>
          <dd class="clearfix" v-for="itemInfo in item.goodsPackageInfoList">
            <div class="list_row">
              <div class="list_cell list_cell_label">{{itemInfo.propName}}</div>
              <div class="list_cell">{{itemInfo.propValue}}</div>
            </div>
          </dd>
        </dl>
      </div>
      <div class="detial_pic margin_top10 text_center" v-html="goodsDetial.description">
      </div>
    </div>
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
      </div>
      <div>
        <input class="btn_light_orange" type="button" value="确定" @click="submitPutaway()">
        <input class="btn_white_orange" type="button" value="取消" @click="cancelPutaway()">
      </div>
    </div>

  </div>
</template>
<script>
  import Magnifier from '../../components/magnifier'
  import demo from '../../assets/img/dev/pic_sample.png'
  import api from '../../api/api'
  import fetchJson from '../../api/http'
  import apiMarket from '../../api/market'
  import Addr from '../../components/address'
  export default {
    name: 'GoodsDetial',
    components: {
      Magnifier,
      Addr
    },
    data() {
      return {
        goodsId: '',
        dialogIndex: null, // 弹框
        putawayType: null, // 上架类型 0， 1 仓库，店铺
        goodsInfoType: 1, // 显示商品详情 1 2
        categoryLists: [], // 分类列表
        isShowCategroy: false, // 显示列表
        firstLevel: '请选择',
        secondLevel: '',
        FirstLevel: true,
        SecondLevel: false,
        bufferCatCategory: [], // 存储选中的category lists
        categoryItemChildren: [],
        currentImage: { // 当前选中商品图片
          picUrl: demo,
          id: ''
        },
        model: {
          categroy: ''
        },
        currentImage: { // 当前选中商品图片
          picUrl: '',
          id: ''
        },
        areaId: "440305", //默认 广东省 深圳市 南山区 id,
        selectText: '广东省 深圳市 南山区', // 默认地区
        goodsDetial: {},
        detialInfo: 1,
        skuUid: '', // 商品属性Id
        deliveryPrice: 0, // 运费
        isShow: false,
        selectText: '广东省 深圳市 南山区' // 默认地区
      }
    },
    async mounted() {
      try {
        const res = await fetchJson.post('/api/system/mall/sale-supplier-goods/get-enabled-flag', 'params', {})
        if (res.statusCode === '200') {
          if (res.responseContent.flag == 0) {
            this.$router.push({
              path: './shop'
            })
          }
        }
        await this.getCategroyTree()
        // 获取商品详情
        await this.getGoodsDetial();
      } catch (err) {
        throw err
      }

    },
    methods: {
      changePic(url, index) {
        this.currentImage.picUrl = url;
        this.currentImage.id = index
      },

      // 获取商城商品分类
      async getCategroyTree() {
        const res = await fetchJson.post(api.getCategoryTree, 'params', {
          id: 0
        })
        if (res.statusCode === '200') {
          this.categoryLists = res.responseContent
        }
      },

      // 获取商品详情
      async getGoodsDetial() {
        let id = this.$route.query.goodsId;
        const loading = window.layer.load(2);
        const res = await fetchJson.post(apiMarket.goodsDetial, 'params', {
          id
        })
        window.layer.close(loading);
        this.isShow = true;
        if (res.statusCode === '200') {
          res.responseContent.description = res.responseContent.description.replace(/<a/g, '<span').replace(/<\/a/g, '</span')
          this.goodsDetial = res.responseContent;
          this.currentImage.picUrl = this.goodsDetial.picUrl;
          await this.getGoodsDefaultSku(id);

        }
        // }
      },

      /**
       * 上架
       * @param {Number} putType 0,1 分别上架到仓库，和销售
       */
      putaway(putType) {
        let that = this
        let titleTxt = ''
        titleTxt = putType === 0 ? '添加到仓库' : '上架到店铺'
        this.putawayType = putType
        this.dialogIndex = this.$utils.layerOpen({
          title: titleTxt,
          height: '400px',
          width: '600px',
          content: $('#putawayDialog'),
          end() {
            that.model.categroy = ''
          },
          cancel() {
            that.model.categroy = ''
          }
        })
      },

      /**
       * 提交上架
       */
      async submitPutaway() {
        if (!this.model.categroy) {
          this.$utils.layerMsg.warning('请选择商品分类！')
          return ''
        }
        let res = null;
        let shopCatId = this.bufferCatCategory[this.bufferCatCategory.length - 1].id
        let goodsIds = [];
        goodsIds.push(this.$route.query.goodsId)
        if (this.putawayType == 0) {
          res = await fetchJson.post(apiMarket.putAwayBufSupplier, 'data', {
            goodsIds,
            shopCatId
          })
        } else {
          res = await fetchJson.post(apiMarket.putAwaySupplier, 'data', {
            goodsIds,
            shopCatId
          })
        }
        if (res.statusCode === '200') {
          window.layer.close(this.dialogIndex)
          let msg = null;
          if (this.putawayType == 0) {
            msg = '成功上架到仓库！'
          } else {
            msg = '成功上架到店铺！'
          }
          this.$utils.layerMsg.success(msg)
          this.$router.push({
            name: 'marketList'
          })
        }
      },
      // 取消提交
      cancelPutaway() {
        this.model.categroy == ''
        window.layer.close(this.dialogIndex)
      },


      // 店铺内商品类目选择
      showLevel() {
        this.isShowCategroy = !this.isShowCategroy
      },
      checkCatFirstLevel(item) {
        this.FirstLevel = false
        this.categoryItemChildren = item.children
        this.bufferCatCategory = []
        this.bufferCatCategory.push(item)
        if (this.categoryItemChildren.length === 0) {
          this.isShowCategroy = false
          this.FirstLevel = true
          this.model.categroy = item.name
          return
        } else {
          this.SecondLevel = true
        }
        this.firstLevel = item.name
      },
      checkCatSecondLevel(child) {
        this.isShowCategroy = false
        this.SecondLevel = false
        this.firstLevel = '请选择'
        this.FirstLevel = true

        this.bufferCatCategory.push(child)
        let categoryArr = []
        this.bufferCatCategory.map(item => {
          categoryArr.push(item.name)
        })
        this.model.categroy = categoryArr.join(' — ')
      },

      /**
       * 查看商品详情1,2
       * @param {Number} type
       */
      seeGoodsInfo(type) {
        this.goodsInfoType = type
      },

      // 获取商品默认sku
      async getGoodsDefaultSku(id) {
        const res = await fetchJson.post(apiMarket.getGoodsDefaultSku, 'params', {
          goodsId: id
        })
        //
        let that = this;
        if (res.statusCode === '200' && res.responseContent) {
          this.skuUid = res.skuUid;
          this.goodsDetial.price = res.responseContent.price;
          this.goodsDetial.stock = res.responseContent.stock;
          res.responseContent.details && res.responseContent.details.map(detail => {
            that.goodsDetial.attrs.map(item => {
              item.details.map(attrVal => {
                if(attrVal.attrValName == detail.attrValName) {
                  attrVal.isChecked = true;
                }
              })
            })
          })
          // 获取运费
          await this.getGoodsDelivery()
        }
      },

      // 获取动态Sku
      async getGoodsChangeSku() {
        let goodsSkuAttrDTOList = [];
        this.goodsDetial.attrs.map(item => {
          item.details.map(detail => {
            if (detail.isChecked) {
              goodsSkuAttrDTOList.push({
                attrName: item.attrName,
                attrValName: detail.attrValName
              })
            }
          })
        })
        const res = await fetchJson.post(apiMarket.getSkuByAttr, 'data', {
          goodsId: this.$route.query.goodsId,
          goodsSkuAttrDTOList
        })
        if (res.statusCode === '200') {
          this.skuUid = res.responseContent.skuUid;
          this.goodsDetial.price = res.responseContent.price;
          this.goodsDetial.stock = res.responseContent.stock;
          this.goodsDetial.name = res.responseContent.goodsName || this.goodsDetial.name;
          this.goodsDetial.description = res.responseContent.description || this.goodsDetial.description;
          this.goodsDetial.picUrls = res.responseContent.skuPicList || this.goodsDetial.picUrls
          await this.getGoodsDelivery()
        }
      },

      //选择地区完成后 事件
      selectPosition(value, areaId) {
        this.areaId = areaId;
        // console.log(this.isShowAddr);
        this.selectText = value;
        this.getGoodsDelivery();
      },

      // 获取运费
      async getGoodsDelivery() {
        const res = await fetchJson.post(
          apiMarket.deliveryPriceCount, 'data', {
            areaId: this.areaId,
            deliveryFeeGoodDTOList: [{
              skuUid: this.skuUid,
              goodsId: this.$route.query.goodsId,
              quantity: 1,
            }]
          })
        this.deliveryPrice = res.responseContent;

      },

      //改变属性 重新获取Sku 赋值到defaultSku 、重新计算运费
      changeGoodsAttr(obj, sortIndex) {
        obj.details.map(item => {
          item.isChecked = false
        })
        obj.details[sortIndex - 1].isChecked = true
        obj.details = Object.assign([], obj.details)

        this.getGoodsChangeSku();
      }
    }
  }

</script>
<style lang="less" scoped>
  @import url('../../assets/less/variable.less');
  @import url("../../assets/less/goods.less");
  .list_row{
    display: table-row
  }
  .list_cell {
    display: table-cell;
    vertical-align: middle;
    padding: 10px 20px;
  }

  .list_cell_label{
    width: 120px;
    border-right: 1px solid @color-border;
  }

  .small_pic {
    margin-top: 10px;
    &.select {
      border: 1px solid @color-orange;
    }
    .img_box {
      margin-right: 13px;
    }
  }

  .detial_main {
    width: 1040px;
    padding: 10px;
    background: @color-white;
  }

  .show_attr {
    margin-left: 25px;
    width: 575px;

    .attr_name {
      padding-top: 20px;
      padding-bottom: 40px;
      font-size: 24px;
      color: @color-3;
      line-height: 30px;
    }

    .good_price {
      height: 55px;
      width: 550px;
      padding-left: 25px;
      background: #FCF4F1;

      .old-price {
        font-size: 24px;
        color: @color-orange;
        font-weight: 600;
      }
    }

    .attr_address {
      input {
        float: left;
        height: 20px;
        border: none;
        margin-top: -1px;

      }
      i {
        display: block;
        float: left;
        border: 6px solid transparent;
        border-top: 6px solid @color-9;
        width: 0px;
        height: 0;
        margin-top: 6px;
        margin-right: 14px;
        cursor: pointer;
      }
    }
    .attr_item {
      color: @color-6;
      line-height: 40px;
      .attr_item_info {
        width: 490px;
      }
      b {
        display: inline-block;
        padding: 0 20px;
        border: 1px solid @color-border;
        margin-right: 10px;
        margin-bottom: 10px;
        color: @color-6;
        font-weight: 500;
        cursor: pointer;

        &.active {
          color: @color-orange;
          border: 1px solid @color-orange;
        }
      }
      i {
        margin-right: 35px
      }

      .btn {
        width: 230px;
        height: 50px;
        &:first-child {
          margin-right: 20px;
        }
      }
    }
  }

  .detial_msg {
    width: 1060px;
    .tab {
      margin-top: 10px;
      background: #EBEBEB;
      line-height: 50px;
      overflow: hidden;
      border-bottom: 2px solid @color-orange;
      font-size: 16px;

      li {
        float: left;
        width: 200px;
        text-align: center;
        cursor: pointer;

        &.active {
          color: @color-white;
          background: @color-orange;
        }
      }
    }
    .tab_content {
      padding: 30px;
      margin-top: 10px;
      background: @color-white;

      ul>li {
        float: left;
        width: 33%;
        line-height: 30px;
      }

      dl {
        width: 700px;
        border: 1px solid @color-border;
        dt {
          line-height: 40px;
          padding-left: 20px;
          background: @color-section-header
        }
        dd {
          border-top: 1px solid @color-border;
          label {
            display: inline-block;
            width: 200px;
            border-right: 1px solid @color-border;
            padding: 10px 20px;
          } // padding:10px 20px;
        }
      }
    }
  }

  .detial_pic {
    margin-top: 10px;
    background: @color-white;
    padding: 10px;
  }

  .section-opt {
    margin-left: 100px;


    .row-attr {
      position: relative;
      width: 825px;
      input {
        box-sizing: border-box;
        padding: 0 6px;
        height: 40px;
        width: 100%;
      }

      .remove-attr {
        position: absolute;
        top: -10px;
        right: -10px;
      }
    }
  }

  .row-details {
    padding: 20px 0;
    line-height: 40px;

    .row-details-item {
      float: left;
      margin-right: 20px;
      text-align: center;
      height: 40px;
      line-height: 40px;
      position: relative;

      .remove-spec {
        position: absolute;
        top: -10px;
        right: -10px;
      }
      input {
        text-align: center;
        height: 40px;
        width: 160px;
      }
    }
  } // 规格表格展示
  .section-opt {
    // padding: 20px;
    table th,
    table td {
      padding: 10px;
      width: 100px !important;
      input {
        box-sizing: border-box;
        width: 100px;
        height: 40px;
        padding: 0 6px;

      }
    }
  }

  input[type="text"] {
    border: 1px solid @color-border-text;
  } //
  .radio_group {
    margin-top: 20px;
    line-height: 40px;
    label {
      padding-top: 4px;
      margin-right: 30px;
    }
  }

  .batch_input input {
    width: 370px;
    height: 40px;
    line-height: 40px;
    padding: 0 6px; // margin-left: 100px;
  }

  .total_store {
    height: 40px;
    line-height: 40px;
    width: 160px;
    background: @color-e;
    box-sizing: border-box;
    padding: 0 6px;
    margin: 0 10px 0 10px;
  }

  .table_box {
    padding: 20px;
    margin-left: 10px;
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

  .select {
    border: 1px solid @color-orange;
  }

  .attr_address {
    position: relative;
    input:focus {
      +.comp-address {
        display: block !important;
      }
    }
  }

</style>
