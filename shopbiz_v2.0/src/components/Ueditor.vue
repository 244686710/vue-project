<template>
  <div>
    <script id="editor" type="text/plain"></script>
    <img-store ref="upload" :bar="false" @checkedImgs="recieveImg"></img-store>
  </div>
</template>
<script>
  import '../../static/UE/ueditor.config.js'
  import '../../static/UE/ueditor.all.js'
  import '../../static/UE/lang/zh-cn/zh-cn.js'
  import '../../static/UE/ueditor.parse.min.js'
  import ImgStore from './editorImgStore.vue'
  export default {
    name: 'MyEditor',
    components: {
      ImgStore
    },
    data () {
      return {
        editor: null,
        imgs: []
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    watch: {
      'defaultMsg' (now, old) {
        let that = this;
        if (now) {
          setTimeout(() => {
            that.editor.setContent(now)
          }, 600)
        }
      }
    },
    mounted () {
      const _this = this
      // 自定义按钮
      window.UE.plugin.register('imagedes', function () {
        return {
          commands: {
            'imagedes': {
              execCommand: function () {
                // 调用图片管理
                _this.$refs.upload.toCheckPic()
              }
            }
          }
        }
      })
      this.editor = window.UE.getEditor('editor', this.config) // 初始化UE

      this.editor.ready = function () {
        var msg = _this.defaultMsg
        _this.editor.setContent(msg) // 确保UE加载完成后，放入内容。
      }
      this.editor.addListener('blur', function () {
        var content = _this.editor.getContent()
        _this.$emit('content', content)
      })
    },
    methods: {
      getUEContent () { // 获取内容方法
        return this.editor.getContent()
      },
      // 上传模块的图片选中
      recieveImg (data) {
        let that = this
        data.map(item => {
          that.imgs.push(item.filePath)
          that.editor.execCommand('insertimage', [{
            src: item.filePath
          }])
        })
      }
    },
    destroyed () {
      this.editor.destroy();
    }
  }
</script>
<style lang="less" scoped>

</style>
