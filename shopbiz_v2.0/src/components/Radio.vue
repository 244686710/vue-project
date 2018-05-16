<template>
  <div>
    <div class="layui-unselect layui-form-radio"
     v-for="item in options" @click="changeRadio(item)"
     :Key="item.key"
     :class="{'layui-form-radioed':currentValue.Value==item.Value, 'is_disabled': disabled == true}" >
      <i class="icon-radio-blue-default" :class="{'icon-radio-blue-checked':currentValue.Value==item.Value}"></i>
      <span>{{item.Text}}</span><i class="radio_info">{{item.info}}</i>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Radio',
    props: ['value', 'options', 'disabled'],
    data () {
      return {
        currentValue: {
          Text: '',
          Value: null
        }
      }
    },
    created () {
      let self = this
      self.options.forEach(item => {
        if (item.Value == self.value) {
          self.currentValue = {
            Text: item.Text,
            Value: item.Value
          }
        }
      })
    },
    watch: {
      'value' (newVal, oldVal) {
         this.currentValue.Value = newVal||0;
      }
    },
    methods: {
      changeRadio (item) {
        if(this.disabled) return;
        this.currentValue = {
          Text: item.Text,
          Value: item.Value
        }
        this.$emit('input', item.Value);
      }
    }
  }
</script>

<style lang="less" scoped>
.radio_info{
    color: #999;
    font-size: 12px;
  }

  .is_disabled{
    cursor: default !important;
    color: #999
  }
</style>

