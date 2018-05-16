<!--
    ** 商品规格 添加属性后生成 表格,
      主要两中功能: 1, 新添加属性. 2,修改属性.
      功能逻辑: 1,选择属性,后生成规格表.
      数据: 属性数组 and 规格表数组.
 -->
<template>
  <div>
    <div class="specification padding_top10">
      <div class="section">
        <div class="section-title section-title2 f_left">
          商品属性：
        </div>
        <div class="section-opt">
          <!-- 点击按钮生成一行 -->
          <div class="spec-row" v-for="(optItem, attrIndex) in optAttrs" :key="`optItem${attrIndex}`">
            <div class="row-attr" @mouseover="showClose(optItem)" @mouseleave="hideClose(optItem)">
              <input type="text" maxlength="8" v-model="optItem.attr.name" @change="attrIfSame()" placeholder="例:颜色" />
              <a class="remove-attr icon_delete_item" @click="removeAttr(attrIndex)" v-show="optItem.closeFlag"></a>
            </div>
            <ul class="row-details overflow">
              <li class="row-details-item" v-for="(specItem, specIndex) in optItem.details" v-show="optItem.details.length > 0" :key="`specItem${specIndex}`"
                @mouseover="showClose(specItem)" @mouseleave="hideClose(specItem)">
                <input maxlength="8" v-model="specItem.name" @change="specIfSame()" @keyup="genSpecsList(attrIndex, specIndex)" placeholder="例：黑色" />
                <a class="remove-spec icon_delete_item" @click="removeSpec(optItem,specIndex)" v-show="specItem.closeFlag"></a>
              </li>
              <a class="add-item handle" @click="addSpec(optItem)" v-show="optItem.details.length<5">+添加规格</a>
            </ul>
          </div>
          <button class="add-btn add-props" @click="addAttr()" v-if="optAttrs.length>=0&&optAttrs.length<4">添加商品属性</button>
        </div>
      </div>
    </div>
    <div class="gen-specification padding_top20" v-if="optAttrs.length>0">
      <div class="section clearfix">
        <div class="section-title">
          <i style="color: #FF0000;">*</i>商品库存：
        </div>
        <div class="section-opt border bg_white table_box f_left">
          <table border="0" cellspacing="0" cellpadding="0" class="text_left">
            <thead class="table-head border_bottom">
              <th class="table-head-th" v-for="(optItem, index) in optAttrs" v-if="optItem.attr.name!=''" :key="`optItem${index}`">
                {{optItem.attr.name}}
              </th>
              <th class="table-head-th">
                <i>*</i>价格</th>
              <th class="table-head-th">原价</th>
              <th class="table-head-th">
                <i>*</i>库存</th>
              <th class="table-head-th" v-if="checkedGoodType == 0">
                <i></i>销量</th>
              <th class="table-head-th">商家编码</th>
            </thead>
            <!-- <tr v-if="optSpecs.length==0"></tr> -->
            <tr class="table-row border_top f_info" v-for="(items, index) in optSpecs" :key="`items_${index}`">
              <td v-for="(specItem, index) in items.details" class="table-row-td" :key="`specItem${index}`">
                {{specItem.name}}
              </td>
              <td>
                <input type="text" v-model="items.spec && items.spec.price" maxlength="6" @change="wiritePrice(items.spec)" @keyup="items.spec.price = items.spec.price ? items.spec.price.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,''): ''"
                />
              </td>
              <td class="table-row-td">
                <input type="text" v-model="items.spec && items.spec.originalPrice" maxlength="6" @change="wiriteOriginalPrice(items.spec);"
                  @keyup="items.spec.originalPrice = items.spec.originalPrice ? items.spec.originalPrice.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,''): ''"
                />
              </td>
              <td class="table-row-td">
                <input type="text" v-model="items.spec && items.spec.stock" @keyup="items.spec.stock = items.spec&& items.spec.stock  ? items.spec.stock.replace(/\D/g,''): ''"
                  @change="writeCode(items.spec.stock)" maxlength="6" />
              </td>
              <td class="table-row-td" v-if="checkedGoodType == 0">
                {{items.spec && items.spec.saleQuantity || 0}}
              </td>
              <td class="table-row-td">
                <input type="text" v-model="items.spec && items.spec.code" @change="writeCode()" />
              </td>
            </tr>
          </table>

          <div class="radio_group border_top f_info" v-if="optSpecs.length>0">
            <label class="f_left" for="">批量设置：</label>
            <div>
              <my-radio v-model="RadioValue" :options="RadioOptions"></my-radio>
            </div>
            <div>
              <div class="batch_input padding_top10 ">
                <div class="f_left margin_right20">
                  <input v-if="RadioValue == 1" v-model="batchSet.batchPrice" maxlength="6" type="text" placeholder="请输入价格" key="batchPrice"
                    @change="writeBatchPrice(batchSet.batchPrice)" @keyup="batchSet.batchPrice = batchSet.batchPrice.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')">
                  <input v-else type="text"
                  v-model="batchSet.batchStock"
                  placeholder="请输入库存"
                  key="batchStock"
                  maxlength="6"
                  @keyup="batchSet.batchStock = batchSet.batchStock.replace(/\D/g,'')">
                </div>
                <span>
                  <a class="handle margin_right20" href="javascript:;" @click="saveBatch()">保存</a>|
                  <a class="handle margin_left20" href="javascript:;" @click="resetBatch()">取消</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="optAttrs.length>0">
      <div class="section-title padding_top20">
        <i style="color: #FF0000;">*</i>商品库存：
      </div>
      <div class="f_left padding_top20">
        <input class="total_store" type="text" disabled v-model="totalStock">（件）
        <span class="c_error" v-show="!isTotalStock">总库存必须大于0</span>
        <p class="">&nbsp;&nbsp;总库存为0时，商品自动下架，修改库存并上架发布商品后同步更新</p>
      </div>
    </div>
  </div>
