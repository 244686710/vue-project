<template>
  <div>
    <div class="title">{{title}}运费模板</div>
    <div class="head">
      <ul>
        <li class="name">
          <label for="" class="f_info">模板名称：</label>
          <input type="text" v-model="model.tplName" maxlength="15">
        </li>
        <li class="clearfix">
          <label class="f_left f_info" for="">计费方式：</label>
          <my-radio class="f_left f_info radio_grop" v-model="model.feeType" :options="radioOptions"></my-radio>
        </li>
      </ul>
    </div>
    <div class="title">配送区域</div>
    <div v-show="true" class="section_b">
      <table class="layui-table" lay-skin="line">
        <thead v-show="model.feeType == 1">
          <tr>
            <th style="width: 400px">可配送区域</th>
            <th>首件（个）</th>
            <th>运费（元）</th>
            <th>续件（个）</th>
            <th>续费（元）</th>
            <th>操作</th>
          </tr>
        </thead>
        <thead v-show="model.feeType == 2">
          <tr>
            <th style="width: 400px">可配送区域</th>
            <th>首重（kg）</th>
            <th>运费（元）</th>
            <th>续重（kg）</th>
            <th>续费（元）</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody class="f_info">
          <tr v-for="(item, index) in dataLists" :key="`feightDetial${index}`">
            <td>
              <div style="width: 400px">
                <span v-for="(area, index) in item.areaList" :key="area.id">{{area.name}}
                  <i v-show="index !== item.areaList.length-1">，</i>
                </span>
              </div>
            </td>
            <td v-show="model.feeType == 1">
              <input class="w70" type="text" v-model="item.firstWeight" @keyup="item.firstWeight = item.firstWeight ? item.firstWeight.replace(/\D/g,''): ''"
                maxlength="5">
            </td>
            <td v-show="model.feeType == 2">
              <input class="w70" type="text" v-model="item.firstWeight" @change="writeValue(item, 'firstWeight')" @keyup="item.firstWeight = item.firstWeight ? item.firstWeight.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,''): ''"
                maxlength="5">
            </td>

            <td>
              <input class="w70" type="text" v-model="item.firstPrice" @change="writeValue(item, 'firstPrice')" @keyup="item.firstPrice = item.firstPrice ?item.firstPrice.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,''): ''"
                maxlength="5">
            </td>
            <td v-show="model.feeType == 1">
              <input class="w70" type="text" v-model="item.continueWeight" @keyup="item.continueWeight = item.continueWeight ? item.continueWeight.replace(/\D/g,''): ''"
                value="" maxlength="5">
            </td>
            <td v-show="model.feeType == 2">
              <input class="w70" type="text" v-model="item.continueWeight" @change="writeValue(item, 'continueWeight')" @keyup="item.continueWeight = item.continueWeight ? item.continueWeight.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,''): ''"
                value="" maxlength="5">
            </td>
            <td>
              <input class="w70" type="text" v-model="item.continuePrice" @change="writeValue(item, 'continuePrice')" @keyup="item.continuePrice =item.continuePrice? item.continuePrice.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,''): ''" maxlength="5">
            </td>
            <td>
              <a href="javascript:;" class="handle" @click="toDeleteItem(index)">删除</a>
              <br>
              <a href="javascript:;" class="handle" @click="addItem(item)">编辑配送区域</a>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="text_center add_del">
        <a href="javascript:;" class="handle" @click="addItem()">指定可配送区域和运费</a>
      </p>
    </div>

    <div class="btn_group">
      <input type="button" class="btn_light_orange" value="保 存" @click="saveData()">
      <input type="button" class="btn_white_orange" value="取 消" @click="toHistory()">
    </div>

    <div id="modalMsg" class="express_modal hide">
      <div>
        <div class="city_list">
          <h3 class="city_list_title">可选省、市、区</h3>
          <ul class="city_list_content f_14 text_left">
            <li v-for="(item, index) in areaLists" :key="item.id">
              <dl>
                <dt class="padding_bottom10">
                  <my-checkbox v-model="item.CheckValue" :isDisabled="item.isDisabled" @input="checkedFather(item,index)"></my-checkbox>
                  {{item.name}}&nbsp;&nbsp;
                  <i class="inline_block icon-accordion " @click="showChild(item)"></i>
                </dt>
                <dd class="margin_left20" v-show="item.isShowChild">
                  <dl v-for="child in item.children" :key="child.id">
                    <dt class="padding_bottom10">
                      <my-checkbox v-model="child.CheckValue" :isDisabled="child.isDisabled" @input="checkedChild(child, item)"></my-checkbox>
                      {{child.name}}&nbsp;&nbsp;
                      <i class="inline_block icon-accordion" @click="showChild(child)"></i>
                    </dt>
                    <dd class="margin_left20" v-show="child.isShowChild">
                      <dl v-for="childChild in child.children" :key="childChild.id">
                        <dd class="padding_bottom10">
                          &nbsp;&nbsp;{{childChild.name}}
                        </dd>
                      </dl>
                    </dd>
                  </dl>
                </dd>
              </dl>
            </li>
          </ul>
        </div>
        <div class="to_left fl">
          <input type="button" class="btn_white_orange w80" value="添加" @click="addToLeft()">
        </div>
        <div class="city_list fr text_left">
          <h3 class="city_list_title">已选省、市、区</h3>
          <ul class="city_list_content f_14">
            <li v-for="item in areaListsCopy" :key="`copy${item.id}`">
              <dl>
                <dt class="padding_bottom10" v-show="item.isShow == true">
                  &nbsp;&nbsp;{{item.name}} &nbsp;&nbsp;
                  <i class="inline_block icon-accordion " @click="showChild(item)"></i> &nbsp;&nbsp;|&nbsp;&nbsp;
                  <i class="icon_delete" @click="deleteItem(item)">X</i>
                </dt>
                <dd class="margin_left20" v-if="item.isShowChild">
                  <dl v-for="child in item.children" :key="`copy${child.id}`">
                    <dt class="padding_bottom10" v-if="child.isShow == true">
                      &nbsp;&nbsp;{{child.name}} &nbsp;&nbsp;
                      <i class="inline_block icon-accordion" @click="showChild(child)"></i> &nbsp;&nbsp; | &nbsp;&nbsp;
                      <i class="icon_delete" @click="deleteItem(child, item)">X</i>
                    </dt>
                    <dd class="ml20" v-show="child.isShowChild">
                      <dl v-for="childChild in child.children" :key="`copy${childChild.id}`">
                        <dd class="padding_bottom10">
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{childChild.name}}
                        </dd>
                      </dl>
                    </dd>
                  </dl>
                </dd>
              </dl>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import fetchJson from "../../api/http";
  import api from "../../api/api";
  import MyRadio from '../../components/Radio.vue'
  import MyCheckbox from "../../components/Checkbox.vue";
  export default {
    name: 'DeliveryEdit',
    components: {
      MyRadio,
      MyCheckbox
    },
    data () {
      return {
        model: {
          feeType: 1, // 模板类型
          tplName: '' // 模板名称
        },
        dataLists: [],
        areaLists: [], // 地址库
        areaListsCopy: [], // 右侧
        existIds: [], // 已经存在的id集合
        radioOptions: [{
          Text: '按件数',
          Value: 1
        },
        {
          Text: '按重量',
          Value: 2
        }]
      }
    },
    mounted () {
      // 获取地址库；
      this.getAreaLists();
      this.getDetial();
    },

    computed: {
      title () {
        return this.$route.query.id == 0 ? '新建' : '编辑'
      }
    },
    methods: {
      /**
       * 检测数据格式
       * @param {Object} item
       * @param {String} key
       */
      writeValue(item, key) {
        var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
        if (item[key]) {
          var val = item[key];
          if (reg.test(val)) {
            if (val.toString().indexOf('.') == -1 && val.toString().length <= 6) {
              item[key] = parseFloat(val).toFixed(2);
            }
          } else {
            item[key] = '';
            this.$utils.layerMsg.warning('请输入两位小数，或者整数！')
          }
        }
        item = Object.assign({}, item)
      },

      /**
       * 点击编辑页面的取消按钮返回上一页
       */
      toHistory() {
        this.$router.go(-1);
      },

      /**
       * 编辑是获取详情
       * @param {Number} index
       */
      async getDetial() {
        let id = this.$route.query.id;
        if (id == 0) {
          this.model = {
            feeType: 1, // 模板类型
            tplName: '' // 模板名称
          };
          this.dataLists = []
          // this.areaLists = [] // 地址库
          // this.areaListsCopy = [] // 右侧
          return;
        }

        const res = await await fetchJson.post(api.seeFreight, 'params', {
          id
        });
        if (res.statusCode == 200) {
          this.dataLists = res.responseContent.shopFreightPriceSchemaVOList;
          this.model.feeType = res.responseContent.feeType; // 模板类型
          this.model.tplName = res.responseContent.tplName // 模板类型
          this.model = Object.assign({}, this.model)
        }
      },

      /**
       *删除配送区域
       *@param {Number} index
       */
      toDeleteItem(index) {
        this.dataLists.splice(index, 1);
        this.dataLists = Object.assign([], this.dataLists);
      },
      // 提交保存
      async saveData() {
        let that = this;
        let isSave = true;
        if (!this.model.tplName) {
          this.$utils.layerMsg.error('模板名称不可以为空')
          isSave = false;
          return false;
        }
        if (this.model.feeType == 2) {
          var firstWeightFlag=true;
          var continueWeightFlag=true;
          for(var i=0;i<this.dataLists.length;i++){
            if(this.dataLists[i].firstWeight>1000){
              firstWeightFlag=false;
            }
            if(this.dataLists[i].continueWeight>1000){
              continueWeightFlag=false;
            }
          }
          if(!firstWeightFlag){
            this.$utils.layerMsg.error('首重不能大于1000kg');
            isSave = false;
            return false;
          };
          if(!continueWeightFlag){
            this.$utils.layerMsg.error('续重不能大于1000kg');
            isSave = false;
            return false;
          };
        }

        let dataListsCopy = [];
        dataListsCopy = JSON.parse(JSON.stringify(that.dataLists));

        dataListsCopy.map(item => {
          if (item.areaList.length == 0) {
            that.$utils.layerMsg.error('区域不可以为空！')
            isSave = false;
            return;
          } else {
            item.areaIdList = [];
            item.areaList.map(areaList => {
              item.areaIdList.push(areaList.id)
            })
            delete item.areaList;
          }
          if (item.firstWeight <= 0 || item.firstPrice < 0 || item.continueWeight <= 0 || item.continuePrice <=
            0) {
              isSave = false;
            if (that.model.feeType == 1) {
              if (item.firstWeight <= 0) {
                that.$utils.layerMsg.error('首件必须大于0');
                return
              }
              if (item.continueWeight <= 0) {
                that.$utils.layerMsg.error('续件必须大于0');
                return
              }
            } else {
              if (item.firstWeight <= 0) {
                that.$utils.layerMsg.error('首重必须大于0');
                return
              }
              if (item.continueWeight <= 0) {
                that.$utils.layerMsg.error('续重必须大于0');
                return
              }
            }
            if (item.firstPrice <= 0) {
              that.$utils.layerMsg.error('运费必须大于0');
              return
            }
            if (item.continuePrice <= 0) {
              that.$utils.layerMsg.error('续费必须大于0');
              return
            }
            return false;
          }
        })
        if (!isSave) return;
        let data = {
          id: this.$route.query.id,
          ...this.model,
          freightPriceSchemaDTOList: dataListsCopy
        };
        const loading = window.layer.load(2)
        const res = await fetchJson.post(api.addFreight, 'data', data)
        window.layer.close(loading)
        if (res.statusCode == 200) {
          that.$utils.layerMsg.success('操作成功');
          that.model = {
              feeType: 1, // 模板类型
              tplName: '' // 模板名称
            },
            that.dataLists = [];
          this.$router.go(-1);
        }
      },
      // 向右边选中
      addToLeft() {
        let that = this,
        haveChecked = false;
        for (let i = 0, len = that.areaLists.length; i < len; i++) {

          for (let j = 0; j < len; j++) {
            if (that.areaLists[i].CheckValue && that.areaLists[i].id == that.areaListsCopy[j].id) {
              haveChecked = true;
              that.areaListsCopy[j].isShow = true;
              var LeftChildrens = that.areaLists[i].children;
              var rightChildrens = that.areaListsCopy[j].children;
              for (var a = 0; a < LeftChildrens.length; a++) {
                for (var b = 0; b < rightChildrens.length; b++) {
                  if (LeftChildrens[a].CheckValue && LeftChildrens[a].id == rightChildrens[b].id) {
                    rightChildrens[b].isShow = true;
                  }
                }
              }
            }
          }
        }
        if (!haveChecked) {
          that.$utils.layerMsg.warning('请先勾选之后再进行添加');
          return;
        }
        that.areaListsCopy = Object.assign([], that.areaListsCopy)
      },

      // 对数据进行初始化
      resetRecursion(item) {
        for (let key in item) {
          var keyValue = item[key];
          if (keyValue instanceof Array) {
            this.resetRecursion(keyValue)

          } else if (keyValue instanceof Object) {
            keyValue.isShow = false;
            keyValue.isDisabled = false;
            keyValue.CheckValue = false;
            this.resetRecursion(keyValue)
          }
        }
        return item
      },

      // 添加区域
      addItem(list) {
          // 对已经选中过的进行过滤处理
        this.existIds = []; //已经存在的城市
        let that = this;
        let itemExistIds = [];
        if(list) {
          list.areaList.map(item => {
            itemExistIds.push(item.id);
          })
          itemExistIds.map(id => {
            that.areaListsCopy.map(areaList => {
              if(id == areaList.id){
                areaList.isShow = true;
                areaList.children.map(val => {
                  val.isShow = true
                })
              } else {
                areaList.children && areaList.children.map(val => {
                if(val.id == id) {
                  val.isShow = true;
                  let parentId = val.parentId;
                  that.areaListsCopy.map(parent => {
                    if(parent.id == parentId) {
                      parent.isShow = true
                    }
                  })
                  }
                })
              }
            })
          })
          that.areaListsCopy = Object.assign([], that.areaListsCopy)
        }

        this.dataLists.map(function (item) {
          for (var i = 0; i < item.areaList.length; i++) {
            that.existIds.push(item.areaList[i].id)
          }
        });
        that.existIds.map(item => {
          that.areaLists.map(arealist => {
            if(arealist.id == item) {
              arealist.isDisabled = true
              arealist.children.map(val => {
                val.isDisabled = true
              })
            } else {
              arealist.children && arealist.children.map(val => {
                if(val.id == item) {
                  val.isDisabled = true
                }
              })
            }
          })
        })
        that.areaLists = Object.assign([], that.areaLists);
        let dialog = that.$utils.layerOpen({
          title: '选择可配送区域', //弹框标题
          width: '850px', //弹框宽度
          height: '670px',
          content: $('#modalMsg'), //弹框内容
          btn: ['确认', '取消'],
          yes() {
            let saveLists = [];
            that.areaListsCopy.map(function (item) {
              let childrenChedked = [];
              if (item.isShow) {
                item.children.map(function (child) {
                  if (child.isShow) {
                    childrenChedked.push({
                      id: child.id,
                      name: child.name,
                      parentId: child.parentId
                    })
                  }
                })
                if (childrenChedked.length < item.children.length) {
                  for (let i = 0, len = childrenChedked.length; i < len; i++) {
                    saveLists.push(childrenChedked[i])
                  }
                } else {
                  saveLists.push({
                    id: item.id,
                    name: item.name,
                    parentId: item.parentId
                  })
                }

              }
            })
            if (saveLists.length == 0) {
              that.$utils.layerMsg.warning('已选择的地区不可以为空!')
              return;
            } else {
              if (list) {
                list.areaList =saveLists;
              } else {
                that.dataLists.push({
                  areaList: saveLists,
                  firstWeight: 0,
                  firstPrice: 0,
                  continueWeight: 0,
                  continuePrice: 0
                })
              }
            }
            layer.close(dialog);
            that.dataLists = Object.assign([], that.dataLists);
            that.resetRecursion(that.areaListsCopy);
            that.resetRecursion(that.areaLists);
            that.areaListsCopy = Object.assign([], that.areaListsCopy)
            that.areaLists = Object.assign([], that.areaLists)
          },
          end: function () {
            that.resetRecursion(that.areaListsCopy);
            that.resetRecursion(that.areaLists);
            that.areaListsCopy = JSON.parse(localStorage.getItem('areaTree'))
            that.areaLists = JSON.parse(localStorage.getItem('areaTree'))
          }
        })
      },

      // 获取地址库
      async getAreaLists() {
        let areaTree = JSON.parse(localStorage.getItem('areaTree'));
        if (areaTree) {
          this.areaLists = areaTree;

          this.areaListsCopy = JSON.parse(JSON.stringify(areaTree));
        } else {
          const res = await fetchJson.post(api.areaTree, 'params', {})
          if (res.statusCode == 200) {
            this.areaLists = res.responseContent;
            this.areaListsCopy = JSON.parse(JSON.stringify(res.responseContent));
            localStorage.setItem('areaTree', JSON.stringify(res.responseContent));
          }
        }
        this.areaLists = Object.assign([], this.areaLists)
      },

      /**
       * 控制是否显示children
       *@param {Object} item
       */
      showChild(item) {
        let val = !item.isShowChild;
        this.$set(item, 'isShowChild', val)
      },

      // 勾选一级类
      checkedFather(val) {
        let that = this;

        if(val.children && val.children.length>0){
          for(var i=0, len = val.children.length; i<len; i++){
            that.$set(val.children[i], 'CheckValue', val.CheckValue)
          }
        }
        that.$nextTick( () => {
          if(val.children && val.children.length>0){
          for(var i=0, len = val.children.length; i<len; i++){
            that.$set(val.children[i], 'CheckValue', val.CheckValue)
          }
        }
        }

        )
        // val = Object.assign({}, val);
        // that.$nextTick;
        // that.$refs.itemchecked
      },

      // 勾选二级分类
      checkedChild(child, item) {
        let that = this;
        if (child.CheckValue == true) {
          item.CheckValue = true
        } else {
          let allChecked = false // 判断是否全选
          item.children.map(itemChild => {
            if (itemChild.CheckValue) {
              allChecked = true
            }
          })
          item.CheckValue = allChecked;
        }
      },
      /**
       *删除选中的分类
       * @param {Object} item
       * @param {Array | null} items
       */
      deleteItem(item, items) {
        item.isShowChild = false;
        item.children.map(function (val) {
          val.isShow = false;
        })
        this.areaLists.map(area => {
          if(item.id == area.id){
            area.isDisabled = false;
            if(area.children && area.children.length>0) {
              area.children.map(child => {
                child.isDisabled = false
              })
            }
          }else{
            if(area.children && area.children.length>0) {
              area.children.map(child => {
                if(child.id == item.id){
                  child.isDisabled = false
                  let parentId = item.parentId;
                  this.areaLists.map(areaList => {
                    if(parentId == areaList.id) {
                      areaList.isDisabled = false
                    }
                  })
                }
              })
            }
          }
        })
        this.areaLists = Object.assign([], this.areaLists);

        // item = Object.assign({}, item, {isShow: false})
        this.$set(item, 'isShow', false)
        if (items) {
          let haveChild = false;
          items.children.map(function (child) {
            if (child.isShow) {
              haveChild = true
            }
          })
          items.isShow = haveChild;
          items = Object.assign([], items)
        }
        this.areaListsCopy = Object.assign([], this.areaListsCopy)

      },

    },
  }

