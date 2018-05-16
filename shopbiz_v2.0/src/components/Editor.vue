<template>
  <div>
    <img-store ref="upload" :bar="false" @checkedImgs=recieveImg></img-store>
    <quill-editor ref="myTextEditor"
      v-model="content"
      :options="editorOption"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @blur="onEditorBlur($event)"
      @change="onEditorChange($event)"
      >
    </quill-editor>
  </div>
</template>
<script>
import Quill from 'quill'
import { quillEditor } from 'vue-quill-editor'
 import ImgStore from './editorimgStore.vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
  export default {
    name:'Editor',
    props: ['value'],
    components: {
      quillEditor,
      ImgStore
    },
    data() {
      return {
        imgs: [],
        editor: '',
        content: '',
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{'header': 1}, {'header': 2}],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{'indent': '-1'}, {'indent': '+1'}],
              [{'header': [1, 2, 3, 4, 5, 6, false]}],
              [{'font': []}],
              [{'color': []}, {'background': []}],
              [{'align': []}],
              ['image']
            ],
          }
        },
      }
    },
    watch: {
      value (now, old) {
        this.content = now
      }
    },
    mounted () {
       // this.$refs.editor
      var vm =this
      const imgHandler = async function(state) {
        if (state) {
          vm.$refs.upload.toCheckPic();
          //button is clicked
        }
      }
      vm.$refs.myTextEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
    },
    methods: {
      /**
       *富文本编辑器
       *
      */
      onEditorFocus(editor) {
        this.editor = editor   //当content获取到焦点的时候就 存储editor
      },
      onEditorReady(editor) {
        this.editor = editor //当quill实例化完先 存储editor
      },
      onEditorBlur(quill) {
      },

       // 编辑器文本发生变化
      onEditorChange({ editor, html, text }) {
        // let textLength = text.length
        // if (textLength > 10000) {
        // editor.enable(false)
        // }
        this.$emit('getValue', this.content)
      },

      // 上传模块的图片选中
      recieveImg (data) {
        this.imgs = [];
        let vm = this;
        let that = this;
        data.map(item => {
          that.imgs.push(item.filePath)
        });
        let contentLength = this.content.length;
        vm.addImgRange = vm.$refs.myTextEditor.quill.getSelection()
        that.imgs.map(value => {
          vm.$refs.myTextEditor.quill.insertEmbed(vm.addImgRange != null?vm.addImgRange.index:contentLength, 'image', value, Quill.sources.USER)

        })
      }
    }


  }

</script>

<style lang="less" scoped>
.quill-editor{
  height: 730px;
}
</style>
