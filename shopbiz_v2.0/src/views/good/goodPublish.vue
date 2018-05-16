<template>
  <div>
    <div class="title">品类管理</div>
    <div class="section_b">
      <div class="m_head">
        <input type="button" class="btn_light_orange btn_add" value="+ 添加一级分类" @click="addChild(1)">
        <div class="f_right btn_group">
          <input type="button" class="btn_light_orange " value="保存修改" @click="batchSave()">
          <input type="button" class="btn_light_orange" value="批量删除" @click="batchDelect()">
        </div>
      </div>
      <div>
        <div class="thead clearfix">
          <ul class="overflow">
            <li class="text_left">分类名称</li>
            <li>移动</li>
            <li>展示在店铺主页</li>
            <li>创建时间</li>
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
                      <my-checkbox class="margin_top20" v-model="item.CheckValue" @input="checkedFather(item,index)"></my-checkbox>
                      <input type="text" class="w160 border padding_v_10" v-model="item.name" maxlength="20"/>
                      <i class="inline_block icon-select-arrow" @click="toShowChild(item)"></i>
                    </li>
                    <li>
                      <i class="icon-arrow-top-active" :class="{'icon-arrow-top': index == 0}" @click="toUP(index, classLists)"></i>
                      <i class="icon-arrow-bottom-active" :class="{'icon-arrow-bottom': index == classLists.length-1}" @click="toDOWN(index, classLists)"></i>
                    </li>
                    <li class="switch_box">
                      <div class="switch f_right">
                        <a href="javascript:;" :class="{active: item.showFlag ==1}" @click="item.showFlag = 1">启用</a>
                        <a href="javascript:;" :class="{active: item.showFlag ==0}" @click="item.showFlag = 0">未启用</a>
                      </div>
                    </li>
                    <li>
                      {{item.createTime}}
                    </li>
                    <li>
                      <a href="javascript:;" class="handle" @click="deleteClass(item,index, classLists)">删除</a>
                    </li>
                  </ul>

                </dt>
                <dd class="" v-show="item.isShowChild">
                  <dl v-for="(child, childIndex) in item.children" :key="child.id">
                    <dt class="">
                      <ul class="item clearfix">
                        <li class="text_left  item_child">
                          <my-checkbox class="margin_top20" v-model="child.CheckValue" ref='itemchecked'  @input="checkedChild(child, item)"></my-checkbox>
                          <input type="text" class="w160 padding_v_10 border" v-model="child.name" :class="{error_border: child.isError}" maxlength="20">
                        </li>
                        <li>
                          <i class="icon-arrow-top-active" :class="{'icon-arrow-top': childIndex == 0}" @click="toUP(childIndex, item.children)"></i>
                          <i class="icon-arrow-bottom-active" :class="{'icon-arrow-bottom': childIndex == item.children.length-1}" @click="toDOWN(childIndex, item.children)"></i>
                        </li>
                        <li class="switch_box">

                        </li>
                        <li>
                          {{child.createTime}}
                        </li>
                        <li>
                          <a href="javascript:;" class="handle" @click="deleteClass(child, childIndex, item.children)">删除</a>
                        </li>
                      </ul>
                    </dt>
                  </dl>
                </dd>
              </dl>
              <div v-show="item.isShowChild" class="btn_box">
                <input type="button" class="handle" value="+添加二级列表" @click="addChild(item)">
              </div>
            </li>
          </ul>
          <div v-if="classLists.length== 0 " class="text_center padding_top30">当前没有任何数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../api/api';
  import fetchJson from '../../api/http';
  import MyCheckbox from '../../components/Checkbox.vue'
  export default {
    name: 'goodPublish',
    components: {
      MyCheckbox
    },
    data () {
      return {
        classLists: [], // 品类数组
        model: {
          CheckValue: false // CheckBox状态
        }

      }
    },
    created: function () {
      this.getCategoryTree()
    },
    methods: {
      // 勾选一级类
      checkedFather(val){
        let that = this;
        const newVal = {...val}
        newVal.children.map(item => {
          that.$set(item, 'CheckValue', val.CheckValue)
        })
        val = Object.assign({}, newVal);
        // that.$nextTick;
        // that.$refs.itemchecked
      },

      // 勾选二级分类
      checkedChild(child, item) {
        let that = this;
        if(child.CheckValue == false){
          item.CheckValue = false
        }else{
          let allChecked = true // 判断是否全选
          item.children.map(itemChild => {
            if(!itemChild.CheckValue){
              allChecked = false
            }
          })
          if(allChecked){
            item.CheckValue = true;
          }
        }

      },

      /*
       *获取分类列表
       *param {string} id  '0' 全部分类
       */
      async getCategoryTree(id = 0) {
        const res = await fetchJson.post(api.getCategoryTree, "params", {
          id
        });

        if(res.statusCode == 200) {
          this.classLists = [];
          if(res.responseContent.length == 0){
            return;
          }
           res.responseContent.map(item => {
            item.CheckValue = false;
            if(item.children.length> 0 ){
              item.children.map (child =>{
                item.CheckValue =false
              })
            }
          })
           res.responseContent[0].isShowChild = true;
           this.classLists = res.responseContent
        }else{
          this.$utils.layerMsg.error('获取分类列表失败！')
        }

      },

      /**
     * 向上移动
     * param {Number} index
     * param {Array} arr
     */
      toUP(index, arr) {
        if (index == 0) return;
        let beforeItem = arr[index - 1];
        let nowItem = arr[index]
        this.$set(arr, index, beforeItem)
        this.$set(arr, index-1, nowItem)
      },

      /**
       * 向下移动
       * param {Number} index
       * param {Array} arr
       */
      toDOWN (index, arr) {
        if (index == arr.length - 1) return;
        let afterItem = arr[index + 1];
        let nowItem = arr[index]
        this.$set(arr, index, afterItem)
        this.$set(arr, index+1, nowItem)
      },
      /*
      * 点击展现child
      * param { Object } item
      */
      toShowChild (item) {
        let that = this;
        if(!item.isShowChild){
          this.classLists.map(list => {
            that.$set(list, 'isShowChild' , false)
          })
          this.$set(item, 'isShowChild' , true)
        }else{
          this.classLists.map(list => {
            that.$set(list, 'isShowChild' , false)
          })
        }


      },

      /*
      *添加类目
      *param {number | Object} level
      */
      addChild (level) {
        let that = this;
        let isAddchild = true;
        if( level == 1 ) {
          this.classLists.map(item => {
            if(item.name == ''){
              isAddchild = false
            }
          })
          if(!isAddchild){
            that.$utils.layerMsg.warning('请先填写一级分类名称!');
            return;
          }
          this.classLists.push({
            name: '',
            level: 1,
            showFlag: 0,
            children: []
          })
        }else {
           if (!level.name) {
            that.$utils.layerMsg.warning('请先填写一级分类名称!');
            isAddchild = false;
            return;
          }else{
            level.children.map(itemChild =>{
              if(!itemChild.name){
                that.$utils.layerMsg.warning('请先填写空的二级分类名称');
                isAddchild = false;
                return false;
              }
            });
          }
          if(isAddchild) {
            level.children.push({
              level: 2,
              id: '',
              name: '',
              // code: 'child',
              children: []
            })
          }
        }
      },

      /*
      *删除分类
      * param {Object} item
      * param {Number} index
      * param {Array} arr
      */
      deleteClass (item, index, arr) {
        let deletInfo = '';
        let that = this;
        if(item.level == 1){
          deletInfo = `确认删除 “${item.name}” 及所属的全部子分类`;
        }else{
          deletInfo = `确认删除 “${item.name}” 分类？`;
        }
         let dialog = layer.confirm(
          `<p class="padding_top30">${deletInfo}</p>`, {
            title: "删除商品",
            btn: ["确 定", "取 消"], // 按钮
            area: ["600px", "265px"]
          },
          async function () {
            //执行删除操作
            layer.close(dialog);
            if(!item.id){
              arr.splice(index, 1);
              arr = Object.assign({}, arr)  // 对数据重新赋值
              that.$utils.layerMsg.success('删除成功！')
              return false;
            }

            const res = await fetchJson.post(api.deleteClass, 'params', {id: item.id})
            if(res.statusCode == 200) {
              arr.splice(index, 1);
              arr = Object.assign({}, arr)  // 对数据重新赋值
              that.$utils.layerMsg.success('删除成功！')
              // that.getCategoryTree()
            }else {
              that.$utils.layerMsg.error(res.statusMessage)
            }
          },
          function () {
            //执行取消操作
            layer.close(dialog);
          }
        );
      },

      /*
      * 批量删除
      */
      batchDelect () {
        let categoryIds = []; // 要删除的id集合
        let that = this, checkedCategory = [];
        let heaveChecked = false; // 判断是否选中

        const  checkedFun = (data=[]) => {
          data.map(function (item) {
            if (item.CheckValue == true) {
              heaveChecked = true;
              if(item.id != ''){
                categoryIds.push(item.id);
              }
            }
            if (item.children instanceof Array) {
              checkedFun(item.children)
            }
          })
        }
        checkedFun(that.classLists);

        if (!heaveChecked) {
          that.$utils.layerMsg.warning('勾选后再进行批量删除!')
          return;
        }
        let dialog = layer.confirm(
          `<p class="padding_top30">确认要批量删除?</p>`, {
            title: "删除商品",
            btn: ["确 定", "取 消"], // 按钮
            area: ["600px", "265px"]
          },
          async function () {
            // 执行删除操作
            layer.close(dialog);
            const  deleteDefault = (data = []) =>{  // 删除没有提交的类
              var i = data.length;
              while (i--) {
                if (data[i].CheckValue == true && data[i].id == '') {
                  data.splice(i, 1);
                }
                if(data[i] && data[i].children instanceof Array){
                  deleteDefault(data[i].children)
                }
              }
            }
            // const deleteItem = (data = []) => {  // 删除类
            //   var i = data.length;
            //   while (i--) {
            //     if (data[i].CheckValue == true && data[i].id) {
            //       data.splice(i, 1);
            //     }
            //     if(data[i] && data[i].children instanceof Array){
            //       deleteDefault(data[i].children)
            //     }
            //   }
            // }
            deleteDefault(that.classLists)
            if (categoryIds.length == 0) {
              that.$utils.layerMsg.success('删除成功！')
              return ''
            }
            const res = await fetchJson.post(api.deleteBatchClass, 'data', {categoryIds: categoryIds})
            if (res.statusCode == 200) {
              that.$utils.layerMsg.success('删除成功！')
              that.getCategoryTree();
            } else {
              that.$utils.layerMsg.error(res.statusMessage)
            }
          },
          function (dialog) {
            // 执行取消操作
            window.layer.close(dialog);
          }
        )
      },

      /*
      *批量保存
      */
      async batchSave () {
        let postData = [ ...this.classLists ]
        let SAVE = true;
        let that = this;

        function recursion (data) { // 对checkbox 进行 递归全选
          data.map(function (item, index) {
            item.sortIndex = ++index
            if (!item.name || item.isError) {
              SAVE = false
            }
            delete item.createTime
            delete item.parentId
            delete item.isShowChild
            delete item.isError
            delete item.CheckValue
            delete item.level
            if (item.children instanceof Array) {
              recursion(item.children)
            }
          })
        }
        recursion(postData)

        if (!SAVE) {
          that.$utils.layerMsg.warning('分类名称存在错误，请更改!')
          return ''
        }
        const res = await fetchJson.post(api.batchSaveClass, 'data', {goodsCategoryDTOList: postData})
        if (res.statusCode == 200) {
          that.$utils.layerMsg.success('保存修改成功!')
          if (sessionStorage.getItem('isGoodsToGoodsPublish')) {
            that.$router.go(-1)
            sessionStorage.removeItem('isGoodsToGoodsPublish')
            return ''
          }
          that.getCategoryTree()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
   @import url('../../assets/less/variable.less');
  .margin_top20{margin-top:20px !important;}
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
  }

  .switch_box {
    position: relative;
  }

  .switch{
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
      &.active{
        color: @color-white;
        border: 1px solid @color-orange;
        background:  @color-orange
      }
    }
  }

  .tbody {
    padding-bottom: 60px;

    .layui-form-checkbox{
      margin-right: 28px;
    }

    input{
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
  }

  .item_child {
    padding-left: 78px!important;
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

.btn_box{
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid @color-border;
  padding-left: 100px;
  input{
    background: @color-white;
    border: 1px solid @color-border;
    color: @color-blue;
    cursor: pointer;
  }
}
.icon-select-arrow{
  margin-left: 18px;
  cursor: pointer;
}
</style>
