<template>
  <div class="checkbox-box" @click="changeCheckd">
    <i class="icon-checkbox-default" :class="{'icon-checkbox-checked': this.currentValue, 'disabled': isDisabled}"></i>
  </div>
</template>
<script>
  export default {
    name: 'Checkbox',
    props: ['value', 'isDisabled'],
    data () {
      return {
        selectShow: false,
        currentValue: this.value
      }
    },
    created () {},
    methods: {
      changeCheckd () {
        if(this.isDisabled){
          return;
        }
        this.currentValue = !this.currentValue;
        this.$emit('input', this.currentValue);
      },

      toChecked (value) {
        this.currentValue = value;
        this.$emit('input', this.currentValue);
      }
    },
    watch: {
      //监听 value变化更改this.currentValue;
      'value' (newVal, oldVal) {
        this.currentValue = newVal;
      }
    }

  }
</script>

<style lang="less" scoped>
.checkbox-box {
  float: left;
  height: 18px;
  line-height: 18px;
  // margin-right: 10px;
  padding-right: 16px;
  margin-top: 2px;
  width: 18px;
  i{
    display: inline-block
  }
}

.disabled{
  background: #eee;
}

</style>

