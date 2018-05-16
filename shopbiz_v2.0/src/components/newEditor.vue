<template>
  <div class="components-container">
    <div class="editor-container">
      <UE :defaultMsg=defaultMsg :config=config ref="ue" @content='getUEContent'></UE>
    </div>
  </div>
</template>
<style>

</style>
<script>
  import UE from './Ueditor.vue';
  export default {
    name: 'NewEditor',
    components: {UE},
    data () {
      return {
        defaultMsg: '这里是UE测试',
        config: {
          initialFrameWidth: 930,
          initialFrameHeight: 650,
          wordCount: false, // 关闭字数统计
          elementPathEnabled: false, // 关闭元素路径统计
          autoHeightEnabled: false, // 开启滚动条
          toolbars: [[
            'customstyle', // 自定义标题
            'bold',
            'fontfamily', // 字体
            'fontsize', // 字号
            'forecolor', // 字体颜色
            'backcolor', // 背景色
            '|',
            'justifyleft', // 居左对齐
            'justifyright', // 居右对齐
            'justifycenter', // 居中对齐
            'justifyjustify', // 两端对齐
            '|',
            'insertorderedlist',  // 有序列表
            'insertunorderedlist', // 无序列表
            'indent', // 首行缩进
            '|',
            'inserttable', // 插入表格
            'imagedes']]
        }
      }
    },
    methods: {
      getUEContent (msg) {
        let content = msg
      }
    }
  };
</script>
