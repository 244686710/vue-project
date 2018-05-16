/*
 * @Author: Yuyd
 * @Date: 2018-01-31 10:33:18
 * @Last Modified by: Yuyd
 * @Last Modified time: 2018-01-31 10:33:44
 * 考虑到兼容性已废弃
 */


<template>
  <div class="m_main" @click="LevelShow = false, shopCatShow= false">
    <div class="title_crumbs">
      商品 > 发布商品
    </div>
    <div class="section_b">
      <h2 class="edit_title clearfix">
        <a class="edit_title_btn font_16" href="javascript:;" :class="{active: model.step == 1}">1.编辑商品信息</a>
        <a class="edit_title_btn font_16" href="javascript:;" :class="{active: model.step == 2}">2.编辑商品详情</a>
      </h2>
      <div class="basic" v-show="model.step == 1">
        <h4 class="panel_title">商品基本信息</h4>
        <ul>
          <li class="item clearfix">
            <label for="" class="item_name f_left">* 商品名称：</label>
            <div class="f_left">
              <input type="text" class="name big_input" v-model="model.name" maxlength="30" placeholder="商品名称描述不超过30字" @keyup="isEmpty(model.name, 'name')">
            </div>
            <p class="item_error_tip" v-show="formTest.name">商品名称不可以为空</p>
          </li>
          <li class="item clearfix price">
            <div class="f_left">
              <label for="" class="item_name f_left">* 商品价格：</label>
              <div class="f_left border">
                <i>￥</i>
                <input type="text" placeholder="0.00" v-model="model.price" @keyup="model.price = model.price.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"
                  @input="isEmpty(model.price, 'price')">
              </div>
            </div>
            <div>
              <label for="" class="f_left last"> 原价：</label>
              <div class="f_left border">
                <i>￥</i>
                <input type="text" placeholder="0.00" v-model="model.originalPrice">
              </div>
            </div>
            <p class="item_error_tip" v-show="formTest.price">价格不可以为空</p>
          </li>
          <li class="item good_type clearfix">
            <label for="" class="item_name f_left">* 商品类型：</label>
            <my-radio class="f-left" v-model="model.goodsType" :options="radioOptions"></my-radio>
          </li>
          <li class="item goods_class">
            <label for="" class="item_name">* 商品类目：</label>
            <input type="text" readonly placeholder="请选择" v-model="model.category" @click.stop="showLevel()">
            <div class="dropdown" v-show="LevelShow" @mouseover="LevelShow = true" @click.stop="">
              <div class="dropdown_title">
                <h3>选 择 商 品 品 类
                  <i class="close icon-close f_right" @click="LevelShow = false"></i>
                </h3>
                <ul>
                  <li class="inline_block" :class="{active: FirstLevel}" @click="FirstLevel = true, firstLevel = '请选择', SecondLevel = false, ThirdLevel = false">
                    <span>{{firstLevel }}</span>
                  </li>
                  <li class="inline_block" :class="{active: SecondLevel}" @click="SecondLevel = true, secondLevel= '', ThirdLevel = false">
                    <span v-show="SecondLevel">请选择</span>{{secondLevel }}
                  </li>
                  <li class="inline_block" :class="{active: ThirdLevel}">
                    <span v-show="ThirdLevel">请选择</span>{{thirdLevel}}
                  </li>
                </ul>

              </div>
              <div class="dropdown_content">
                <ul v-show="FirstLevel">
                  <li @click="checkFirstLevel(item)" v-for="(item, index) in mallCategoryLists" :key="`categrory${index}`">{{item.name}}</li>
                </ul>
                <ul v-show="SecondLevel">
                  <li v-for="(child, index) in categoryItemChildren" :key="`categoryItem${index}`" @click="checkSecondLevel(child)">{{child.name}}</li>
                </ul>
                <ul v-show="ThirdLevel">
                  <li v-for="(child, index) in categorySecondChildren" :key="`categoryItem${index}`" @click="checkThirdLevel(child)">{{child.name}}</li>
                </ul>
              </div>
            </div>
            <p class="item_error_tip" v-show="formTest.category">商品类目不可以为空</p>
          </li>
          <li class="item upload clearfix">
            <label for="" class="item_name">*商品图片：</label>
            建议图片尺寸：800*800像素，大小不超过500KB，通过拖动图片调整图片顺序
            <div class="upload_img_box">
              <draggable v-model="model.picUrls">
                <transition-group>
                  <div class="f_left" v-for="(pic, index) in model.picUrls" :key="`pic${index}`" @mouseover="showDelete(pic)" @mouseout="hideDelete(pic)">
                    <img :src="pic.picUrl">
                    <i class="deletePic icon_delete_item" v-show="pic.showDelete" @click="deletePic(index)"></i>
                  </div>
                </transition-group>
              </draggable>
              <!-- <div class="f_left" v-for="(pic, index) in model.picUrls" :key="`pic${index}`" @mouseover="showDelete(pic)" @mouseout="hideDelete(pic)">
                <img :src="pic.picUrl" >
                <i class="deletePic icon_delete_item" v-show="pic.showDelete" @click="deletePic(index)"></i>
              </div> -->
              <!-- 上传图片插件 -->
              <img-store v-show="isUpload" :size="uploadNum" :bar="true" @checkedImgs="uploadImgs"></img-store>
            </div>
            <p class="item_error_tip " v-show="formTest.picUrls">图片不可以为空</p>
          </li>
          <li class="item remark">
            <label for="" class="item_name">备注：</label>
            <input type="text" v-model="model.remark">
          </li>
        </ul>
        <h4 class="panel_title">商品库存/规格</h4>
        <ul>

          <li class="clearfix padding_top10">
            <goods-spec @goodsSpec="recieveGoodsSpec" :optAttrs="model.attrs" :optSkus="model.skus"></goods-spec>
          </li>
          <li class="item" v-show="model.attrs.length == 0">
            <label for="" class="item_name">* 库存： </label>
            <input type="text" v-model="model.stock" @keyup="model.stock = model.stock.replace(/[^0-9]/g,'')">
            <p class="item_error_tip" v-show="formTest.stoke">库存必须大于0</p>
          </li>
          <li class="item">
            <label for="" class="item_name">商品编码：</label>
            <input type="text" v-model="model.goodsSn" maxlength="15">
          </li>
          <li class="item">
            <label for="" class="item_name">* 物流重量：</label>
            <input type="text" v-model="model.weight" maxlength="5" @change="writeWeight('weight')" @keyup="model.weight = model.weight  ? model.weight.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'') : '', formTest.weight = false">（kg）
            <p class="item_error_tip" v-show="formTest.weight">物流重量要大于或等于0</p>
          </li>
        </ul>

        <h4 class="panel_title">商品设置</h4>
        <ul>
          <li class="item clearfix delivery">
            <label class="f_left item_name" for="">运费设置： </label>
            <div class="clearfix price overflwo">
              <a href="javascript:;" class="f_left icon_radio icon-radio-blue-default" :class="{'icon-radio-blue-checked': model.deliveryFeeType == 1}"
                @click="deliveryType(1)"></a>
              <div class="f_left">统一邮费&nbsp;&nbsp;</div>
              <div class="border f_left">
                <i class="">￥</i>
                <input type="text" class="bg_white" v-model="model.deliveryFee" placeholder="0.00" @keyup="model.deliveryFee = model.deliveryFee.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"
                  :disabled="model.goodsType == 2">
              </div>
            </div>
            <div class="price last" v-if="deliverySwitchType == 1" v-show="model.goodsType !== 2">
              <a href="javascript:;" class="f_left icon_radio icon-radio-blue-default" :class="{'icon-radio-blue-checked': model.deliveryFeeType == 2}"
                @click="deliveryType(2)"></a>
              <div class="f_left">运费模版&nbsp;&nbsp;</div>
              <div class="f_left select_box">
                <my-select v-model="model.deliveryFeeTplId" :options="selectDeleveryMsg" @input="formTest.deliveryFeeType = false"></my-select>
              </div>
              &nbsp;&nbsp;
              <a href="javascript:;" class="handle" @click="readFeightUseType()">&nbsp;&nbsp; 刷新</a>&nbsp;&nbsp; | &nbsp;&nbsp;
              <a href="javascript:;" @click="toDelivery" class="handle">新建运费模板</a>
              <p v-show="formTest.deliveryFeeType&& model.deliveryFeeType ==2" class="item_error_tip" style="top:70px">请选择运费末班</p>
            </div>
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
            <label for="" class="item_name f_left">每人限购：</label>
            <div class="f_left border">
              <input type="text" v-model="model.buyLimit" placeholder="0" @keyup="model.buyLimit = model.buyLimit.replace(/[^0-9]/g,'')">件
            </div>
            <i class="info">（0代表不限购）</i>
          </li>
        </ul>
        <div class="add_attr">
          <input class="btn_orange" type="button" @click="nextStep()" value="下一步">
        </div>
      </div>

      <div class="step2" v-show="model.step == 2">
        <div class="editor clearfix">
          <my-editor ref="editor" :value="model.description" @getValue="editorValue"></my-editor>
        </div>
        <div class="margin_top30">
          <input type="button" class="btn_orange" value="上一步" @click="model.step = 1">
          <input type="button" class="btn_orange" @click="putawayStore(1)" value="上架">
          <input type="button" class="btn_white_orange" value="保存至仓库" @click="putawayStore(2)">
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import api from '../../api/api'
  import fetchJson from '../../api/http'
  import MyRadio from '../../components/Radio.vue'
  import MySelect from '../../components/Select.vue'
  import ImgStore from '../../components/imgStore.vue'
  import GoodsSpec from '../../components/addGoodsprops'
  import MyEditor from '../../components/Editor.vue'
  import draggable from 'vuedraggable' // 引入拖拽插件
  export default {
    name: 'goodEdit',
    components: {
      MyRadio,
      MySelect,
      ImgStore,
      GoodsSpec,
      MyEditor,
      draggable
    },
    data () {
      return {
        isUpload: true, // 是否可以上传
        LevelShow: false,
        FirstLevel: true, // 一级类目显示、隐藏
        SecondLevel: false, // 二级类目显示、隐藏
        ThirdLevel: false,
        bufferCatCategory: [], // 店铺
        bufferCategory: [], // 暂时存储选择的类目数据数据
        catCategoryLists: [], // 类目列表
        catCategoryItemChildren: [],
        mallCategoryLists: [], // 商城类目列表
        categoryItemChildren: [], // 子类目列表
        categorySecondChildren: [],
        deliverySwitchType: 0, // 运费模板是否开启 0 关闭，1 开启

        // 店铺商品分类
        shopCatShow: false,
        shopCatFirstLevel: '请选择',
        shopCatSecondLevel: '',
        ShopFirstLevel: true,
        ShopSecondLevel: false,
        size: 5,
        uploadNum: 0,
        model: {
          shopCar: '',
          RadioValue: 1,
          SelectValue: 1,
          step: 1, // 步骤1,2； 1为基本编辑，2为商品详情，发布
          EditorTxt2: '111',
          name: '', // 商品名称
          price: '', // 商品价格
          originalPrice: '', // 原价
          goodsType: 1, // 商品类型;1==>实物商品,2=>虚拟商品
          category: '', // 商品分类编号
          categoryId: '',
          remark: '', // 备注
          stock: '', // 库存数量
          goodsSn: '', // 商品编码
          weight: 0, // 商品重量
          deliveryFeeType: 1, // 运费计算类型;1=>统一邮费;2=>运费模板
          deliveryFee: 0.00, // 配送费用
          deliveryFeeTplId: '', // 关联运费模板编号
          shopCatId: '', // 店铺商品分类编号
          buyLimit: '', // 限购数量，0代表不限购，默认值为0
          description: '', // 商品描述
          picUrls: [], // 图片列表
          attrs: [], // 属性列表
          skus: [] // skus列表
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
          deliveryFeeType: false
        },

        firstLevel: '请选择',
        secondLevel: '',
        thirdLevel: '',
        radioOptions: [{
          Text: '实物商品',
          info: '（物流发货）',
          Value: 1
        },
        {
          Text: '虚拟商品',
          info: '（无需物流）',
          Value: 2
        }],
        selectDeleveryMsg: {
          size: {
            w: '162px',
            h: '42px'
          },
          selectOptions: []
        },

        number: 0 // 用来防止重复提交
      }
    },
    mounted () {
      // 查看开启模板状态
      this.readFeightUseType()
      this.curEditModel = JSON.parse(JSON.stringify(this.model))
      sessionStorage.setItem('isGoodsEditToDelivery', false)
      // this.$refs.editor
    },
    activated () {
      this.getGoodsDetial()
      // 获取商品类目
      this.getCategoryLists()
      this.getMallCateGoryTree()
    },
    watch: {
      'model.picUrls' (now) {
        this.uploadNum = this.size - now.length
        if (this.uploadNum < 0) {
          this.uploadNum = 0
        }
        if (this.uploadNum == 0) {
          this.isUpload = false
        } else {
          this.isUpload = true
        }
      },
      // 监听商品类型
      'model.goodsType' (now) {
        if (now === 2) {
          this.model.deliveryFee = 0
        }
      },
      async $route (now, old) {
        if (old.name == 'deliveryEdit') {
          if (sessionStorage.getItem('isGoodsEditToDelivery')) {
            this.curEditModel = JSON.parse(sessionStorage.getItem('curEditModel'))
          } else {
            this.curEditModel = {}
          }
        }
      }
    },
    methods: {
      uploadImgs (imgs) {
        let that = this
        imgs.map(item => {
          that.model.picUrls.push({
            picUrl: item.filePath
          })
        })
        this.formTest.picUrls = false
      },

      /**
       *文本编辑器
       *@param {String}content
       */
      editorValue (content) {
        this.model.description = content
      },
      // 显示删除按钮
      showDelete (item) {
        this.$set(item, 'showDelete', true)
      },
      // 隐藏删除图标
      hideDelete (item) {
        this.$set(item, 'showDelete', false)
      },
      // 删除图片
      deletePic (index) {
        this.model.picUrls.splice(index, 1)
      },
      // 获取商品详情
      async getGoodsDetial () {
        let goodsId = this.$route.query.goodsId
        if (goodsId != 0) {
          let loading = window.layer.load(2)
          const res = await fetchJson.post(api.getGoodsDetial, 'params', {
            id: goodsId
          })
          window.layer.close(loading)
          if (res.statusCode == 200) {
            this.model = Object.assign({}, this.model, res.responseContent)
            this.model.name = res.responseContent.name
            let categoryArr = []
            let shopCatArr = []
            res.responseContent.categoryTree && res.responseContent.categoryTree.map(item => {
              categoryArr.push(item.name)
            })
            res.responseContent.shopCategoryTree && res.responseContent.shopCategoryTree.map(item => {
              shopCatArr.push(item.name)
            })
            this.bufferCatCategory = res.responseContent.shopCategoryTree // 店铺
            this.bufferCategory = res.responseContent.categoryTree // 暂时存储选择的类目数据数据
            this.model.category = categoryArr.join(' — ')
            this.model.shopCar = shopCatArr.join(' — ')
            // {...res.responseContent}
            // console.log(this.model.attrs)
            // ducument.write(this.model)
            this.model.attrs.map(item => {
              item.attr = {
                name: item.attrName
              }
              item.spec = {}
              item.details.map(val => {
                val.name = val.attrValName
              })
            })
            // debugger;

            this.model.skus.map(item => {
              item.details.map(val => {
                val.name = val.attrValName
              })
              item.spec = {}
              item.spec.price = item.price
              item.spec.stock = item.stock
              item.spec.originalPrice = item.originalPrice
              item.spec.saleQuantity = item.saleQuantity
              item.spec.code = item.goodsSn
            })
          }
        } else {
          this.model = {
            shopCar: '',
            RadioValue: 1,
            SelectValue: 1,
            step: 1, // 步骤1,2； 1为基本编辑，2为商品详情，发布
            name: '', // 商品名称
            price: '', // 商品价格
            originalPrice: '', // 原价
            goodsType: 1, // 商品类型;1==>实物商品,2=>虚拟商品
            category: '', // 商品分类编号
            categoryId: '',
            remark: '', // 备注
            stock: '', // 库存数量
            goodsSn: '', // 商品编码
            weight: '', // 商品重量
            deliveryFeeType: 1, // 运费计算类型;1=>统一邮费;2=>运费模板
            deliveryFee: 0.00, // 配送费用
            deliveryFeeTplId: '', // 关联运费模板编号
            shopCatId: '', // 店铺商品分类编号
            buyLimit: '', // 限购数量，0代表不限购，默认值为0
            description: '', // 商品描述
            attrs: [], // 属性列表
            skus: [],
            picUrls: []
          }
        };
        if (goodsId == 0 && (sessionStorage.getItem('isGoodsEditToDelivery') || sessionStorage.getItem(
            'isGoodsToGoodsPublish'))) {
          this.model = this.curEditModel
        }
      },
      toDelivery () {
        sessionStorage.setItem('isGoodsEditToDelivery', true)
        sessionStorage.setItem('curEditModel', JSON.stringify(this.model))
        this.$router.push({
          name: 'deliveryEdit',
          query: {
            id: 0
          }
        })
      },

      /**
       * 判断是否为空
       * @param {any} val
       * @param {String} errorKey
       */
      isEmpty (val, errorKey) {
        this.formTest[errorKey] = this.$utils.isEmpty(val)
      },

      /**
       * 验证价格
       * @param {string}, parice
       */
      priceTest (price) {
        price = price.replace(/[^0-9]/g, '')
        this.model = Object.assign({}, this.model)
      },

      // 获取商城商品分类
      async getMallCateGoryTree () {
        const res = await fetchJson.post(api.getMallCategoryTree, 'params', {
          id: 0
        })
        if (res.statusCode == 200) {
          this.mallCategoryLists = res.responseContent
        }
      },
      // 获取商品类目
      async getCategoryLists () {
        const res = await fetchJson.post(api.getCategoryTree, 'params', {
          id: 0
        })
        if (res.statusCode == 200) {
          this.catCategoryLists = res.responseContent
        }
      },

      /**
       * 保留两位小数
       */
      writeWeight (key) {
        var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/
        if (this.model[key]) {
          var val = this.model[key]
          if (reg.test(val)) {
            if (val.toString().indexOf('.') == -1 && val.toString().length <= 6) {
              this.model[key] = parseFloat(val).toFixed(2)
            }
          } else {
            return
          }
        }
        this.model = Object.assign({}, this.model)
      },
      // 获取运费模板列表
      async getFeightLists () {
        let loading = window.layer.load(2)
        let that = this
        that.selectDeleveryMsg.selectOptions = []
        const res = await fetchJson.post(api.getFreightList, 'params', {})
        window.layer.close(loading)
        if (res.statusCode == 200) {
          res.responseContent.list.map(item => {
            that.selectDeleveryMsg.selectOptions.push({
              Value: item.id,
              Text: item.tplName
            })
          })
        }
        that.selectDeleveryMsg = Object.assign({}, that.selectDeleveryMsg)
      },

      // 查询模板开启状态
      async readFeightUseType () {
        const res = await fetchJson.post(api.getFreightSwitch, 'params', {})
        if (res.statusCode == 200) {
          this.deliverySwitchType = res.responseContent
          await this.getFeightLists()
        }
      },

      // 改变运费模式
      deliveryType (type) {
        this.model.deliveryFeeType = type
      },

      // 新建商品分类
      toCreateShopCar () {
        sessionStorage.setItem('isGoodsToGoodsPublish', true)
        sessionStorage.setItem('curEditModel', JSON.stringify(this.model))
        this.$router.push({
          name: 'goodPublish'
        })
      },

      showLevel () {
        this.LevelShow = !this.LevelShow
        if (!this.model.category) {
          this.formTest.category = true
        } else {
          this.formTest.category = false
        }
      },

      // 接收商品属性信息
      recieveGoodsSpec (msg) {
        this.model.attrs = msg.attr
        this.model.skus = msg.optSpecs
        this.model.attrs = Object.assign([], this.model.attrs)
      },
      /*
       *选择一级类目
       * param { Object } item
       */
      checkFirstLevel (item) {
        this.FirstLevel = false
        this.formTest.category = false
        this.categoryItemChildren = item.children
        this.bufferCategory = []
        this.bufferCategory.push(item)
        if (this.categoryItemChildren.length == 0) {
          this.LevelShow = false
          this.SecondLevel = false
          this.FirstLevel = true
          this.model.category = item.name
          return
        } else {
          this.SecondLevel = true
        }
        this.firstLevel = item.name
      },

      checkSecondLevel (child) {
        this.formTest.category = false
        this.SecondLevel = false
        this.categorySecondChildren = child.children
        if (child.children && child.children.length == 0) {
          this.firstLevel = '请选择'
          this.FirstLevel = true

          this.LevelShow = false
          this.bufferCategory.push(child)
          let categoryArr = []
          this.bufferCategory.map(item => {
            categoryArr.push(item.name)
          })
          this.model.category = categoryArr.join(' — ')
        } else {
          this.bufferCategory.push(child)
          this.secondLevel = child.name
          this.ThirdLevel = true
        }
      },

      checkThirdLevel (lastChild) {
        this.formTest.category = false
        this.firstLevel = '请选择'
        this.FirstLevel = true
        this.SecondLevel = false
        this.secondLevel = ''
        this.ThirdLevel = false
        this.thirdLevel = ''

        this.LevelShow = false
        this.bufferCategory.push(lastChild)
        let categoryArr = []
        this.bufferCategory.map(item => {
          categoryArr.push(item.name)
        })
        this.model.category = categoryArr.join(' — ')
      },

      // 店铺内商品类目选择

      showCarLevel () {
        this.shopCatShow = !this.shopCatShow
        if (!this.model.shopCar) {
          this.formTest.shopCar = true
        } else {
          this.formTest.shopCar = false
        }
      },
      checkCatFirstLevel (item) {
        this.formTest.shopCar = false
        this.ShopFirstLevel = false
        this.catCategoryItemChildren = item.children
        this.bufferCatCategory = []
        this.bufferCatCategory.push(item)
        if (this.catCategoryItemChildren.length == 0) {
          this.shopCatShow = false
          this.ShopFirstLevel = true
          this.model.shopCar = item.name
          return
        } else {
          this.ShopSecondLevel = true
        }
        this.shopCatFirstLevel = item.name
      },
      checkCatSecondLevel (child) {
        this.formTest.shopCar = false
        this.ShopSecondLevel = false
        this.shopCatShow = false
        this.shopCatFirstLevel = '请选择'
        this.ShopFirstLevel = true

        this.bufferCatCategory.push(child)
        let categoryArr = []
        this.bufferCatCategory.map(item => {
          categoryArr.push(item.name)
        })
        this.model.shopCar = categoryArr.join(' — ')
      },

      /*
       *选择一级类目
       * param {  }
       */
      nextStep () {
        // 1.先对form进行验证
        let that = this
        if (!this.model.name) {
          this.$utils.layerMsg.error('商品名称不可以为空')
          this.formTest.name = true
          return
        }
        // console.log(this.model)
        if ((this.model.attrs.length == 0) && (!that.model.price || that.model.price <= 0)) {
          this.$utils.layerMsg.error('商品价格必须大于0')
          this.formTest.price = true
          return
        }
        if (!this.model.category) {
          this.formTest.category = true
          this.$utils.layerMsg.error('商品品类不可以为空')
          return
        } else {
          this.model.categoryId = this.bufferCategory[this.bufferCategory.length - 1].id
          // console.log(this.model.categoryId)
        }
        if (this.model.picUrls.length == 0) {
          this.$utils.layerMsg.error('商品图片不可以为空')
          this.formTest.picUrls = true
          return
        }
        if (this.model.attrs.length == 0) {
          let isSpec = true

          if (this.model.stock <= 0) {
            this.$utils.layerMsg.error('商品库存必须大于0')
            this.formTest.stock = true
            isSpec = false
            // return;
          }
          if (!isSpec) {
            return
          }
        } else {
          // 价格不能为0，且不为空
          that.model.stock = 0
          let isSpec = true
          that.model.skus.map(item => {
            if (!item.spec.price || item.spec.price <= 0) {
              that.$utils.layerMsg.error('价格必须大于0')
              isSpec = false
            }
            if (!item.spec.stock || item.spec.stock <= 0) {
              that.$utils.layerMsg.error('库存必须大于0')
              isSpec = false
            } else {
              that.model.stock += Number(item.spec.stock)
            }
          })
          if (!isSpec) {
            return
          }
        }

        if (this.model.weight === '' || this.model.weight < 0) {
          that.$utils.layerMsg.error('物流重量大于等于0')
          this.formTest.weight = true
          return
        }
        if (!this.model.shopCar) {
          this.formTest.shopCar = true
          return
        } else {
          this.model.shopCatId = this.bufferCatCategory[this.bufferCatCategory.length - 1].id
        }
        if (this.model.deliveryFeeType == 2 && !this.model.deliveryFeeTplId) {
          that.$utils.layerMsg.error('请选择运费模板！')
          this.formTest.deliveryFeeType = true
          return
        }
        if (!this.model.shopCar) {
          that.$utils.layerMsg.error('请选择店铺分类！')
          this.formTest.shipCar = true
        }

        this.model.step = 2
      },

      /**
       * 上架、保存仓库
       * @param {Number} type
       */
      async putawayStore (type) {
        let picUrls = []
        let attrsCopy = []
        let skusCopy = []
        let paramAttrs = []
        let paramSkus = []
        this.model.picUrls.map(item => {
          picUrls.push({
            picUrl: item.picUrl
          })
        })
        if (this.model.attrs.length > 0) {
          attrsCopy = JSON.parse(JSON.stringify(this.model.attrs))
          attrsCopy.map((item, index) => {
            paramAttrs.push({
              attrName: item.attr.name,
              details: []
            })
            item.details.map(val => {
              paramAttrs[index].details.push({
                attrValName: val.name
              })
            })
          })

          skusCopy = JSON.parse(JSON.stringify(this.model.skus))
          skusCopy.map((item, index) => {
            paramSkus.push({
              goodsSn: item.spec.code,
              stock: item.spec.stock,
              price: item.spec.price,
              originalPrice: item.spec.originalPrice,
              details: []
            })
            item.details.map((val, valIndex) => {
              paramSkus[index].details.push({
                attrName: paramAttrs[valIndex].attrName,
                attrValName: val.name
              })
            })
          })
        }
        let params = {
          id: this.$route.query.goodsId ? this.$route.query.goodsId : 0,
          name: this.model.name,
          price: this.model.price,
          originalPrice: this.model.originalPrice,
          goodsType: this.model.goodsType,
          categoryId: this.model.categoryId,
          remark: this.model.remark,
          stock: this.model.stock,
          goodsSn: this.model.goodsSn,
          weight: this.model.weight,
          deliveryFeeType: this.model.deliveryFeeType,
          deliveryFee: this.model.deliveryFee,
          deliveryFeeTplId: this.model.deliveryFeeTplId,
          shopCatId: this.model.shopCatId,
          buyLimit: this.model.buyLimit,
          description: this.model.description,
          picUrls: picUrls,
          attrs: paramAttrs,
          skus: paramSkus
        }
        // 防止重复提交
        this.number++
        if (this.number > 1) {
          return
        }
        let res
        // 上架
        if (type == 1) {
          res = await fetchJson.post(api.saveGoods, 'data', params)
        } else { // 保存至仓库
          res = await fetchJson.post(api.saveGoodsBuffer, 'data', params)
        }

        if (res.statusCode == 200) {
          if (type == 1) {
            this.$utils.layerMsg.success('商品发布成功！')
          } else {
            this.$utils.layerMsg.success('商品已经保存至仓库！')
          }
          // 页面重置
          this.bufferCatCategory = [] // 店铺
          this.bufferCategory = [] // 暂时存储选择的类目数据数据
          this.model = {
            shopCar: '',
            shopCarId: '', // 店铺类目id
            RadioValue: 1,
            SelectValue: 1,
            step: 1, // 步骤1,2； 1为基本编辑，2为商品详情，发布
            EditorTxt2: '111',
            name: '', // 商品名称
            price: '', // 商品价格
            originalPrice: '', // 原价
            goodsType: 1, // 商品类型;1==>实物商品,2=>虚拟商品
            category: '', // 商品分类编号
            categoryId: '',
            remark: '', // 备注
            stock: '', // 库存数量
            goodsSn: '', // 商品编码
            weight: '', // 商品重量
            deliveryFeeType: 1, // 运费计算类型;1=>统一邮费;2=>运费模板
            deliveryFee: 0.00, // 配送费用
            deliveryFeeTplId: '', // 关联运费模板编号
            shopCatId: '', // 店铺商品分类编号
            buyLimit: '', // 限购数量，0代表不限购，默认值为0
            description: '', // 商品描述
            attrs: [], // 属性列表
            skus: [],
            picUrls: []
          }
          let isCache = this.$route.query.goodsId !== 0 ? true : false
          sessionStorage.removeItem('curEditModel')
          sessionStorage.removeItem('isGoodsEditToDelivery')
          sessionStorage.removeItem('isGoodsToGoodsPublish')
          this.$router.push({
            name: 'goodManage',
            query: {
              isCache
            }
          }) // query调用缓存；
        }
        this.number = 0
      }

    }

  }
</script>
<style lang='less' scoped>
  @import url('../../assets/less/variable.less'); // less 颜色

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
    label.last {
      padding: 0 8px 0 35px;
      line-height: 40px;
    }
    .border {
      width: 370px;
      height: 40px;
      line-height: 40px;
      border: 1px solid @color-c;
      i {
        display: inline-block;
        width: 38px;
        text-align: center;
        border-right: 1px solid @color-c;
      }
    }
    input {
      width: 310px;
      border: none;
      height: 36px !important;
      line-height: 36px !important;
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
    width: 370px;
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
</style>
