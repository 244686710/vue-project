<template>
  <div class="upload">
    <a v-show="bar" href="javascript:;" @click="toCheckPic(5)" class="icon_btn_upload"> + </a>
    <!-- 图片弹框 -->
    <div class="img_room hide" id="editimgRoom">
      <div>
        <ul class="f_left nav" :class="{over_scoll: isScoll2}">
          <li v-for="(navItem, index) in navList"
          :class="{active: index == activeIndex }"
          :key="`nav${index}`"
           @click="changeGrop(index, navItem)">{{navItem.name}}（{{navItem.count}}）

          </li>
        </ul>
        <div class="f_left">
          <ul class="pic_box" :class="{over_scoll: isScoll1}">
            <li class="item_pic" v-for="(picItem, index) in picNums" :key="`picItem${index}`">
              <img :src="picItem.filePath" alt="">
              <i class="icon-pic-default" :class="{'icon-pic-checked': picItem.isChecked == true}" @click="changeRadio(picItem)"></i>
              <p class="pic_name">{{picItem.name | strLenght(8)}}</p>
            </li>
          </ul>
          <!-- 底部分页模块 -->
          <div class="pager_box clerrfix">
            <input type="button" class="btn_white_orange f_left" @click="toUpload()" value="上传图片">
            <div>
              <!-- 分页 -->
              <div class="pager clearfix f_right">
                <pager class="f_right page_box" :options="pageInfo" @changePagerNum="recievePage"></pager>
                <div v-show="pageInfo.total == 0" class="text_center">当前没有任何数据</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- footer -->
      <div class="footer">
        <p class="f_left margin_left20">已经选中{{activeImgLists.length}}张图片</p>
        </p>
        <input class="btn_light_orange" type="button" value="确定" @click="saveCheckedImg()">
      </div>
    </div>

    <!-- 上传模块 -->
    <div class="img_upload hide text_left" id="editupLoadRoom">
      <div class="img_upload_title">
        <span class="handle" @click="toUpload.close()">选择图片</span>>上传图片
      </div>
      <div class="imgInfo">
        <div class="imgContent">
          <div class="imgCol clearfix">
            <div class="dic f_left">本地图片：</div>
            <div class="cot f_left">
              <div class="addImg clearfix">
                <div class="imgBtn" v-for="imgSrc in imgArr" :key="imgSrc.path">
                  <img :src="imgSrc.url" width="100%" height="100%;">
                </div>
                <div class="imgBtn uploadBtn uploadBtn2" v-show="isUpload">
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
    </div>

  </div>
