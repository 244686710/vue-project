<template>
  <div class="layui-unselect layui-form-select" :class="{'layui-form-selected':selectShow}">
    <div class="layui-select-title">
      <img class="icon_bank" v-show="!currentValue.Src && imgSrc" :src="imgSrc" alt="">
      <img class="icon_bank icon_1" v-show="currentValue.Src" :src="currentValue.Src" alt="">
      <input type="text" placeholder="请选择" @click="changeSelect" :class="{'padding_left50': currentValue.Src || imgSrc}" v-bind:style="{ height: options.size.h, lineHeight: options.size.h, width: options.size.w }"
       readonly :value="currentValue.Text" class="layui-input layui-unselect">
      <i class="layui-edge"></i>
    </div>
    <dl class="layui-anim layui-anim-upbit text_left" v-show="selectShow" v-bind:style="{ top: options.size.h}">
      <dd v-for="item in options.selectOptions" :key="item.id" :class="{'layui-this':currentValue.Value==item.Value}" @click="currentSelect(item)" value="item.Value"><img v-show="item.Src" :src="item.Src" alt="">&nbsp;&nbsp;&nbsp;{{item.Text}}</dd>
    </dl>
  </div>
</template>
<script>
  export default {
    props: ['value', 'options', 'imgSrc'],
    name: 'MySelect',
    data () {
      return {
        bankSrc: '',
        selectShow: false,
        currentValue: {
          Text: '',
          Value: null,
          Src: ''
        }
      }
    },
    created () {
      let self = this
      self.options.selectOptions.forEach(item => {
        if (item.Value == self.value) {
          self.currentValue = {
            Text: item.Text,
            Value: item.Value,
            Src: item.Scr
          }
        }
      })
    },

    watch: {
      'value' (now) {
        let that = this;
        // this.currentValue =
        this.options.selectOptions.map(item => {
          if(item.Value == now){
            that.currentValue = item;
          }
          that.currentValue=Object.assign({}, that.currentValue)
        })
      },
      'options' () {
        let that = this;
         this.options.selectOptions.map(item => {
          if(item.Value == this.value){
            that.currentValue = item;

          }
        })
      }
    },

    methods: {
      resetDate(){
        let self = this
        self.currentValue = self.options.selectOptions[0]
      },

      currentSelect (item) {
        let self = this;
        self.currentValue = item
        this.changeSelect();
        this.$emit('input', item.Value);
      },
      changeSelect () {
        this.selectShow = !this.selectShow;
      },
    }
  }
</script>
<style lang="less" scoped>
// @import url('../assets/less/index.less');
.layui-form-select dl dd.layui-this {
  background: #FA8C64
}
.layui-form-select dl dd, .layui-form-select dl dt {
    line-height: 28px;
}
img{
  width: 25px;
  height: 25px;
}
.padding_left50{
  padding-left:50px;
}
.layui-select-title{
  position: relative;
  .icon_bank {
    position: absolute;
    left:12px;
    width: 28px;
    height: 28px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

