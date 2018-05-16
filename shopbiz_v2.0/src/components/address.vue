/*
 * @Author: Yuyd
 * @Date: 2018-01-09 17:01:16
 * @Last Modified by: Yuyd
 * @Last Modified time: 2018-01-19 10:27:25
 * 地址库组件
 */

<template>
     <div class="comp-address" :class="{show:isMouseOver}" v-if="show" @mouseover="isMouseOver=true"  @mouseout="isMouseOver=false">
        <div class="title">请选择配送地区：</div>
        <div class="txt">
            <span :class="{active:step==1}" @click="resetLocation(1)">{{selectProvince||"请选择"}}</span>
            <span :class="{active:step==2}" @click="resetLocation(2)">{{selectCity||"请选择"}}</span>
            <span :class="{active:step==3}">{{selectCounty||"请选择"}}</span>
        </div>
        <div class="item_list" :class="{active:step==1}">
            <div class="tiem">
                <div v-for="(item,index) in addrData " :key="index" @click="getCity(item)">{{item.name}}</div>
            </div>
        </div>
        <div class="item_list " :class="{active:step==2}">
            <div class="tiem">
                <div v-for="(item,index) in citys "  :key="index" @click="getCounty(item)">{{item.name}}</div>
            </div>
        </div>
        <div class="item_list " :class="{active:step==3}">
            <div class="tiem">
                <div v-for="(item,index) in countys "  :key="index" @click="confirmLocation(item)">{{item.name}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import fetchJson from '../api/http'
import api from '../api/api';
export default {
  name: "Addr",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      addrData: [],
      step: 1,
      isMouseOver:false,
      citys: [],
      countys: [],
      selectProvince: "",
      selectCity: "",
      selectCounty: ""
    };
  },
  watch: {
    show: function(n, o) {

      this.step = 1;
      this.selectCounty = this.selectCity = this.selectProvince = "";
    }
  },
  computed: {
    provinces() {
      var provinceList = [];
      for (var item in this.addrData) {
        provinceList.push(item);
      }
      return provinceList;
    }
  },
  created() {

  },
  async mounted(){

    const res = await fetchJson.post(api.areaTree, 'params', {})
    if(res.statusCode === '200') {
      this.addrData = res.responseContent
    }

  },
  methods: {
    getCity(item) {
      if (item === undefined) {
        return;
      }
      this.step++;
      this.selectProvince = item.name;
      this.citys = [];
      item.children.map((e,i)=> {
        this.citys.push(e);
      });
    },
    getCounty(item) {
      if (this.selectProvince === undefined || item === undefined) {
        return;
      }
      this.step++;
      this.selectCity = item.name;
      this.countys = item.children;
    },
    confirmLocation(item) {

     this.isMouseOver = false;
      this.$emit(
        "onSelect",
        `${this.selectProvince} ${this.selectCity} ${item.name}`,item.id
      );
    },
    resetLocation(id) {
      if (this.step > id) {
        this.selectCounty = "";
        if (id == 2) {
          this.selectCity = "";
        } else {
          this.selectProvince = "";
          this.selectCity = "";
        }
        this.step = id;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import url('../assets/less/index.less');
.comp-address {
 &.show{
     display: block;
 }
  width: 420px;
  height: 190px;
  border: 1px solid @color-border;
  position: absolute;
  display: none;
  top: 39px;
  left: 45px;
  background: @color-white;
  padding: 15px 20px 20px 20px;
  z-index: 1;
  .title {
    color: @color-6;
    line-height: 20px;
  }
  .txt {
    border-bottom: 1px solid @color-orange;
    margin: 5px 0;
    span {
      height: 30px;
      line-height: 30px;
      width: 130px;
      color: @color-9 !important;
      display: inline-block;
      cursor: pointer;
      &.active {
        color: @color-orange;
      }
    }
  }
  .item_list {
    display: none;
    &.active {
      display: block;
    }
    .tiem {
      height: 30px;
      line-height: 30px;
      color: @color-9 !important;
      div {
        display: inline-block;
        margin-right: 10px;
        cursor: pointer;
        &:hover {
          color: @color-orange;
        }
      }
    }
  }
}
</style>
