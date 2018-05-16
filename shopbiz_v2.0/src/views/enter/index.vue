<template>
  <div class="enter">
    <div class="header">
      <StoreHeader v-show="isCreate"></StoreHeader>
    </div>
    <router-view/>
    <StoreFooter></StoreFooter>

  </div>
</template>

<script>
import StoreHeader from './MyStoreHeader'
import StoreFooter from './MyStoreFooter'
export default {
  name: 'store',
  components: {StoreHeader, StoreFooter},
  data (){
    return {
      isCreate: true
    }
  },
  mounted () {
    this.titleShow();
  },
  watch: {
    $route(now, old){
      if(now.meta.noHeader){
       this.isCreate = false;
      }else{
        this.isCreate = true;
      }
    }
  },
  methods: {
    titleShow() {
      if(this.$route.name == 'enterCreate') {
        this.isCreate = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.enter{
  background: #f5f5f5
}
</style>
