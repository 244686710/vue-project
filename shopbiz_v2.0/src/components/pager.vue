<template>
  <div class="comp-pager">
    <div v-if="options.total !=0">
      <div class="f_left">
        <span>共{{options.total}}条记录/每页{{options.limit}}条</span>
      </div>
      <div class="f_right">
        <input type="button" class="btn_white_grey prev border" :class="{active: options.offset>1}" value="<<上一页" @click="prev(options.offset)">
        <input type="button" class="btn_white_grey next border" :class="{active: options.offset<pages}" value="下一页>>" @click="next(options.offset)">
        <span>{{options.offset}}/{{getTotalPages(options.total, options.limit)}}页</span>&nbsp;&nbsp;&nbsp;
        <span>到第</span>
        <input type="text" v-model="inputPageIndex" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')">
        <span>页</span>&nbsp;&nbsp;
        <input type="button" class="btn_white_grey btn_confirm border" value="确定" @click="getConfirm(inputPageIndex)">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "pager",
    props: [
      'options',
    ],
    data () {
      return {
        offsetIndex: 1,
        inputPageIndex: 1,
        pages: 0
      };
    },
    watch: {
      'options.offset': function (curValue, newValue) {
        this.offsetIndex = curValue;
      }
    },
    mounted: function () {
      this.offsetIndex = this.options.offset;
    },
    methods: {
      /**
       * 计算总页数
       * @param {Object} total
       * @param {Object} limit
       */
      getTotalPages: function (total, limit) {
        var pageSum = 0;
        if (total >= 0 && limit > 0) {
          pageSum = (total % limit > 0) ? (parseInt(total / limit) + 1) : (total / limit)
        }
        this.pages = pageSum;
        return pageSum;
      },
      prev: function (page) {
        if (this.offsetIndex == 1) {
          layer.msg('已经为第一页', {
            icon: 0
          });
          return false;
        }
        this.offsetIndex = this.offsetIndex - 1;
        this.$emit("changePagerNum", this.offsetIndex);
      },
      next: function (page) {
        if (this.offsetIndex == this.pages) {
          layer.msg('已经为最后一页', {
            icon: 0
          });
          return false;
        }
        this.offsetIndex = this.offsetIndex + 1;
        this.$emit("changePagerNum", this.offsetIndex);
      },
      getConfirm: function (inputPageIndex) {
        if (inputPageIndex > this.pages) {
          layer.msg('请输入正确的页码', {
            icon: 2
          });
          return
        }
        this.offsetIndex = parseInt(this.inputPageIndex)
        this.$emit("changePagerNum", this.offsetIndex);
      }
    }
  };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import url('../assets/less/variable.less');
  .border {
    border: 1px solid @color-border
  }

  .comp-pager {
    width: 100%;
    font-size: @font-14;
    color: @color-9;
    line-height: 30px;
    .f_left {
      span {}
    }
    .f_right {
      input {
        height: 26px;

        &.active {
          color: @color-white;
          background: @color-orange;
          border: 1px solid @color-orange;
          cursor: pointer;
        }
        &.active:hover{
          background: @color-orange-hover;
        }
      }
      input.prev,
      input.next {
        width: 76px;
        height: 26px;
      }
      input.prev {
        margin-left: 30px;
        border-right: 0px;
      }
      input.next {
        margin-right: 6px;
      }
      input[type="text"] {
        text-align: center;
        color: @color-6;
        width: 46px;
        margin: 0 5px 0 4px;
        height: 25px;
        border: 1px solid @color-border;
      }
      .btn_confirm {
        width: 66px;
        color: @color-6;
      }
    }
  }

</style>
