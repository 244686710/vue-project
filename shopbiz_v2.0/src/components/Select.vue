<template>
  <div class="layui-unselect layui-form-select" :class="{'layui-form-selected':selectShow}">
    <div class="layui-select-title">
      <input type="text" placeholder="请选择" @click.stop="changeSelect" v-bind:style="{ height: options.size.h, width: options.size.w }"
       readonly :value="currentValue.Text" class="layui-input layui-unselect">
      <i class="layui-edge"></i>
    </div>
    <dl class="layui-anim layui-anim-upbit" v-show="selectShow" v-bind:style="{ top: options.size.h}" >
      <dd v-for="item in options.selectOptions" :key="item.id" :class="{'layui-this':currentValue.Value==item.Value}" @click="currentSelect(item)" value="item.Value">{{item.Text}}</dd>
    </dl>
  </div>
</template>
<script>
  export default {
    props: ['value', 'options'],
    name: 'MySelect',
    data () {
      return {
        selectShow: false,
        currentValue: {
          Text: '',
          Value: null,
        }
      }
    },
    created () {
      let self = this
      self.options.selectOptions.forEach(item => {
        if (item.Value == self.value) {
          self.currentValue = {
            Text: item.Text,
            Value: item.Value
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
      offSelect() {
        this.selectShow =false
      },
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
        this.selectShow = !this.selectShow
      }
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
</style>

