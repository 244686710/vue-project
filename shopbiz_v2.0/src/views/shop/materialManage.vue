<template>
  <div @click="offSelete()">
    <div class="title">素材管理</div>
    <div class="section_b group_header">
      <div class="f_left">
        <span class="group_name">{{title}}</span>
        <span v-show="!isDefault">
        <span class="" @click="reName()">重命名</span>|
        <span @click="delGroup()">删除分组</span>
        </span>
      </div>
      <div class="f_right">
        <my-select class="select_box" v-model="model.SelectValue" @input="selectGrop" :options="selectMsg" ref="selectRef1"></my-select>
        <span class="f_blue" @click="addGroup()">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 添加分组</span>
      </div>
    </div>
    <div class="section_b group_content layui-form">
      <div class="g_header clearfix">
        <div class="f_left">
          <my-checkbox class=""style ="margin-top: 8px" v-model="model.isAllChecked" @input="toCheckedAll" ref="allChecked"></my-checkbox>
          <span class="group_name">全选</span>
          <span @click="changeGroup()">修改分组</span>|
          <span @click="delPic()">删除</span>
        </div>
        <div class="f_right">
          <input class="btn_light_orange" type="button" value="上传图片" @click="toUpload()">
        </div>
      </div>
      <div class="g_content c_both" v-show="picNums.length>0">
        <ul>
          <li v-for="pic of picNums" :key="pic.id">
            <img :src="pic.filePath" />
            <p>
              <my-checkbox style="margin-top: 0" v-model="pic.isChecked"></my-checkbox>
              <span>{{ pic.name| strLenght(8) }}</span>
            </p>
          </li>
        </ul>
        <div class="c_both"></div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pager clearfix margin_bottom40">
      <pager class="f_right page_box" :options="pageInfo" @changePagerNum="recievePage"></pager>
      <div v-show="pageInfo.total == 0" class="text_center">当前没有任何数据</div>
    </div>

    <div class="upload_box">

    </div>

    <!-- 修改分组 -->
    <div class="change_box hide" id="changeGroup">
      <div class="dialog_content">
        <p class="dialog_title">请选择分组</p>
        <div class="select_h100">
          <my-select v-model="model.TargetValue" :options="selectGroupMsg" ref="selectRef2"></my-select>
        </div>
      </div>
    </div>

    <!-- 修改分组名称 -->
    <div class="change_box hide" id="reNameBox">
      <div class="dialog_content">
        <p class="dialog_title">
          <label>分组名称：</label>
          <input type="text" class="layui-input" v-model="model.rename" maxlength="6">
        </p>
      </div>
    </div>

    <!-- 添加分组 -->
    <div class="change_box hide" id="addGroup">
      <div class="dialog_content">
        <p class="dialog_title">
          <label>分组名称：</label>
          <input type="text" class="layui-input" v-model="model.newGroup" maxlength="6">
        </p>
      </div>
    </div>



    <!--上传图片弹框-->
    <div class="imgArrAlert text_left" id="imgUpload" style="display: none;">
      <div class="imgInfo">
        <div class="imgContent">
          <div class="imgCol clearfix">
            <div class="dic f_left">本地图片：</div>
            <div class="cot f_left">
              <div class="addImg clearfix">
                <div class="imgBtn" v-for="imgSrc in imgArr" :key="imgSrc.path">
                  <img :src="imgSrc.url" width="100%" height="100%;">
                </div>
                <div class="imgBtn uploadBtn" v-show="isUpload">
                  <i class="">+</i>
                </div>
              </div>
              <div class="tips">
                仅支持jpg、gif、png三种格式，大小不超过3MB
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="imgFoot">
        <a href="javascript:void(0)" class="btn_light_orange" @click="uploadSave()">确定</a>
      </div>
    </div>

    <!-- <my-layer :options="layerOptions"></my-layer> -->
  </div>
</template>