</template>
<script>
  import MyRadio from './Radio';
  export default {
    name: 'AddGoodsPorps',
    components: {
      MyRadio
    },
    props: ['optAttrs', 'optSkus'],
    created() {
      this.init();
    },
    watch: {
      'optSkus' (now, old) {
        this.optSpecs = this.optSkus
        this.totalStock = 0;
        this.optSpecs.map(item => {
          if (item.stock) {
            this.totalStock += Number(item.stock)
          }
        })
      },

    },
    data() {
      return {
        batchSet: {
          batchPrice: '', //批量设置价格
          batchStock: '', //批量设置库存
        },
        // optSpecs: this.optSkus,
        RadioValue: 1, // 默认选择价格
        RadioOptions: [{
            Text: '价格',
            Value: 1
          },
          {
            Text: '库存',
            Value: 2
          }
        ],
        // Allstock: 0, // 总库存
        checkedGoodType: 0,
        closeFlag: false, // 删除按钮
        totalStock: 0,
        isTotalStock: true, // 总库存
        result: [],
        prop_attrs: [{
            "attr": {
              "name": "颜色"
            },
            "details": [{
              "name": "红色"
            }, {
              "name": "蓝色"
            }, {
              "name": "紫色"
            }]
          },
          {
            "attr": {
              "name": "尺码"
            },
            "details": [{
              "name": "XL"
            }, {
              "name": "M"
            }]
          },
          {
            "attr": {
              "name": "款式"
            },
            "details": [{
              "name": "运动"
            }, {
              "name": "休闲"
            }]
          },
        ],
        specs: {
          "spec": {
            "code": "111",
            "stock": 20,
            "price": 20.21
          },
          "details": [{
            "name": "红色"
          }, {
            "name": "XL"
          }, {
            "name": "运动"
          }],
          总库存: 1234
        },
        restrict: 'E', // 作为属性使用
        replace: false,
        transclude: true,
        scope: false,
        require: 'ngModel',
        addFalg: false,
        isWeightShow: true,
        attrValid1: true, // 商品属性是否相同
        attrValid2: true, // 规格是否相同
        optSpecs: []
      }

    },
    methods: {
      /**
       * 关闭按钮显示
       * @param {Object} item
       */
      showClose(item) {
        this.$set(item, 'closeFlag', true)
      },
      // 隐藏关闭按钮
      hideClose(item) {
        this.$set(item, 'closeFlag', false)
      },

      /**
       *@param listStartIndex, 其实位置0,
       *@param list : 元数组. [[a,b],[1,2]]
       *@return result : 笛卡尔积数组. []
       * [a,b,c],
       * [[a,1],[a,2],[b,1],[b,2]]
       */
      cartesian(listStartIndex, list, tempResult) {
        //如果其实位置大于数组长度,
        if (listStartIndex >= list.length) {
          result.push(tempResult);
          return;
        }
        var optListItem = list[listStartIndex]; // 当前操作的数组item.  3
        if (!tempResult)
          tempResult = [];
        for (var i = 0; i < optListItem.length; i++) {
          var preResult = tempResult.slice(0, tempResult.length);
          preResult.push(optListItem[i]);
          cartesian(listStartIndex++, list, preResult)
        }
      },

      //console.log("初始controller:",this.optSpecs);
      init() {
        //1. step ,判断父组件传的值.
        var isAdd = this.selectAttrs == undefined;
        this.isAddShow = true; // 是否隐藏 <添加商品属性>按钮.
      },

      addAttr() {
        this.addFalg = true;
        this.isWeightShow = false;
        var canAdd = this.canAddAttr();
        if (!canAdd) {
          this.$utils.layerMsg.error("请输入商品的属性值!");
          // layer.msg("请输入商品的属性!");
          return;
        }
        let isExist = this.attrIfSame()
        if (!isExist) return
        var optAttrItem = {
          attr: {
            name: ""
          },
          details: [],
          spec: {}
        };
        this.optAttrs.push(optAttrItem);
        if (this.optAttrs.length > 3) {
          this.isAddShow = false;
        }

        this.genSpecsList();
      },

      /**
       * 添加商品属性按钮.
       * 有很多..
       */
      attrIfSame() {
        let isAdd = true;
        if (this.optAttrs.length >= 1) {
          for (var i = 0; i < this.optAttrs.length - 1; i++) {
            var same = this.optAttrs[i].attr.name;
            /*商品属性是否相同*/

            for (var k = i + 1; k < this.optAttrs.length; k++) {
              if (same == this.optAttrs[k].attr.name) {
                this.attrValid1 = false;
                this.$utils.layerMsg.error('已经存在相同的名称相同！')
                isAdd = false
                return;
              }
            }
          }
        }
        // console.log(this.optAttrs)
        this.$emit('goodsSpec', {
          attr: this.optAttrs,
          optSpecs: this.optSpecs
        })
        this.attrValid1 = true;
        return isAdd
      },
      /**
       * 是否可以添加新的属性.
       */
      canAddAttr() {
        var canAdd = true;
        if (this.optAttrs.length == 0) {
          canAdd = true;
        } else {
          for (var i = 0; i < this.optAttrs.length; i++) {
            if (this.optAttrs[i].attr && this.optAttrs[i].attr.name.length > 0) {
              canAdd = true;
            } else {
              canAdd = false;
              break;
            }
          }
        }
        return canAdd;
      },
      /**
       * 移除商品属性.
       */
      removeAttr(index) {
        //console.log("删除属性",index);
        this.optAttrs.splice(index, 1);
        if (this.optAttrs.length <= 0) {
          this.isWeightShow = true;
        } else {
          this.isWeightShow = false;
        }
        //console.log(this.optAttrs);
        if (this.optAttrs.length <= 3) {
          this.isAddShow = true;
        }

        this.genSpecsList();
        this.attrIfSame();
        this.specIfSame();
      },

      /**
       * @desp 该指令为两中功能服务， 一个是为了新增服务，新增服务就没有选中的属性集合和规格列表。
       *  另外一个是修改服务， 修改服务就有选中的属性集合和规格列表。
       *  selectAttrs:[], genSpecs:[]
       *  [1]: 选中的属性集合由父组件传递过来......,如果是新增则为空,否则是有数据的数组。
       *  [2]: 生成的规格列表由父组件传递过来......如果是新增则为空,否则是有数据的数组。
       */
      /**
       * 添加某个属性的规格., 同时生成规格...
       */
      addSpec(item) {
        /*规定输入一条大属性之后才能输入规格*/
        // console.log(item,obj);
        if (!item.attr.name) {
          // this.setMessage("请先添加属性值");
          this.$utils.layerMsg.error('请先添加属性值')
          return;
        }
        let specNameTest = this.specIfSame()
        if (!specNameTest) {
          return
        }

        /*当前一个具体规格输入之后，才能添加下一个*/
        if (item.details.length > 0) {
          var arr = item.details
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].name == '') {
              this.$utils.layerMsg.error('请先添加属性值')
              return
            }
          }
        }
        // console.log("添加规格");
        var canAddSpec = this.canAddSpec(item.details);
        if (!canAddSpec) {
          this.$utils.layerMsg.error('请先添加属性值')
          return false
        }
        item.details.push({
          'name': ''
        })

        this.genSpecsList()
      },
      //规格名是否相同
      specIfSame() {
        var same = [];
        for (var i = 0; i < this.optAttrs.length; i++) {
          for (var k = 0; k < this.optAttrs[i].details.length; k++) {
            same.push(this.optAttrs[i].details[k].name);
          }
        }
        var same2 = same.sort();
        let space = true
        for (var i = 0; i < same.length; i++) {
          if (same2[i] == same2[i + 1]) {
            this.attrValid2 = false;
            this.$utils.layerMsg.error('规格名称重复')
            space = false
            return;
          }
          this.attrValid2 = true;
        }
        return space
        this.$emit('goodsSpec', {
          attr: this.optAttrs,
          optSpecs: this.optSpecs
        })
      },

      /** 删除某个属性的规格 **/
      removeSpec(item, index) {

        //console.log("删除规格:",item,index);
        item.details.splice(index, 1);
        //console.log("removeSpec",this.optAttrs);
        this.genSpecsList();
        this.attrIfSame();
        this.specIfSame();
      },

      /**
       * 是否可以添加规格.
       */
      /**
       * 是否可以添加新的属性.
       */
      canAddSpec(specDetails) {
        var canAdd = true;
        if (specDetails.length >= 5) {
          canAdd = false;
        }
        return canAdd;
      },

      /**
       * @param {Number} attrIndex 属性位置
       * @param {Number} specIndex 规格位置
       * @desp 根据用户输入的规格，生产规格table数据.
       */
      genSpecsList (attrIndex, specIndex) {
        console.log(attrIndex, specIndex)
        var list = this.optAttrs
        var preSpecs = JSON.parse(JSON.stringify(this.optSpecs));
        console.log("操作前:",JSON.stringify(preSpecs));
        var tempList = [];
        for (var i = 0; i < list.length; i++) {
          //allNums *= list[i].details ? list[i].details.length == : 1;
          var len = 1;
          if (list[i].details) {
            list[i].details.length > 0 ? tempList.push(JSON.parse(JSON.stringify(list[i].details))) : 1;
          }
        }
        var result = [];
        this.optSpecs = [];
        result = this.dicar(tempList, [], 0, [])
        // 将新生产的specs 数据和之前的specs的数据比较，最终将之前已经输入的库存等数据赋值给新的specs对应的item.
        for (var j = 0; j < this.optSpecs.length; j++) {
          var itemDetails = this.optSpecs[j].details.sort()
          for (var k = 0; k < preSpecs.length; k++) {
            var preItemDetails = preSpecs[k].details.sort()
            var itemVals = []
            var preVals = []
            itemDetails.map( itemDetialVal => {
              itemVals.push(itemDetialVal.name)
            })
            preItemDetails.map( preDetialVal => {
              preVals.push(preDetialVal.name)
            })
            JSON.stringify(itemVals.sort()) === JSON.stringify(preVals.sort()) ? this.optSpecs[j].spec = preSpecs[k].spec : ''
          }
        }
        this.$emit('goodsSpec', {
          attr: this.optAttrs,
          optSpecs: this.optSpecs
        })
      },

      /**
       * @desp 根据用户输入的规格，生产规格table数据.
       */
      genSpecsList2() {
        var list = this.optAttrs;
        var preSpec = JSON.parse(JSON.stringify(this.optSpecs));
        var tempList = [];
        for (var i = 0; i < list.length; i++) {
          //allNums *= list[i].details ? list[i].details.length == : 1;
          var len = 1;
          if (list[i].details) {
            list[i].details.length > 0 ? tempList.push(JSON.parse(JSON.stringify(list[i].details))) : 1;
          }
        }
        var result = [];
        this.optSpecs = [];
        result = this.dicar(tempList, [], 0, []);
        //比较生产的spec数据和之前的spec数据.
        var len = this.optSpecs ? this.optSpecs.length : 0;
      },
      /**
       * sourceList : 原始大的结合.
       * resultList : 笛卡尔积数组.
       * layer : 层数
       * currentList 每次笛卡尔积的结果.
       */
      // [[a,b,c],[1,2],[m,n]]  => [[a,1,m],[a,2,m],[a,1,n],[a,2,n],[b,1,m],[b,2,m],[b,1,n],[b,2,n]
      dicar (sourcelist, resultList, layer, currentList) {
        let that = this
        var newResultList = []

        if (layer == sourcelist.length) {
          that.optSpecs = resultList
          that.optSpecs = Object.assign([], that.optSpecs)
          return false
        } else {
          if (resultList.length === 0) {
            for (var k = 0; k < sourcelist[layer].length; k++) {
              newResultList.push({
                details: [sourcelist[layer][k]],
                spec: {}
              })
            }
          } else {
            for (var j = 0; j < resultList.length; j++) {
              for (var i = 0; i < sourcelist[layer].length; i++) {

                var newItem = resultList[j].details.concat(sourcelist[layer][i])
                // list.push(newItem);
                newResultList.push({
                  details: newItem,
                  spec: {}
                })
              }
            }
          }
          this.dicar(sourcelist, newResultList, layer + 1, [])
        }
      },
      getSize (list) {
        var nums = 1;
        for (var i = 0; i < list.size; i++) {
          nums *= list.detail ? list.detail.length : 0;
        }
        return nums;
      },
      wiritePrice(obj) {
        var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
        if (obj) {
          var price = obj.price;
          if (Number(price) !== 0) {
            price = Number(price) || '';
          }
          if (reg.test(price)) {
            price = price.toString()
            if ((price.indexOf('.') == -1 && price.length <= 6) || price > 0.01) {
              obj.price = parseFloat(price).toFixed(2);
            } else {
              obj.price = 0.01
            }
          } else {
            obj.price = price
            this.$emit('goodsSpec', {
              attr: this.optAttrs,
              optSpecs: this.optSpecs
            }) // 向父组件派发状态
            return;
          }
        }
        this.$emit('goodsSpec', {
          attr: this.optAttrs,
          optSpecs: this.optSpecs
        }) // 向父组件派发状态
      },

      wiriteOriginalPrice(obj) {
        var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
        var price = obj.originalPrice;
        if (Number(price) !== 0) {
          price = Number(price) || '';
        }

        if (reg.test(price)) {
          price = price.toString()
          if ((price.indexOf('.') == -1 && price.length <= 6) || price > 0.01) {
            obj.originalPrice = parseFloat(price).toFixed(2);
          } else {
            obj.originalPrice = 0.01
          }
        } else {
          obj.originalPrice = price
          this.$emit('goodsSpec', {
            attr: this.optAttrs,
            optSpecs: this.optSpecs
          })
          return;
        }
        this.$emit('goodsSpec', {
          attr: this.optAttrs,
          optSpecs: this.optSpecs
        })
      },

      // 编码发生变化是派发状态
      writeCode(stock) {
        this.$emit('goodsSpec', {
          attr: this.optAttrs,
          optSpecs: this.optSpecs
        })
        if (stock) {
          let that = this;
          this.totalStock = 0;
          this.optSpecs.map(item => {
            that.totalStock += Number(isNaN(item.spec.stock) ? 0 : item.spec.stock)
          })
        }
      },
      // 价格
      writeBatchPrice(batchPrice) {
        var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
        if (batchPrice) {
          var price = batchPrice;
          price = Number(price) || 0;
          if (reg.test(price)) {
            price = price.toString()
            if ((price.indexOf('.') == -1 && price.length <= 6) || price > 0.01) {
              batchPrice = parseFloat(batchPrice).toFixed(2);
            } else {
              //输入小数处理
              if (price.toString().indexOf('.') >= 0) {
                if (price <= 0.01) {
                  batchPrice = 0.01
                } else {
                  batchPrice = parseFloat(price).toFixed(2);
                }
              }
            }
          } else {
            return;
          }
          this.batchSet.batchPrice = batchPrice
        }
      },
      /*重量输入是否合法*/
      wirteWeight(obj) {
        var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
        let weight = obj.weight;
        if (weight.length > 0) {
          if (reg.test(weight)) {
            if (weight.toString().indexOf('.') == -1 && weight.toString().length <= 6) {
              obj.weight = parseFloat(weight).toFixed(2);
            }
          }
        } else {
          return;
        }
      },
      /**
       * 清除批量数据
       */
      resetBatch() {
        this.batchSet.batchPrice = '';
        this.batchSet.batchStock = '';
      },
      /*
       * 批量设置
       */
      saveBatch() {
        let that = this;
        if (this.RadioValue == 1) {
          if (this.batchSet.batchPrice > 0) {
            this.optSpecs.map(item => {
              // item.spec.price = that.batchSet.batchPrice
              that.$set(item.spec, 'price', that.batchSet.batchPrice)
            })
            this.$emit('goodsSpec', {
              attr: this.optAttrs,
              optSpecs: this.optSpecs
            })
          } else {
            this.$utils.layerMsg.warning('批量设置价格必须大于0')
            return;
          }
        } else {
          if (this.batchSet.batchStock > 0) {
            this.optSpecs.map(item => {
              // item.spec.stock = that.batchSet.batchStock
              that.$set(item.spec, 'stock', that.batchSet.batchStock)
            })
            this.$emit('goodsSpec', {
              attr: this.optAttrs,
              optSpecs: this.optSpecs
            })
            this.totalStock = Number(this.batchSet.batchStock) * this.optSpecs.length
          } else {
            this.$utils.layerMsg.warning('批量设置库存必须大于0')
            return;
          }
        }
      }

    }
  }

</script>
<style lang="less" scoped>
  @import url('../assets/less/variable.less');
  .add-btn,
  .add-props {
    width: 160px;
    height: 40px;
    background: @color-orange;
    color: @color-white;
    cursor: pointer;
    border: none;
    border-radius: 2px;
  }

  .section-title {
    line-height: 40px;
    width: 90px;
    text-align: right;
    float: left;
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
  }

</style>
