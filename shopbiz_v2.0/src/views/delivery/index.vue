<template>
  <div>
    <div class="title">运费模板</div>
    <div class="section_b padding20">
      <h4 class="f_bold f_point">运费模板功能</h4>
      <p class="f_label padding_top10">启用后，卖家可依据商品重量/件数与配送地域不同设置不同的运费计算方式。
        <a href="javascript:;" class="handle" @click="seeRule()">运费计算规则</a>
      </p>

      <div class="switch f_right">
        <a href="javascript:;" :class="{active: switchType == 1}" @click="switchTypeChange(1)">启用</a>
        <a href="javascript:;" :class="{active: switchType == 0}" @click="switchTypeChange(0)">未启用</a>
      </div>
    </div>

    <div class="section_b btn_box">
      <input type="button" @click="toEdit(0)" class="btn_add" value="+新建运费模板">
    </div>

    <div class="section_b" v-for="(list, index) in dataLists" :key="`list${index} `">
      <h4 class="panel_title font_12 ">
        <span class="f_point">{{list.tplName}}</span>
        <span class="f_right">
          <span class="f_label">最后编辑时间：
            <i>{{list.updateTime}}</i>
          </span>
          <a href="javascript:;" class="handle" @click="toEdit(list.id)">编辑</a>
          <a href="javascript:;" class="handle last" @click="deleteItem(list.id)">删除</a>
          <i class="icon_arrow" :class="{open: index == showNum}" @click="seeDetial(index, list.id)"></i>
        </span>
        </span>
      </h4>
      <div v-show="index == showNum" class="">
        <table class="layui-table" lay-skin="line">
          <thead v-show="list.feeType == 1">
            <tr>
              <th style="width: 400px">可配送区域</th>
              <th>首件（个）</th>
              <th>运费（元）</th>
              <th>续件（个）</th>
              <th>续费（元）</th>
            </tr>
          </thead>
          <thead v-show="list.feeType == 2">
            <tr>
              <th style="width: 400px">可配送区域</th>
              <th>首重（kg）</th>
              <th>运费（元）</th>
              <th>续重（kg）</th>
              <th>续费（元）</th>
            </tr>
          </thead>
          <tbody class="f_info">
            <tr v-for="(item, index) in list.content" :key="`feightDetial${list.id}-${item.id}`">
              <td>
                <div style="width=400px">
                  <span v-for="(area, index) in item.areaList" :key="area.id">{{area.name}}
                    <i v-show="index !== item.areaList.length-1">，</i>
                  </span>
                </div>
              </td>
              <td>{{item.firstWeight}}</td>
              <td>{{item.firstPrice}}</td>
              <td>{{item.continueWeight}}</td>
              <td>{{item.continuePrice}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pager clearfix">
      <pager class="f_right page_box" :options="pageInfo" @changePagerNum="recievePage"></pager>
      <div v-show="pageInfo.total == 0" class="text_center">当前没有任何数据</div>
    </div>

    <div class="dialog_rule hide" id="dialog">
      <h3 class="f_point">一、运费模板与商品关联 </h3>
      <ul class="f_info">

        <li class="clearfix"><span class="f_left">1、</span><p class="f_left item_content">商品关联设置：每件商品，仅可设置一种运费收取方式，即：统一运费，或指定运费模板；</p></li>
        <li class="clearfix"><span class="f_left">2、</span><p class="f_left item_content">统一运费：按商品一次计收运费；如，统一运费10元，买家单笔订单购买n件，均只收取10元运费；</p></li>
        <li class="clearfix"><span class="f_left">3、</span><p class="f_left item_content">运费模板：选择相应的运费模板，即可指定该商品，可配送至相应区域，并按规则收取相应运费；</p></li>
      </ul>
      <h3 class="f_point">二、运费模板计算规则  </h3>
      <ul>
        <li class="clearfix"><span class="f_left">1、</span><p class="f_left item_content">当商品订单均使用同一运费模板时，则依据运费模板设定规则进行常规计算</p></li>
        <li class="clearfix"><span class="f_left">2、</span>
          <p class="f_left item_content">当存在多商品订单中使用不同运费模板时：先将所有商品分别使用统一运费和运费模板的运费规则计算，再取二者较大的值，作为最终运费。</p>
          <ol class="padding_left40">
            <li>1）计算使用运费模板的运费价格x：</li>
            <p class="indent">取所有商品中，首件/首重金额最大的运费模板，计算使用该模板的所有商品运费

               使用其他模板的所有商品都按照该商品所试用的续件/续重金额来计算</p>
          </ol>
          <ol class="padding_left40">
            <li>2）运费取最大值：</li>
            <p class="indent">计算所有商品使用统一运费的最大值得到的商品运费y<br>

             比较x和y，运费=x和y的较大值</p>
          </ol>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import fetchJson from "../../api/http";
  import api from "../../api/api";
  export default {
    name: 'DeliveryIndex',
    data() {
      return {
        dataLists: [], // 运费模板列表
        showNum: 0, // 默认显示第一个
        switchType: 0, // 开关默认状态 0,关闭 1 启用
        pageInfo: {
          total: 0,
          offset: 1,
          limit: 20
        }
      }

    },

    mounted() {
      this.getFeightLists();
      this.readFeightUseType()
    },
    methods: {

      /**
       * 新建、编辑 运费模板
       * @param {String} id
       */
      toEdit(id) {
        this.$router.push({
          name: 'deliveryEdit',
          query: {
            id: id
          }
        })
      },

      /**
       * 分页
       * @param {Number} msg
       */
      recievePage (msg) {
        this.pageInfo.offset = msg;
        this.getFeightLists();
      },
      // 查询模板开启状态
      async readFeightUseType () {
        const res = await fetchJson.post(api.getFreightSwitch, 'params', {})
        if(res.statusCode == 200) {
          this.switchType = res.responseContent
        }
      },

      // 获取运费模板列表
      async getFeightLists() {
        let loading = layer.load(2)
        let that = this;
        const res = await fetchJson.post(api.getFreightList, 'params', {
          offset: this.pageInfo.offset,
          limit: this.pageInfo.limit
        })
        layer.close(loading);
        if (res.statusCode == 200) {
          that.dataLists = res.responseContent.list;
          that.pageInfo.total = res.responseContent.total;
          if (that.dataLists.length === 0) return;
          let id = that.dataLists[0].id
          const content = await that.getFeightDetial(id);
          that.dataLists[0].content = content;

          that.dataLists= Object.assign([], that.dataLists)
        }
      },

      /**
       * 获取运费模板详情
       * @param {String} id 模板id
       */
      async getFeightDetial (id) {
        const res = await fetchJson.post(api.seeFreight, 'params', {id})
        if(res.statusCode == 200) {
          return res.responseContent.shopFreightPriceSchemaVOList
        }else {
          return false;
        }
      },

      /**
       * 查看某模板详情
       * @param {Number} index
       * @param {String} id  模板id
       */
      async seeDetial (index, id) {
        if(this.showNum == index){
          this.showNum = -1;
          return ;
        }
        this.showNum = index;

        const res = await this.getFeightDetial(id);
        if(res) {
          this.$set(this.dataLists[index], 'content', res)
          // this.detaLists[index] = Object.assign({}, this.dataLists[index])
        }
      },

      /**
       * 是否启用运费模板
       * @param {Number} type
       */
      async switchTypeChange (type) {
        let that = this;
        if(this.switchType == type) return;
        const res =await fetchJson.post(api.switchFreight, 'params', {enabledFlag: type});
        if(res.statusCode == 200) {
          this.switchType = type;
          that.$utils.layerMsg.success('操作成功！')
        }
      },

      // 查看规则
      seeRule () {
        this.$utils.layerOpen({
          height: '480px',
          width: '600px',
          content: $('#dialog')
        })
      },

      /**
       * 删除模板
       *@param {String} id
       */
      deleteItem (id){
        let that = this;
        let dialog = layer.confirm('确认删除该运费模板？', {
          title: "删除",
          btn: ['确 定', '取 消'], // 按钮
          area: ['600px', '265px'],
        }, async function () {
          //执行删除操作
          layer.close(dialog);
          const res = await fetchJson.post(api.deletFreight, 'params', {id})
          if(res.statusCode == 200) {
            that.$utils.layerMsg.success('删除成功！')
            that.getFeightLists()
          }

        }, function (dialog) {
          // 执行取消操作
          window.layer.close(dialog);
        });
      }
    }
  }

</script>

<style lang="less" scoped>
  @import url('../../assets/less/index.less');

  .section_b {
    position: relative
  }
  .padding_top10{padding-top: 10px;}
  .panel_title {
    background: #f8f8f8;
    border: 1px solid @color-border;
    height: 40px;
    line-height: 40px;
    padding-left: 30px;
    .f_label {
      margin-right: 30px;
    }
    .last {
      display: inline-block;
      position: relative;
      margin-right: 30px;

      &:before {
        content: '';
        display: block;
        margin: 14px 10px 0;
        float: left;
        height: 12px;
        width: 2px;
        background: @color-c
      }
    }
  }

  .switch {
    position: absolute;
    z-index: 1;
    right: 20px;
    top: 30px;
    width: 150px;
    height: 30px;
    a {
      box-sizing: border-box;
      float: left;
      text-align: center;
      width: 70px;
      height: 30px;
      line-height: 30px;
      background: @color-bg;
      color: @color-9;
      border: 1px solid @color-border;
      &.active {
        color: @color-white;
        border: 1px solid @color-orange;
        background: @color-orange
      }
    }
  }

  .setion_b .layui-table td,
  .layui-table th {
    padding: 15px;
  }

  .padding20 {
    padding: 20px;
  }

  .icon_arrow {
    float: right;
    margin: 8px 20px 0 0 !important;
    display: block;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-bottom: 10px solid @color-6;
    cursor: pointer;
    transition: all .5s;

    &.open {
      transform: rotate(180deg);
      -ms-transform: rotate(180deg);
      /* IE 9 */
      -moz-transform: rotate(180deg);
      /* Firefox */
      -webkit-transform: rotate(180deg);
      /* Safari 和 Chrome */
      -o-transform: rotate(180deg);
      margin-top: 14px !important;
    }
  }

  .btn_box {
    height: 70px !important;
    padding-left: 20px;
  }

  .btn_add {
    margin-top: 16px;
    background: @color-orange;
    .btn_light_orange;
    height: 36px;
    width: 120px;
    cursor: pointer;
  }
.layui-table td, .layui-table th {
  padding: 15px 30px;
}

.dialog_rule {
  padding:10px 25px 0px;
  text-align: left;
  line-height: 30px;

  .item_content {
    width: 516px;
  }
}
.indent{
  text-indent: 2em;
}
.padding_left40{
  padding-left: 20px;
}
</style>