<script>
  import api from '../../api/api';
  import fetchJson from '../../api/http';
  import MyRadio from '../../components/Radio.vue'
  import MySelect from '../../components/Select.vue'
  import MyCheckbox from '../../components/Checkbox.vue'
  import config from '../../config'
  export default {

    components: {
      MyRadio,
      MySelect,
      MyCheckbox
    },
    name: "materialManage",
    data() {
      return {
        isDefault: true, // 默认为未分组
        title: '未分组',
        imgArr: [],
        isUpload: true, // 监听上传按钮是否显示
        count: 0, // 提交时计数
        model: {
          isAllChecked: false, // 全选初始状态
          SelectValue: '0', // select 默认选中第一个
          TargetValue: '0', // 移动图片的目标分组
          isChangeGroup: false,
          newGroup: '', // 新建分组
          rename: '', // 重命名
        },
        pageInfo: {
          total: 0,
          offset: 1,
          limit: 18
        },
        selectGroupMsg: {
          size: {
            w: '400px',
            h: '40px'
          },
          selectOptions: [
          ]
        },
        picNums: [], //测试变量，图片数量
        selectMsg: {
          size: {
            w: '150px',
            h: '30px'
          },
          selectOptions: [
          ]
        },

        showLayer: false, // 上传图片弹框
        layerOptions: {
          showLayer: false
        }
      }
    },
    mounted: function () {

      this.getGroupLists();
      this.crateUpload();
    },
    watch: {
      'imgArr' (newVal, oldVal) {
        if(newVal.length>10 || newVal.length == 10){
          this.isUpload = false;
        }else {
          this.isUpload = true;
        }
      }
    },
    methods: {
      //表格全选checkebox
      toCheckedAll (value) {
        let that = this;
        this.picNums.map( item => {
          // item.isChecked = value;
          that.$set(item, 'isChecked', value)
        })
      },

      offSelete () {
        this.$refs.selectRef1.offSelect()
        this.$refs.selectRef2.offSelect()
      },

      /**
      *创建上传图片
       */
      crateUpload() {
        let that = this;
        layui.use('upload', function (upload) {
          upload.render({
            method: 'POST',
            elem: ".uploadBtn",
            url: config.upLoad+'/file/upload-new', //要上传的图片地址
            multiple: true,
            accept: 'images'
            ,field: 'file'
            ,auto:true
            ,number: 10
            ,size: 3072
            ,ext: 'jpg|png', //那么，就只会支持这三种格式的上传。注意是用|分割。
            choose: function(obj){
              var files = obj.pushFile();
              obj.preview(function(index, file, result){ // 预读本地文件
                // console.log(index); //得到文件索引
                // console.log(file); //得到文件对象
                //对上传失败的单个文件重新上传，一般在某个事件中使用
                //obj.upload(index, file);
              });
            },
            done: function (res) {
              if (res.statusCode == 200) { //上传成功返回值，必须为json格式
                if(that.imgArr.length>10 || that.imgArr.length ==10) {
                  that.isUpload = false;
                  return;
                }
                that.imgArr.push(res.responseContent);
              } else if (res.result == 1) {

              }
            }
          })
        })
      },

      // 选择分组
      selectGrop (value) {
        let that = this;
        this.selectMsg.selectOptions.map(item => {
          if(item.Value == value) {
            that.title = item.Text;
            that.model.rename = item.Text;
          }
        })
        this.getPageList(value);
        if(value != 0) {
          this.isDefault = false;
        }else{
          this.isDefault = true;
        }
      },

      // 获取分组列表
      async getGroupLists () {
        const res = await fetchJson.post(api.picGroupList, 'params', {})
        if(res.statusCode == 200) {
          this.selectGroupMsg.selectOptions = [];
          this.selectMsg.selectOptions = [];
          res.responseContent.list.map(item => {
            this.selectGroupMsg.selectOptions.push({Value: item.id, Text: item.name})
            this.selectMsg.selectOptions.push({Value: item.id, Text: item.name})
          });
          this.selectMsg= Object.assign({}, this.selectMsg);
          await this.getPageList(this.model.SelectValue) // 分组改变时加载对应的分页数据
        }
        // this.model.SelectValue = this.selectGroupMsg.selectOptions[0].Value;
      },

      /**
       *获取列表数据
       * @param {String} folderId
       */
      async getPageList (folderId) {
        this.model.isAllChecked = false;
        let offset = this.pageInfo.offset;
        let limit = this.pageInfo.limit
        let loading = layer.load(2);
        const res = await fetchJson.post(api.picPageList, 'params', {folderId, offset, limit})
        layer.close(loading);
        if(res.statusCode == 200) {
          this.picNums = res.responseContent.list;
          this.pageInfo.total = res.responseContent.total;
        }
      },
      /**
       * 分页请求数据
       * @param {Number} msg
       */
      recievePage(msg) {
        this.pageInfo.offset = msg;
        this.getPageList(this.model.SelectValue);
      },


      /**
       * 删除图片
       */
      delPic: function () {
        let fileIds = [];
        let that = this;
        this.picNums.map(item => {
          if(item.isChecked){
            fileIds.push(item.id)
          }
        })
        if(fileIds.length == 0) {
          this.$utils.layerMsg.warning('请先勾选要更改分组的图片！')
          return ;
        }
        let index = layer.confirm('<p class="padding_top30">若删除，不会对目前使用该图片的相关业务造成影响。</p>', {
          title: "确认删除该图片？",
          btn: ['确 定', '取 消'], // 按钮
          area: ['600px', '265px'],
        },
        async () => {
          const res = await fetchJson.post(api.deletePic, 'params', {fileId: fileIds.join(',')})
          if(res.statusCode == 200) {
             await that.getPageList(that.model.SelectValue);
            that.$utils.layerMsg.success('删除图片成功！');
            layer.close(index);

          }
        }, function (index) {
          //执行取消操作
          layer.close(index);
        });
      },

      /*
       * 删除分组
       */
      delGroup() {
        layer.confirm('<p class="padding_top30"> 删除，不会对目前使用该图片的相关业务造成影响。</p> ', {
          title: "确认删除该分组？",
          area: ['600px', '265px'],
          btn: ['确 定', '取 消'] // 按钮
        },
        async() =>{
           const res = await fetchJson.post(api.picDeleteGroup, 'params', {folderId: this.model.SelectValue});
            if(res.statusCode == 200) {
              this.$utils.layerMsg.success('删除分组成功！');
              this.model.SelectValue = 0;
              this.title = '未分组'
              await this.getGroupLists();
            }
        }, (index) => {
          //执行取消操作
          layer.close(index);

        })
      },

      /*
       * 修改分组
       */
      changeGroup() {
        let fileIds = [];
        let that = this;
        this.picNums.map(item => {
          if(item.isChecked){
            fileIds.push(item.id)
          }
        })
        if(fileIds.length == 0) {
          this.$utils.layerMsg.warning('请先勾选要更改分组的图片！')
          return ;
        }
        let index = this.$utils.layerOpen({
          title: '修改分组',
          height: '400px',
          width: '650px',
          content: $('#changeGroup'),
          btn: ['确 定', '取 消'],
          async yes(){
            let params = {
              folderId: that.model.TargetValue,
              fileId: fileIds.join(',')
            }
            const res = await fetchJson.post(api.movePic, 'params', params)
            if(res.statusCode == 200) {
              that.$utils.layerMsg.success('改变分组成功！');
              layer.close(index);
              await that.getPageList(that.model.SelectValue);
            }
          },
          cancel() {},
          end() {}
        })
      },
      /*
       *修改分组名称
       */
      reName() {
        let that = this;
        var index = this.$utils.layerOpen({
          title: '编辑分组名称',
          height: '270px',
          width: '650px',
          content: $('#reNameBox'),
          btn: ['确 定', '取 消'],
          async yes(){
            if(!that.model.rename) {
              that.$utils.layerMsg.warning('分组名称不可以为空！');
              return;
            }
            let params = {
              folderId: that.model.SelectValue,
              folderName: that.model.rename
            }
            that.selectGroupMsg.selectOptions.map(item => {
              if(item.Value == that.model.SelectValue) {
                item.Text = that.model.rename
              }
            });
            const res = await fetchJson.post(api.picRenameGroup, 'params', params);
            if(res.statusCode == 200) {
               that.$utils.layerMsg.success('修改分组名称成功');
               await that.getGroupLists();
               that.title = that.model.rename;
               layer.close(index);
            }
          },
        })
      },

      // 添加分组
      addGroup() {
        let that = this;
        let index = this.$utils.layerOpen({
          title: '添加分组',
          height: '270px',
          width: '650px',
          content: $('#addGroup'),
          btn: ['确 定', '取 消'],
          async yes(){
            that.count ++;
            if(!that.model.newGroup) {
              that.$utils.layerMsg.warning('分组名称不可以为空！');
              return;
            }
            let params = {
              name: that.model.newGroup
            }
            if(that.count> 1) return
            const res = await fetchJson.post(api.picAddGroup, 'params', params);

            if(res.statusCode == 200) {
               that.$utils.layerMsg.success('添加分组成功！');
               layer.close(index);
               that.count = 0;
               await that.getGroupLists()
            }else{
              that.count = 0;
            }
          },
          cancel() {
            that.model.newGroup = '';
          },
          end() {
            that.model.newGroup = '';
          }
        })

      },

      // 生成上传图片弹框
      toUpload() {
        let that = this;
        var index = this.$utils.layerOpen({
          title: '上传图片',
          height: '600px',
          width: '1050px',
          content: $('#imgUpload'),
          yes: () => {
          },
          cancel() {
          },
          end() {
            that.imgArr = [];
            that.isUpload = true;
          }
        })
      },
       // 保存上传的图片
      async uploadSave () {
        if(this.imgArr.length == 0) {
          this.$utils.layerMsg.warning('请先上传后再执行“确定”操作')
          return ;
        }
        let fileList = [];
        this.imgArr.map(item => {
          fileList.push({name: item.name, filePath: item.url})
        })
        let params = {
          folderId: this.model.SelectValue, // 暂时上传到未分组状态
          fileList
        }
        const res =await fetchJson.post(api.uploadPic, 'data', params);
        if( res.statusCode == 200){
          this.$utils.layerMsg.success('保存图片成功!');
          layer.closeAll();
          await this.getPageList(this.model.SelectValue);
        }

      }
    },
  }