</script>
<style lang="less" scoped>
  @import url('../../assets/less/index.less');
  .head {
    padding: 20px 30px;
    background: @color-white;
    line-height: 40px;
    label {
      margin-right: 8px
    }
    .name {
      padding-bottom: 10px;
      input {
        box-sizing: border-box;
        width: 830px;
        height: 40px;
        padding: 6px;
      }
    }

    .radio_grop {
      margin-top: -6px;
    }
  }

  .section_b .layui-table td,
  .section_b .layui-table th {
    padding: 15px;
  }

  .add_del {
    height: 50px;
    line-height: 50px
  }

  .btn_group input {
    width: 160px;
    height: 40px;
    cursor: pointer;
    &:last-child {
      margin-left: 30px;
      border: 1px solid @color-border;
      color: @color-6
    }
  } // 地址库样式
  .express_modal table .input_set {
    width: 70px;
    padding: 6px;
    text-align: center
  }

  .express_modal .city_list {
    float: left;
    width: 300px;
    height: 430px;
    border: 1px solid #ddd;
    margin: 40px 25px 30px 60px;
  }

  .express_modal .city_list.fr {
    margin-left: 25px;
  }

  .express_modal .city_list .city_list_title {
    height: 50px;
    line-height: 50px;
    background: #eee;
    font-size: 16px;
    text-align: center
  }

  .express_modal .city_list .city_list_content {
    padding: 15px 20px;
    box-sizing: border-box;
    overflow-y: scroll;
    height: 380px
  }

  .icon_to_bottom {
    background-position: -343px -18px;
    width: 16px;
    height: 12px;
  }

  .to_left input {
    margin-top: 260px;
  }

  .padding_bottom10 {
    padding-bottom: 10px;
  }

  .icon_delete {
    cursor: pointer;
    color: @color-error;
    &:hover {
      font-weight: 600;
    }
  }

  .w70 {
    width: 58px;
    padding: 0 6px;
    font-size: 12px;
  }

</style>
