/* * @Author: Yuyd * @Date: 2018-01-02 14:21:13 * @Last Modified by: Yuyd * @Last Modified time: 2018-01-23 14:45:45 * 分销商品详情
*/

<template>
  <div class="m_main" @click="LevelShow = false, shopCatShow= false">
    <div class="title_crumbs">
      <router-link :to="{path:'/goodManage'}">全部商品</router-link> > 编辑商品
    </div>
    <div class="section_b">
      <!-- <h2 class="edit_title clearfix">
        <a class="edit_title_btn font_16" href="javascript:;" :class="{active: model.step == 1}">1.编辑商品信息</a>
        <a class="edit_title_btn font_16" href="javascript:;" :class="{active: model.step == 2}">2.编辑商品详情</a>
      </h2> -->
      <div class="basic">
        <h4 class="panel_title">商品基本信息</h4>
        <ul>
          <li class="item clearfix">
            <label for="" class="item_name f_left">* 商品名称：</label>
            <div class="f_left">
              <input type="text" class="name big_input" v-model="goodsDetial.name" maxlength="30" placeholder="商品名称描述不超过30字" @keyup="isEmpty(goodsDetial.name, 'name')">
            </div>
            <p class="item_error_tip" v-show="formTest.name">商品名称不可以为空</p>
          </li>
          <li class="item clearfix price">
            <div class="clearfix">
              <label for="" class="item_name f_left">* 商品价格：</label>
              <div class="f_left border price_input">
                <i>￥</i>
                <input class="" type="text" placeholder="0.00"
                v-model.trim="goodsDetial.price"
                @keyup="goodsDetial.price = goodsDetial.price? goodsDetial.price.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,''): '', formTest.price =false"
                @change="setDefaultPrice(goodsDetial, goodsDetial.purchasePrice)">
              </div>
            </div>
            <div class="price_other">
              <div class="f_left border">
                <label class="f_left" for="">原价</label>
                <div class="f_left">
                  <i>&nbsp;&nbsp;￥</i>
                  <input type="text" placeholder="0.00" v-model="goodsDetial.originalPrice" @keyup="goodsDetial.originalPrice = goodsDetial.originalPrice ? goodsDetial.originalPrice.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,''): ''"
                    @change="setValueTwofixed(goodsDetial, 'originalPrice')">
                </div>
              </div>
              <div class="f_left border input_disable">
                <label class="f_left second" for="">供货价</label>
                <div class="f_left">
                  <i>&nbsp;&nbsp;￥</i>
                  <input type="text" class="second" placeholder="0.00" v-model="goodsDetial.purchasePrice " readonly>
                </div>
              </div>
              <div class="f_left border f_orange input_disable" v-show="profit">
                <label class="f_left" for="">利润</label>
                <div class="f_left">
                  <i>&nbsp;&nbsp;￥</i>
                  <input type="text" class="f_orange " :value="profit" readonly>
                </div>
              </div>
            </div>
            <p class="item_error_tip" v-show="formTest.price">价格必须大于等于供货价</p>
          </li>
          <li class="item switch clearfix">

              <span class="f_left switch_label"> 积分格式展示商品价格</span>
              <my-radio class="f-left" v-model="model.switchType" :disabled="isPayClassify" :options="switchRadioOptions"></my-radio>
          </li>
          <li class="item good_type clearfix">
            <label for="" class="item_name f_left">* 商品类型：</label>
            <my-radio class="f-left" v-model="goodsType" :disabled="true" :options="radioOptions"></my-radio>
          </li>
          <li class="item goods_class">
            <label for="" class="item_name">* 商品品牌：</label>
            <input class="input_disable" type="text" readonly :value="goodsDetial.brandName">
          </li>
          <li class="item goods_class">
            <label for="" class="item_name">* 商品类目：</label>
            <input type="text" class="input_disable" readonly :value="model.category">
          </li>
          <li class="item upload clearfix">
            <label for="" class="item_name">*商品图片：</label>
            <a href="javascript:;" class="handle" @click="toGoodsDetial(goodsDetial.supplierGoodsId)">查看商品详情 ></a>
          </li>
          <li class="item remark">
            <label for="" class="item_name">备注：</label>
            <input type="text" v-model="goodsDetial.remark">
          </li>
        </ul>
        <h4 class="panel_title">商品库存/规格</h4>
        <ul v-show="goodsDetial.skus && goodsDetial.skus.length == 0">
          <li class="item">
            <label for="" class="item_name">* 库存： </label>
            <input type="text" class="input_disable" :value="goodsDetial.stock>0? '有货': '无货' " readonly>
          </li>
          <li class="item">
            <label for="" class="item_name">商品编码：</label>
            <input class="input_disable" readonly type="text" v-model="goodsDetial.goodsSn">
          </li>

        </ul>
        <ul v-show="goodsDetial.skus && goodsDetial.skus.length>0">
          <li class="clearfix padding_top10">
            <!-- <goods-spec @goodsSpec="recieveGoodsSpec" :optAttrs="model.attrs" :optSkus="model.skus"></goods-spec> -->
            <div class="section-opt border bg_white table_box f_left">
              <table border="0" cellspacing="0" cellpadding="0" class="text_left">
                <thead class="table-head border_bottom">
                  <th class="table-head-th" v-for="(attr, index) in goodsDetial.attrs" :key="`optItem${index}`">
                    {{attr.attrName}}
                  </th>
                  <th class="table-head-th">
                    <i>*</i>价格</th>
                  <th class="table-head-th">原价</th>
                  <th>供货价</th>
                  <th>利润</th>
                  <th class="table-head-th">
                    <i>*</i>库存</th>
                  <th class="table-head-th">商品编码</th>
                  <th class="table-head-th">
                    <i></i>销量</th>
                  <th>是否销售</th>
                </thead>
                <!-- <tr v-if="optSpecs.length==0"></tr> -->
                <tr class="table-row border_top f_info" v-for="(item, index) in goodsDetial.skus" :key="`items_${index}`">
                  <td v-for="(specItem, index) in item.details" class="table-row-td" :key="`specItem${index}`">
                    {{specItem.name}}
                  </td>
                  <td>
                    <input type="text" v-model="item.price" maxlength="6" @change="setValueTwofixed(item, 'price')" @keyup="item.price = item.price ? item.price.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,''): ''"
                    />
                  </td>
                  <td class="table-row-td">
                    <input type="text" v-model="item.originalPrice" maxlength="6" @change="setValueTwofixed(item, 'originalPrice');" @keyup="item.originalPrice = item.originalPrice ? item.originalPrice.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,''): ''"
                    />
                  </td>
                  <td class="table-row-td">
                    {{item.purchasePrice | currency}}
                  </td>
                  <td class="table-row-td">
                    {{(Math.round(parseFloat(item.price - item.purchasePrice)*100)/100).toFixed(2)}}
                  </td>
                  <td>
                    {{item.stock}}
                  </td>
                  <td>{{item.goodsSn}}</td>
                  <td>{{item.saleQuantity}}</td>
                  <td class="table-row-td">
                    <my-checkbox v-model="item.status"></my-checkbox>
                  </td>
                </tr>
              </table>

              <div class="radio_group border_top f_info" v-show="goodsDetial.skus && goodsDetial.skus.length>1">
                <label class="f_left padding_top10" for="">批量设置：</label>
                <div>
                  <div class="batch_input padding_top10 ">
                    <div class="f_left margin_right20">
                      <input v-model="model.batchPrice" type="text" placeholder="请输入价格" key="batchPrice" @change="setValueTwofixed(model, 'batchPrice')"
                        @keyup="model.batchPrice = model.batchPrice.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')">
                    </div>
                    <span>
                      <a class="handle margin_right20" href="javascript:;" @click="saveBatch()">保存</a>|
                      <a class="handle margin_left20" href="javascript:;" @click="resetBatch()">取消</a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <h4 class="panel_title">商品设置</h4>
        <ul>
          <li class="item">
            <label for="" class="item_name">* 物流重量：</label>
            <input type="text" class="input_disable" readonly :value="goodsDetial.weight || 0">（kg）
          </li>
          <li class="item shopCat goods_class">
            <label for="" class="item_name">* 店铺分类：</label>
            <input type="text" placeholder="请选择分类" readonly @click.stop="showCarLevel()" v-model="model.shopCar">
            <div class="dropdown" v-show="shopCatShow" @mouseover="shopCatShow = true" @click.stop="">
              <div class="dropdown_title">
                <h3>选 择 商 品 品 类
                  <i class="close icon-close f_right" @click="shopCatShow = false"></i>
                </h3>
                <ul>
                  <li class="inline_block" :class="{active: ShopFirstLevel}" @click="ShopFirstLevel = true, shopCatFirstLevel = '请选择', ShopSecondLevel = false">
                    <span>{{shopCatFirstLevel }}</span>
                  </li>
                  <li class="inline_block" :class="{active: ShopSecondLevel}">
                    <span v-show="ShopSecondLevel">请选择</span>
                  </li>

                </ul>

              </div>
              <div class="dropdown_content">
                <ul v-show="ShopFirstLevel">
                  <li @click="checkCatFirstLevel(item)" v-for="(item, index) in catCategoryLists" :key="`categrory${index}`">{{item.name }}</li>
                </ul>
                <ul v-show="ShopSecondLevel">
                  <li v-for="(child, index) in catCategoryItemChildren" :key="`categoryItem${index}`" @click="checkCatSecondLevel(child)">{{child.name }}</li>
                </ul>
              </div>
            </div>
            <a href="javascript:;" class="handle" @click="getCategoryLists()">&nbsp;&nbsp; 刷新</a>&nbsp;&nbsp; | &nbsp;&nbsp;
            <a href="javscript:;" class="handle" @click="toCreateShopCar()">新建分类</a>

            <p class="item_error_tip" v-show="formTest.shopCar">店铺类目不可以为空</p>
          </li>
          <li class="item clearfix astrict">
            <label for="" class="item_name f_left">包装及参数：</label>
            <a href="javascript:;" class="handle" @click="toGoodsDetial(goodsDetial.supplierGoodsId)">查看商品详情 ></a>
          </li>
        </ul>
        <!-- <div class="add_attr">
          <input class="btn_orange" type="button" @click="nextStep()" value="下一步">
        </div> -->
      </div>

      <div class="step2">
        <!-- <div class="editor clearfix">
          <!-- <my-editor ref="editor" :value="model.description" @getValue="editorValue"></my-editor> -->
          <!-- <my-editor :defaultMsg="model.description" :config="config" @content='editorValue'></my-editor> -->
        <!-- </div> -->
        <div class="margin_top30">
          <input type="button" class="btn_orange" @click="putawayStore(1)" value="上架">
          <input type="button" class="btn_white_orange" value="保存至仓库" @click="putawayStore(2)">
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import api from '../../api/api'
  import apiMarket from '../../api/market'
  import fetchJson from '../../api/http'
  import MyRadio from '../../components/Radio.vue'
  import MyCheckbox from '../../components/Checkbox.vue'
  // import MyEditor from '../../components/Editor.vue'
  // import MyEditor from '../../components/Ueditor.vue'
  export default {
    name: 'marketEdit',
    components: {
      MyRadio,
      // MyEditor,
      MyCheckbox
    },
    props: ['payClassify'],
    data() {
      return {
        batchPrice: '',
        isUpload: true, // 是否可以上传
        bufferCatCategory: [], // 店铺
        bufferCategory: [], // 暂时存储选择的类目数据数据
        catCategoryLists: [], // 类目列表
        catCategoryItemChildren: [],
        categoryItemChildren: [], // 子类目列表
        categorySecondChildren: [],
        goodsDetial: {}, // 商品详情

        // 店铺商品分类
        shopCatShow: false,
        shopCatFirstLevel: '请选择',
        shopCatSecondLevel: '',
        ShopFirstLevel: true,
        ShopSecondLevel: false,
        size: 5,
        uploadNum: 0,
        goodsType: 3, // 商品类型;1==>实物商品,2=>虚拟商品
        model: {
          batchPrice: '',
          shopCar: '',
          RadioValue: 1,
          SelectValue: 1,
          name: '', // 商品名称
          price: '', // 商品价格
          originalPrice: '', // 原价
          switchType: '1',
          category: '', // 商品分类编号
          categoryId: '',
          remark: '', // 备注
          goodsSn: '', // 商品编码
          weight: 0, // 商品重量
          shopCatId: '', // 店铺商品分类编号
          description: '', // 商品描述
        },
        curEditModel: {},

        formTest: {
          name: false, // 商品名称验证
          price: false, // 价格验证
          categoryError: false, // 类目
          picError: false, // 图片
          stock: false, // 库存
          category: false, // 商城品类
          shopCar: false,
          picUrls: false, // 图片数量验证,
          weight: false,
          deliveryFeeType: false,
        },

        firstLevel: '请选择',
        secondLevel: '',
        thirdLevel: '',
        switchRadioOptions: [{
          Text: '开',
          Value: 1
        },
        {
          Text: '关',
          Value: 0
        }],
        radioOptions: [
            {
            Text: '实物商品',
            info: '（物流发货）',
            Value: 1
           },
           {
            Text: '虚拟商品',
            info: '（无需物流）',
            Value: 2
           },
          {
            Text: '分销商品',
            Value: 3
          }
        ],
        selectDeleveryMsg: {
          size: {
            w: '162px',
            h: '42px'
          },
          selectOptions: []
        },

        number: 0, // 用来防止重复提交
        optAttrs: [],
        optSpecs: [],
      }
    },
    computed: {
      profit() {
        let profit = 0.00;
        profit = (Math.round((parseFloat(this.goodsDetial.price) - parseFloat(this.goodsDetial.purchasePrice)) * 100) /
          100).toFixed(2)
        if (isNaN(profit)){
          profit = '0.00'
        }
        return profit;
      },

      isPayClassify () { // //1=>仅现金 2=>仅积分 3=>积分&现金
        if(this.payClassify == 1) {
          this.model.switchType = 0;
          return true
        }else if (this.payClassify == 2) {
          this.model.switchType = 1;
          return true
        }else {
          return false
        }
      }
    },
    async mounted() {
      try {
        const res = await fetchJson.post('/api/system/mall/sale-supplier-goods/get-enabled-flag', 'params',{})
          if(res.statusCode === '200') {
            if(res.responseContent.flag == 0){
              this.$router.push({path: './shop'})
            }
            // bus.$emit('marketFlag', this.flag) // 分销状态是否开启
        }
        // this.$refs.editor
        await this.getGoodsDetial();
        // 获取商品类目
        await this.getCategoryLists();

      } catch (error) {
        throw error
      }
    },
    methods: {

      // 价格设置
      /**
       * 价格设置
       * @param {Nubmer} price
       * @param {Nubmer} supplierPrice
       */
      setDefaultPrice(goodsDetial, supplierPrice) {
        if (goodsDetial.price < supplierPrice) {
          this.formTest.price = true
        } else {
          goodsDetial.price = parseFloat(goodsDetial.price).toFixed(2) || 0.00
        }
        this.goodsDetial = Object.assign({}, this.goodsDetial)
      },
      // 查看商品详情
      toGoodsDetial(id) {
        let marketData = {
          model: this.model,
          goodsDetial: this.goodsDetial
        }
        sessionStorage.setItem('editMarket', JSON.stringify(marketData));// 对当前数据进行缓存

        this.$router.push({
          name: 'goodsDetial',
          query: {
            goodsId: id
          }
        })
      },

      /*
       * 批量设置价格
       */
      saveBatch() {
        let that = this;
        let purchasePriceArr = [] // 供货价数组
        this.goodsDetial.skus.map(item => {
          if (!item.purchasePrice) {
            item.purchasePrice = 0
          }
          purchasePriceArr.push(item.purchasePrice)
        })
        let smallPrcie = Math.max.apply(Math.max, purchasePriceArr);


        if (this.model.batchPrice >= smallPrcie) {
          this.goodsDetial.skus.map(item => {
            item.price = that.model.batchPrice
          })
        } else {
          this.$utils.layerMsg.warning('批量设置价格必须大于等于供货价')
          return;
        }

      },

      /**
       * 值保留两位小数
       * @param {Object} obj
       * @param {String} key
       */
      setValueTwofixed(obj, key) {

        let val = obj[key];
        if (!val) {
          return
        }
        obj[key] = parseFloat(val).toFixed(2)
        obj = Object.assign({}, obj)
      },

      /**
       *文本编辑器
       *@param {String}content
       */
      editorValue(content) {
        this.model.description = content;
      },
      //获取商品详情
      async getGoodsDetial() {
        let goodsId = this.$route.query.goodsId,
        that = this;
        let loading = layer.load(2);
        let editMarket = JSON.parse(window.sessionStorage.getItem('editMarket'));

        window.sessionStorage.removeItem('editMarket')
        if(editMarket && goodsId == editMarket.goodsDetial.id){
          window.layer.close(loading)
          this.model = editMarket.model;
          this.goodsDetial = editMarket.goodsDetial;
          this.bufferCatCategory = this.goodsDetial.shopCategoryTree
          return '';
        }
        const res = await fetchJson.post(apiMarket.supplierGoodsEdit, 'params', {
          id: goodsId
        });
        layer.close(loading)
        if (res.statusCode == 200) {
          this.goodsDetial = res.responseContent;
          if(!this.goodsDetial.remark){
            this.goodsDetial.remark = '本商品由“苏宁”提供并提供售后服务，支持七天无理由退货'
          }
          this.model = Object.assign({}, this.model, res.responseContent);
          let categoryArr = [], shopCatArr = [];
          res.responseContent.categoryTree && res.responseContent.categoryTree.map(item => {
            categoryArr.push(item.name)
          })
          res.responseContent.shopCategoryTree && res.responseContent.shopCategoryTree.map(item => {
            shopCatArr.push(item.name);
          })
          this.bufferCatCategory = res.responseContent.shopCategoryTree, // 店铺
            this.bufferCategory = res.responseContent.categoryTree, // 暂时存储选择的类目数据数据
            this.model.category = categoryArr.join(' — ')
            this.model.shopCar = shopCatArr.join(' — ')
            this.model.switchType = this.payClassify == 3 ? res.responseContent.displayWithIntegralFlag : this.model.switchType;
          this.model.skus.map(item => {
            item.details.map(val => {
              val.name = val.attrValName
            })

            item.spec = {};
            item.spec.price = item.price;
            item.spec.stock = item.stock;
            item.spec.originalPrice = item.originalPrice;
            item.spec.saleQuantity = item.saleQuantity;
            item.spec.code = item.goodsSn
          })
        }

      },

      /**
       * 判断是否为空
       * @param {any} val
       * @param {String} errorKey
       */
      isEmpty(val, errorKey) {
        this.formTest[errorKey] = this.$utils.isEmpty(val)
      },

      /**
       * 验证价格
       * @param {string}, parice
       */
      priceTest(price) {
        price = price.replace(/[^0-9]/g, '')
        this.model = Object.assign({}, this.model);
      },

      // 获取商品类目
      async getCategoryLists() {
        const res = await fetchJson.post(api.getCategoryTree, "params", {
          id: 0
        });
        if (res.statusCode == 200) {
          this.catCategoryLists = res.responseContent;
        }
      },

      /**
       * 保留两位小数
       */
      writeFixed2(key) {
        var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
        if (this.model[key]) {
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
      // 新建商品分类
      toCreateShopCar() {
        let marketData = {
          model: this.model,
          goodsDetial: this.goodsDetial
        }
        sessionStorage.setItem('editMarket', JSON.stringify(marketData));
        this.$router.push({
          name: 'goodPublish'
        })
      },
      // 接收商品属性信息
      recieveGoodsSpec(msg) {

        this.model.attrs = msg.attr
        this.model.skus = msg.optSpecs
        this.model.attrs = Object.assign([], this.model.attrs);
      },
      // 店铺内商品类目选择
      showCarLevel() {
        this.shopCatShow = !this.shopCatShow;
        if (!this.model.shopCar) {
          this.formTest.shopCar = true;
        } else {
          this.formTest.shopCar = false;
        }
      },
      checkCatFirstLevel(item) {
        this.formTest.shopCar = false;
        this.ShopFirstLevel = false;
        this.catCategoryItemChildren = item.children;
        this.bufferCatCategory = [];
        this.bufferCatCategory.push(item);
        if (this.catCategoryItemChildren.length == 0) {
          this.shopCatShow = false
          this.ShopFirstLevel = true;
          this.model.shopCar = item.name
          return;
        } else {
          this.ShopSecondLevel = true;
        }
        this.shopCatFirstLevel = item.name;
      },
      checkCatSecondLevel(child) {
        this.formTest.shopCar = false;
        this.ShopSecondLevel = false;
        this.shopCatShow = false;
        this.shopCatFirstLevel = '请选择';
        this.ShopFirstLevel = true;

        this.bufferCatCategory.push(child)
        let categoryArr = [];
        this.bufferCatCategory.map(item => {
          categoryArr.push(item.name)
        })
        this.model.shopCar = categoryArr.join(' — ')
      },
      /*
       *选择一级类目
       * param {  }
       */
      nextStep() {
        // 1.先对form进行验证
        let that = this;
        let isSpec = true;
        if (!this.goodsDetial.name) {
          this.$utils.layerMsg.error('商品名称不可以为空');
          this.formTest.name = true;
          return;
        }
        // console.log(this.model)
        if ((that.goodsDetial.price < that.goodsDetial.purchasePrice) || !that.goodsDetial.price) {
          this.$utils.layerMsg.error('商品价格必须大于等于供货价');
          this.formTest.price = true;
          return '';

        } else {
          that.goodsDetial.skus.map(item => {
            if (parseFloat(item.price) < item.purchasePrice) {
              that.$utils.layerMsg.error('商品价格必须大于等于供货价')
              isSpec = false;
            }
          })
          if (!isSpec) {
            return ''
          }
        }


        if (!this.model.shopCar) {
          this.formTest.shopCar = true;
          return;
        } else {
          this.model.shopCatId = this.bufferCatCategory[this.bufferCatCategory.length - 1].id
        }

        if (!this.model.shopCar) {
          that.$utils.layerMsg.error('请选择店铺分类！')
          this.formTest.shipCar = true;
        }
      },

      /**
       * 上架、保存仓库
       * @param {Number} type
       */
      async putawayStore(type) {
        let that = this;
        let isSpec = true;
        if (!this.goodsDetial.name) {
          this.$utils.layerMsg.error('商品名称不可以为空');
          this.formTest.name = true;
          return;
        }
        // console.log(this.model)
        if ((that.goodsDetial.price < that.goodsDetial.purchasePrice) || !that.goodsDetial.price) {
          this.$utils.layerMsg.error('商品价格必须大于等于供货价');
          this.formTest.price = true;
          return '';

        } else {
          that.goodsDetial.skus.map(item => {
            console.log(item.price, item.purchasePrice)
            if (parseFloat(item.price) < item.purchasePrice) {
              that.$utils.layerMsg.error('商品价格必须大于等于供货价')
              isSpec = false;
            }
          })
          if (!isSpec) {
            return ''
          }
        }


        if (!this.model.shopCar) {
          this.formTest.shopCar = true;
          that.$utils.layerMsg.error('请选择店铺分类！')
          return;
        } else {
          this.model.shopCatId = this.bufferCatCategory[this.bufferCatCategory.length - 1].id
        }
        let skus = [];
        this.goodsDetial.skus.map(item => {
          skus.push({
            price: item.price,
            originalPrice: item.originalPrice,
            skuUid: item.skuUid,
            status: item.status ? 1 : 0
          })
        })
        let params = {
          "id": this.$route.query.goodsId,
          "name": this.goodsDetial.name,
          "price": this.goodsDetial.price,
          "originalPrice": this.goodsDetial.originalPrice,
          "remark": this.goodsDetial.remark,
          "shopCatId": this.model.shopCatId,
          "description": this.model.description,
          "displayWithIntegralFlag": this.model.switchType,
          skus: skus
        }
        //防止重复提交
        this.number++;
        if (this.number > 1) {
          return;
        }
        let res;
        //上架
        if (type == 1) {
          res = await fetchJson.post(apiMarket.supplierGoodsSave, 'data', params)
        } else { //保存至仓库
          res = await fetchJson.post(apiMarket.supplierGoodsSaveOffline, 'data', params)
        }

        if (res.statusCode == 200) {
          window.sessionStorage.removeItem('editMarket')
          if (type == 1) {
            this.$utils.layerMsg.success('商品发布成功！')
          } else {
            this.$utils.layerMsg.success('商品已经保存至仓库！')
          }
          //页面重置
          this.bufferCatCategory = [], // 店铺
            this.bufferCategory = [], // 暂时存储选择的类目数据数据
            this.model = {
              shopCar: '',
              shopCarId: '', //店铺类目id
              step: 1, // 步骤1,2； 1为基本编辑，2为商品详情，发布
              EditorTxt2: '111',
              goodsType: 1, // 商品类型;1==>实物商品,2=>虚拟商品
              category: '', // 商品分类编号
              categoryId: '',
              remark: '', // 备注
              stock: '', // 库存数量
              goodsSn: '', // 商品编码
              weight: '', // 商品重量
              deliveryFee: 0.00, // 配送费用
              shopCatId: '', // 店铺商品分类编号
              description: '', // 商品描述
              attrs: [], // 属性列表
              skus: [],
            };
          let isCache = this.$route.query.goodsId !== 0 ? true : false;
          this.$router.push({
            name: 'goodManage',
            query: {
              isCache
            }
          }); // query调用缓存；

        }
        this.number = 0
      }
    }

  }

</script>
<style lang='less' scoped>
  @import url('../../assets/less/variable.less');

  .m_main .section_b {
    padding: 40px 30px;
    color: @color-6;
    margin-bottom: 350px;
  }

  .edit_title {
    .edit_title_btn {
      float: left;
      width: 465px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background: @color-alert-header;

      &.active {
        position: relative;
        color: @color-white;
        font-weight: @font-b;
        background: @color-orange;

        &:after {
          content: '';
          display: block;
          position: absolute;
          bottom: 0;
          left: 46%;
          width: 0;
          height: 0;
          border: 10px solid transparent;
          border-bottom: 10px solid @color-white;
        }
      }
    }
  }

  .panel_title {
    position: relative;
    margin-top: 30px;
    font-size: @font-16;
    color: @color-3;
    font-weight: 600;

    &:before {
      content: '';
      display: block;
      float: left;
      width: 4px;
      height: 20px;
      margin-right: 10px;
      background: @color-orange
    }
  }

  .item {
    padding-top: 20px;
    position: relative;
    label {
      line-height: 40px
    }
    input[type="text"] {
      height: 40px;
      line-height: 40px;
      padding: 0 6px;
    }

    .item_error_tip {
      font-size: @font-12;
      position: absolute;
      top: 62px;
      color: @color-error;
      height: 20px;
      line-height: 16px;
      width: 200px;
      left: 100px;
    }
    .item_name {
      display: inline-block;
      margin-right: 6px;
      width: 90px;
      text-align: right;
      height: 40px;
      line-height: 40px;
    }
    .big_input {
      box-sizing: border-box;
      width: 830px !important;
      height: 40px;
      line-height: 40px;
    }
  }

  .price {
    .border.price_input {
      width: 320px;
      height: 40px;
      line-height: 40px;
      border: 1px solid @color-c;
      i {
        display: inline-block;
        width: 38px;
        text-align: center;
        border-right: 1px solid @color-c;
      }
      input {
        width: 260px;
        border: none;
        height: 36px !important;
        line-height: 36px !important;
      }
    }

    .price_other {
      margin: 20px 0 0 95px;
      .border {
        width: 240px;
        margin-right: 20px;
        border: 1px solid @color-c;
      }

      label {
        width: 40px;
        padding: 0;
        text-align: center;
        border-right: 1px solid @color-c;
        &.second {
          width: 60px
        }
      }
      input {
        border: none;
        background: transparent;
        &.second {
          width: 130px !important;
        }
      }
    }
  }

  .radio_info {
    color: @color-9;
    font-size: @font-12;
  }

  .btn_orange {
    width: 160px;
    height: 40px;
    background: @color-orange;
    color: @color-white;
    margin-top: 40px;
    cursor: pointer;
  }

  .add_attr {
    padding-left: 100px;
  } // 备注
  .remark input {
    width: 566px;
  }

  .delivery {
    line-height: 40px;
    .select_box {
      width: 160px;
    }
    .border {
      width: 160px;
      input {
        width: 105px;
      }
    }

    & .last {
      margin-left: 96px;
      margin-top: 20px;
    }
  }

  .astrict {
    line-height: 40px;
    .border {
      border: 1px solid @color-c;
      width: 160px;
    }
    input {
      border: none;
      width: 120px;
    }
  }

  .step2 {
    .btn_white_orange {
      height: 40px;
      width: 160px;
      margin-top: 40px;
      border: 1px solid @color-orange
    }
  }

  .layui-input {
    height: 40px;
  } // select_class
  .goods_class {
    position: relative;
    input {
      width: 354px;
    }

    .dropdown {
      position: absolute;
      left: 100px;
      z-index: 1;
      border: 1px solid @color-border;
      width: 630px;
      height: 300px;
      background: @color-white;
      padding: 15px;

      h3 {
        text-align: center;
        height: 60px;
        line-height: 60px;
        font-size: 20px;
        padding-bottom: 10px;
      }

      .icon-close {
        margin: 12px;
        cursor: pointer;
      }

      .dropdown_content {
        padding: 20px;
        line-height: 40px;
        li {
          float: left;
          margin-right: 30px;
          cursor: pointer;
          &:hover {
            color: @color-orange
          }
        }
      }
    }

    .dropdown_title {
      ul {
        border-bottom: 1px solid @color-border;
        li {
          padding: 0 20px;
          margin-right: 50px;
          text-align: center;
          color: @color-orange;
          cursor: pointer;
          &.active {
            border-bottom: 1px solid @color-orange;
          }
        }
      }
    }
  }

  .step2 {
    .editor {
      width: 930px;
      padding-top: 30px;
    }
  }

  .icon_radio {
    margin: 12px 10px 0 0;
  }

  .error_border {
    border: 1px solid @color-error;
  }

  .upload_img_box {
    padding-left: 98px;
    .f_left {
      position: relative;

      .deletePic {
        position: absolute;
        top: -10px;
        right: 10px;
        cursor: pointer;
      }
    }
  }

  .upload_btn {
    float: left;
    width: 100px;
    height: 100px;
    border: 1px dashed @color-border;
    line-height: 100px;
    text-align: center;
    font-size: 30px;
    cursor: pointer;
  }

  .upload {
    img {
      width: 100px;
      height: 100px;
      margin-right: 20px;
      border: 1px solid @color-border;
    }
    .item_error_tip {
      top: 164px !important;
    }
  }

  .delivery_weight {
    padding-left: 118px;
  }

  .margin_top30 {
    margin-top: 30px;
    input {
      margin-right: 26px;
    }
  }

  .input_disable {
    background: #F4F5F7;
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
      padding-top: 10px;
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
  }
  .switch_label{
    margin: 10px 30px 0 93px;
  }

</style>