</template>
<script>
  import api from '@/api/api';
  import fetchJson from '@/api/http';
  import MySelect from './Select.vue'
  import config from '../config'
  export default {
    name: 'EditorImgStore',
    props: ['size', 'bar'],
    data() {
      return {
        model: {
          isAllChecked: false,
          SelectValue: 0,
        },
        isUpload: true,
        activeIndex: 0,
        isScoll1: false,
        isScoll2: false,
        picNums: [], // 分页图片列表
        navList: [], // left 测导航栏分组
        pageInfo: { // 分页参数
          total: 0,
          limit: 16,
          offset: 1,
        },

        imgArr: [],
        upLoadIndex: '',
        activeImgLists: [] // 已经选中的图片集合
      }
    },
    components: {
      MySelect
    },

    mounted() {
      this.getGroupLists();
      this.crateUpload();
    },
    watch: {
      'picNums' (now, old) {
        if (now.length > 8) {
          this.isScoll1 = true;
        } else {
          this.isScoll1 = false;
        }
      },
      'navList' (now, old) {
        if (now.length > 8) {
          this.isScoll2 = true;
        } else {
          this.isScoll2 = false;
        }
      },
      'imgArr' (newVal, oldVal) {
        if (newVal.length > 5 || newVal.length == 5) {
          this.isUpload = false;
        } else {
          this.isUpload = true;
        }
      }
    },

    methods: {
      // 获取分组列表
      async getGroupLists() {
        const res = await fetchJson.post(api.picGroupList, 'params', {})
        this.navList = res.responseContent.list;
        await this.getPageList(this.model.SelectValue) // 分组改变时加载对应的分页数据
        // this.model.SelectValue = this.selectGroupMsg.selectOptions[0].Value;
      },

      /**
       *获取列表数据
       * @param {String} folderId
       */

      async getPageList(folderId) {
        this.model.isAllChecked = false;
        let that = this;
        let offset = this.pageInfo.offset;
        let limit = this.pageInfo.limit
        let loading = layer.load(2);
        const res = await fetchJson.post(api.picPageList, 'params', {
          folderId,
          offset,
          limit
        })
        layer.close(loading);
        if (res.statusCode == 200) {
          this.picNums = res.responseContent.list;
          this.pageInfo.total = res.responseContent.total;
          this.picNums.map(item => {
            that.activeImgLists.map(val => {
              if (item.id == val.id) {
                that.$set(item, 'isChecked', true);
              }
            })
          })
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
      /***
       * 可以选择个数
       * @augments
       */
      toCheckPic(num) {
        this.$utils.layerOpen({
          title: '我的图片',
          content: $('#editimgRoom'),
          width: '1054px',
          height: '750px',
        })
      },
      /**
       * 改变radio状态
       * @param {Object} item
       */
      changeRadio(item) {
        if (!item.isChecked && this.activeImgLists.length == this.size) {
          this.$utils.layerMsg.warning(`最多可以选择${this.size}张`);
          return;
        }
        this.$set(item, 'isChecked', !item.isChecked);
        let that = this
        if (item.isChecked) {
          this.activeImgLists.push(item);
        } else {
          this.activeImgLists.map((val, index) => {
            if (val.id == item.id) {
              that.activeImgLists.splice(index, 1)
            }
          })
        }

      },

      // 保存选中的图片
      saveCheckedImg() {
        let that = this;
        this.$emit('checkedImgs', this.activeImgLists);
        this.activeImgLists = [];
        this.picNums.map(item => {
          that.$set(item, 'isChecked', false);
        })
        layer.closeAll();
      },

      /**
       * @param {Number} index
       * @param {Object} item
       */
      changeGrop(index, item) {
        this.pageInfo.offset = 1;
        this.activeIndex = index;
        this.model.SelectValue = item.id
        this.getPageList(this.model.SelectValue)
      },

      toUpload() {
        let that = this;
        let upLoadIndex = this.$utils.layerOpen({
          title: '上传图片',
          content: $('#editupLoadRoom'),
          width: '1054px',
          height: '750px',
          btn: ['确定'],
          yes() {
            that.uploadSave();
            layer.close(upLoadIndex)
          },
          end() {
            that.imgArr = [];
          }
        })
         this.toUpload.close = function () {
          layer.close(upLoadIndex)
        }
      },

      /**
       *创建上传图片
       */
      crateUpload() {
        let that = this;
        layui.use('upload', function (upload) {
          upload.render({
            method: 'POST',
            elem: ".uploadBtn2",
            url: config.upLoad + '/file/upload-new', //要上传的图片地址
            multiple: true,
            accept: 'images',
            field: 'file',
            auto: true,
            number: 10,
            size: 3072,
            ext: 'jpg|png', //那么，就只会支持这三种格式的上传。注意是用|分割。
            choose: function (obj) {
              var files = obj.pushFile();
              obj.preview(function (index, file, result) { // 预读本地文件
                // console.log(index); //得到文件索引
                // console.log(file); //得到文件对象
                //对上传失败的单个文件重新上传，一般在某个事件中使用
                //obj.upload(index, file);
              });
            },
            done: function (res) {
              if (res.statusCode == 200) { //上传成功返回值，必须为json格式
                if (that.imgArr.length > 10 || that.imgArr.length == 10) {
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

      // 保存上传的图片
      async uploadSave() {
        let that = this
        if (this.imgArr.length == 0) {
          this.$utils.layerMsg.warning('请先上传后再执行“确定”操作')
          return;
        }
        let fileList = [];
        this.imgArr.map(item => {
          fileList.push({
            name: item.name,
            filePath: item.url
          })
        })
        let params = {
          folderId: this.model.SelectValue, // 暂时上传到未分组状态
          fileList
        }
        const res = await fetchJson.post(api.uploadPic, 'data', params);
        if (res.statusCode == 200) {
          this.$utils.layerMsg.success('保存图片成功!');
          layer.close(that.model.upLoadIndex);
          await this.getPageList();
          await this.getGroupLists();
        }

      }
    },
  }
</script>
<style lang="less" scoped>
  @import url('../assets/less/variable.less');
  .nav {
    width: 172px;
    height: 620px;
    background: @color-section-header;

    li {
      height: 80px;
      line-height: 80px;
      padding-left: 35px;
      text-align: left;
      font-weight: bold;

      &.active {
        background: @color-white;
        color: @color-orange;
      }
    }
  }

  .icon_btn_upload {
    float: left;
    width: 100px;
    height: 100px;
    border: 1px dashed @color-border;
    line-height: 100px;
    text-align: center;
    font-size: 30px;
    cursor: pointer;
  }

  .pic_box {
    padding-left: 20px;
    margin-top: 30px;
    width: 862px;
    height: 500px;
    overflow: hidden;

    .item_pic {
      position: relative;
      height: 250px;
      overflow: hidden;
      padding-bottom: 10px;
      float: left;
      margin-left: 30px;

      width: 180px;

      img {
        width: 180px;
        height: 180px;
      }
      i {
        position: absolute;
        display: block;
        top: 149px;
        right: 10px;
        cursor: pointer;
      }
    }

    .pic_name {
      padding: 20px 0 0;
      text-align: left;
    }
  }

  .over_scoll {
    overflow-y: scroll;
  }

  .pager_box {
    padding: 30px;
  }

  .footer {
    height: 80px;
    line-height: 80px;
    position: absolute;
    bottom: 0;
    background: @color-section-header;
    width: 100%;
    input {
      width: 160px;
      height: 40px;
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
      width: 140px;
      height: 140px;
      border: 2px dashed @color-border;
      line-height: 140px;
      text-align: center;
      font-size: 30px;
      cursor: pointer;
    }
  }



  .imgFoot {
    margin-top: 135px;
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
    width: 140px;
    height: 140px;
    float: left;
    border: 1px solid #ddd;
    margin: 0 15px 20px 0;
  }

  .cot {
    width: 850px;
    height: 310px;
    padding-left: 20px;
  }

  .img_upload_title {
    padding: 30px 40px 0px;
    font-size: 16px;
  }

  .upload .layui-layer-btn0 a {
    width: 100px !important;
  }

</style>