</script>
<style lang="less" scoped>
  @import url('../../assets/less/variable.less');
  .group_header,
  .group_content .g_header {
    line-height: 30px;
    padding: 0 20px 10px 30px;
    font-size: 14px;
    font-weight: bold;
    color: @color-blue;

    .f_left,
    .f_right {
      padding-top: 20px;
    }
  }
  .group_header{
    height: 60px;
  }

  .hide {
    display: none
  }

  .select_box {
    width: 150px;
    height: 30px;
    font-weight: 500;
    float: left;
  }

  .ayui-form-select .layui-input {
    height: 30px;
    line-height: 30px;
  }

  .group_header .f_left span,
  .group_content .g_header .f_left span {
    margin-right: 10px;
    margin-left: 10px;
    vertical-align: middle;
  }

  .group_header .f_left span.group_name,
  .group_content .g_header span.group_name {
    color: @color-3;
    margin-right: 12px;
    margin-left: 0px;
  }

  .group_header {
    .f_right {
      select {
        padding-left: 16px;
        margin-right: 22px;
      }
    }
  }

  .group_content {
    input[type="checkbox"] {
      width: 16px;
      height: 16px;
    }
    .g_header {
      .f_left {
        input[type="checkbox"] {
          margin-right: 26px;
          vertical-align: middle;
        }
      }
    }
    .g_content {
      border-top: 1px solid @color-border;
      padding: 12px 0;
      ul {
        li {
          padding: 25px;
          float: left;
          img {
            width: 220px;
            height: 220px;
            margin-bottom: 30px;
          }
          p {
            line-height: 16px;
            input[type="checkbox"] {
              margin-right: 14px;
              margin-top: -2px;
            }
            span {
              font-size: 14px;
              color: @color-6;
            }
          }
        }
      }
    }
  }

  .dialog_content {
    width: 400px;
    margin: 0 auto;
  }

  .dialog_title {
    padding-top: 55px;
    padding-bottom: 20px;
    text-align: left;
  }

  .select_h100 {
    height: 145px;
    overflow: hidden;
    text-align: left
  }

  #reNameBox,
  #addGroup {
    .dialog_content {
      width: 500px;
    }
    .dialog_title {
      padding-top: 40px;
      line-height: 40px;
      input {
        height: 40px;
        width: 400px;
      }
    }
  }

  .imgCol {
    padding: 80px 40px 40px;

    .dic {
      font-size: 16px;
      color: @color-3;
      font-weight: 600;
    }

    .tips {
      margin-top: 20px;
    }
    .uploadBtn {
      float: left;
      width: 100px;
      height: 100px;
      border: 2px dashed @color-border;
      line-height: 100px;
      text-align: center;
      font-size: 30px;
      cursor: pointer;
    }
  }



  .imgFoot {
    margin-top: 35px;
    padding-top: 20px;
    border-top: 1px solid @color-border;
    text-align: center;
    width: 100%;

    .btn_light_orange {
      display: inline-block;
      height: 40px;
      line-height: 40px;
    }
  }

  .imgBtn {
    width: 104px;
    height: 104px;
    float: left;
    border:1px solid #ddd;
    margin:  0 15px 20px 0;
  }
  .cot {
    width: 850px;
    height: 310px;
    padding-left: 20px;
    }

</style>
