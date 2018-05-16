<template>
  <div @click="offSelete()">
    <div class="title">商城类目关联</div>
    <div class="section_b">
      <div>
        <div class="thead clearfix">
          <ul class="overflow">
            <li class="text_left">分类名称</li>
            <li class="secend-child"></li>
            <li>操作</li>
          </ul>
        </div>

        <div class="tbody">
          <ul class="overflow">
            <li v-for="(item, index) in classLists" :key="item.id">
              <dl>
                <dt class="">
                  <ul class="item clearfix">
                    <li class="text_left">
                      <input type="text" class="w160 border padding_v_10" v-model="item.name" maxlength="20" />
                      <i class="inline_block icon-select-arrow" v-show="item.children && item.children.length>0 " @click="toShowChild(item)"></i>
                    </li>
                    <li class="secend-child handle">
                      <!-- <span v-show="!item.children || item.children.length ==0" @click="toBindClass(item)"><span v-for="(itemBind, itemIndex) in item.bindTitle">{{itemBind.title}}<i v-show="itemIndex< item.bindTitle.length-1">——</i></span> <span v-show="!item.bindTitle">--</span></span> -->
                    </li>
                    <li>
                      <a href="javascript:;" v-show="!item.children || item.children.length ==0" class="handle" @click="toBindClass(item)">关联上架</a>
                    </li>
                  </ul>

                </dt>
                <dd class="" v-show="item.isShowChild">
                  <dl v-for="(child, childIndex) in item.children" :key="child.id">
                    <dt class="">
                      <ul class="item clearfix">
                        <li class="text_left  item_child">
                          <input type="text" class="w160 padding_v_10 border" v-model="child.name" :class="{error_border: child.isError}" maxlength="20">
                        </li>
                        <li class="secend-child">
                          <!-- {{child.createTime}} -->
                        </li>
                        <li>
                          <a href="javascript:;" class="handle" @click="toBindClass(child)">关联上架</a>
                        </li>
                      </ul>
                    </dt>
                  </dl>
                </dd>
              </dl>
            </li>
          </ul>
          <div v-if="classLists.length== 0 " class="text_center padding_top30">当前没有任何数据</div>
        </div>
      </div>
    </div>

    <!-- 类目列表 -->
    <div class="dialog hide" id="dialog">
      <div class="layui-inline padding_top30">
        <div class="layui-input-inline f_left select_h100">
          <my-select class="inline_block selcet_box" @input="onSelect" v-model="SelectValue1" :options="selectLevel1" ref="subSelect1"></my-select>
        </div>
        <div class="layui-form-mid">
          <i class="separator"></i>
        </div>
        <div class="layui-input-inline f_left">
          <my-select class="inline_block selcet_box" ref="subSelect2" @input="onSelect2" v-model="SelectValue2" :options="selectLevel2"></my-select>
        </div>
        <div class="layui-form-mid">
          <i class="separator"></i>
        </div>
        <div class="layui-input-inline">
          <my-select class="inline_block selcet_box" ref="subSelect3" @input="onSelect3" v-model="SelectValue3" :options="selectLevel3"></my-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../api/api';
  import fetchJson from '../../api/http';
  import MySelect from '../../components/Select.vue'
  export default {
    name: 'BindClass',
    components: {
      MySelect
    },
    data() {
      return {
        SelectValue1: 0,
        SelectValue2: 0,
        SelectValue3: 0,
        classLists: [], // 品类数组
        categoryLists: [],
        bindTitle: [], // 类目名称
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
    created: function () {
      this.getCategoryTree();
      this.getMallCateGoryTree();
    },
    methods: {
      offSelete() {
        this.isShowCategroy = false
        this.$refs.subSelect1.offSelect()
        this.$refs.subSelect2.offSelect()
        this.$refs.subSelect3.offSelect()
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

      toBindClass(item) {
        let that = this;
        const INDEX = this.$utils.layerOpen({
          content: $("#dialog"),
          title: '关联商城分类',
          width: '600px',
          height: '336px',
          btn: ['保存', '取消'],
          async yes() {
            // item.bindTitle = that.bindTitle;
            if (that.bindTitle.length == 0) return false
            let categoryId = that.bindTitle[that.bindTitle.length - 1].value ? that.bindTitle[that.bindTitle.length -
              1].value : '';
            if (!categoryId) {
              that.$utils.layerMsg.warning('请选择商城分类子分类')
              return false;
            }
            const res = await fetchJson.post(api.bindMallClass, "data", {
              shopCatId: item.id,
              categoryId: categoryId
            });
            if(res.statusCode == 200){
              that.$utils.layerMsg.success('绑定成功！')
            }

            layer.close(INDEX)
          },
          cancel() {

          }
        })
      },

      /**
       * 下拉列表下拉后触发
       */
      async onSelect(value) {
        this.selectLevel2.selectOptions = this.selectLevel2.selectOptions.slice(0, 1);
        this.selectLevel3.selectOptions = this.selectLevel3.selectOptions.slice(0, 1);
        this.SelectValue2 = 0;
        this.SelectValue3 = 0;
        this.$refs.subSelect2.resetDate();
        this.$refs.subSelect3.resetDate();

        let that = this;
        if (value == 0) {
          that.bindTitle = []
          return
        }
        this.selectLevel1.selectOptions.map(item => {
          if (item.Value == value) {
            if (value != 0) {
              that.bindTitle[0] = {
                title: item.Text,
                value
              };
            }
            if (item.children && item.children.length > 0) {
              that.bindTitle[1] = {}
            } else {
              that.bindTitle = that.bindTitle.slice(0, 1);
            }
            item.children.map(child => {
              that.SelectValue2 = 0;
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
        this.SelectValue3 = 0;
        this.$refs.subSelect3.resetDate();

        let that = this;
        if (value == 0) {
          return
        }
        this.selectLevel2.selectOptions.map(item => {
          if (item.Value == value) {
            if (value != 0) {
              that.bindTitle[1] = {
                title: item.Text,
                value
              };
            }
            if (item.children && item.children.length > 0) {
              that.bindTitle[2] = {}
            } else {
              that.bindTitle == that.bindTitle.slice(0, 2);
            }
            item.children.map(child => {
              that.SelectValue3 = 0;
              that.selectLevel3.selectOptions.push({
                Value: child.id,
                Text: child.name,
                children: child.children
              });
            })
          }
        })
      },

      onSelect3(value) {
        let that = this;
        this.selectLevel3.selectOptions.map(item => {
          if (item.Value == value) {
            if (value != 0) {
              that.bindTitle[2] = {
                title: item.Text,
                value
              }
            }
          }
        })
      },

      /*
       *获取分类列表
       *param {string} id  '0' 全部分类
       */
      async getCategoryTree(id = 0) {
        const res = await fetchJson.post(api.getCategoryTree, "params", {
          id
        });

        if (res.statusCode == 200) {
          this.classLists = [];
          if (res.responseContent.length == 0) {
            return;
          }
          res.responseContent.map(item => {
            item.CheckValue = false;
            if (item.children.length > 0) {
              item.children.map(child => {
                item.CheckValue = false
              })
            }
          })
          res.responseContent[0].isShowChild = true;
          this.classLists = res.responseContent
        } else {
          this.$utils.layerMsg.error('获取分类列表失败！')
        }

      },
      /*
       * 点击展现child
       * param { Object } item
       */
      toShowChild(item) {
        let that = this;
        if (!item.isShowChild) {
          this.classLists.map(list => {
            that.$set(list, 'isShowChild', false)
          })
          this.$set(item, 'isShowChild', true)
        } else {
          this.classLists.map(list => {
            that.$set(list, 'isShowChild', false)
          })
        }


      }
    }
  }

</script>
<style lang="less" scoped>
  @import url('../../assets/less/variable.less');
  @import url("../../assets/less/goods.less");
  .margin_top20 {
    margin-top: 20px !important;
  }

  .layui-form-select dl {
    max-height: 150px !important;
  }

  .thead li {
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
    text-align: center;
    padding-left: 30px;
    float: left;
    width: 17.4%;
    border-top: 1px solid @color-border;
    border-bottom: 1px solid @color-border;
    &:first-child {
      width: 30%;
      text-align: left;
    }
    &.secend-child {
      width: 52%;
      text-align: left;
    }
  }

  .switch_box {
    position: relative;
  }

  .switch {
    position: absolute;
    right: 50%;
    top: 14px;
    margin-right: -100px;
    width: 150px;
    height: 30px;
    a {
      box-sizing: border-box;
      float: left;
      text-align: center;
      width: 70px;
      height: 30px;
      line-height: 30px;
      background: @color-bg;
      color: @color-9;
      border: 1px solid @color-border;
      &.active {
        color: @color-white;
        border: 1px solid @color-orange;
        background: @color-orange
      }
    }
  }

  .tbody {
    padding-bottom: 60px;

    .layui-form-checkbox {
      margin-right: 28px;
    }

    input {
      box-sizing: border-box;
      padding: 6px;
      height: 40px;
      width: 160px;
    }
  }

  .tbody ul li ul li {
    box-sizing: border-box;
    height: 60px;
    line-height: 60px;
    text-align: center;
    padding-left: 30px;
    float: left;
    width: 17.4%;
    border-bottom: 1px solid @color-border;
    &:first-child {
      width: 30%;
      text-align: left;
    }
    &.secend-child {
      width: 52%;
      text-align: left;
    }
  }

  .item_child {
    padding-left: 78px !important;
  }

  .m_head {
    padding: 20px 30px;
    .btn_group .btn_light_orange {
      margin-left: 20px;
    }
  }

  .btn_add {
    width: 130px;
  }

  .btn_box {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid @color-border;
    padding-left: 100px;
    input {
      background: @color-white;
      border: 1px solid @color-border;
      color: @color-blue;
      cursor: pointer;
    }
  }

  .icon-select-arrow {
    margin-left: 18px;
    cursor: pointer;
  }

  .select_h100 {
    height: 145px;
    overflow: hidden;
    text-align: left
  }

</style>
