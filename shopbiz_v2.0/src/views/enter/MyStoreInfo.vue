<template>
  <div>
    <div class="info" style="background: #fff">
      <div class="banner">
        <div class="container">
          <h3>
            <span>合作招商</span>
          </h3>
          <p class="banner-info">cooperation and Investment</p>
          <a href="javascript:;" class="btn btn-jion" @click="toCreateStore()">立即入驻</a>
        </div>
      </div>

      <div class="container">
        <ul class="f-16 info-msg">
          <li>拼太良作为中国品质综合类电商平台，为了更好的服务于广大消费者，特面向国内招募优秀的商家 </li>
          <li>入驻商家需具备完善的个人/公司主体，有成熟的网店运营经验，拥有良好的信誉及经营状状况</li>
          <li>招商品类：
            <span class="strong">运动户外、家居个护、数码家电、美容彩妆</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Bus from '../../assets/bus';
import api from '../../api/api';
import fetchJson from '../../api/http';
  export default {
    name: 'StoreInfo',
    methods: {
      async toCreateStore() {
        if (localStorage.getItem('userMsg')) {
          // 获取入驻进度
          const res = await fetchJson.post(api.getJoinStep, 'params', {});
          if (res.statusCode == 200) {
            switch (res.responseContent.auditStatus) {
              case 0:
                Bus.$emit('enterStep', 0)
                this.$router.push({
                  name: 'enterCreate'
                })
                break;
              case 1:
                Bus.$emit('enterStep', 1)
                this.$router.push({
                  name: 'enterCreate'
                })
                break;
              case 2:
                Bus.$emit('enterStep', 2)
                this.$router.push({
                  name: 'enterCreate'
                })

                break;
              default:
                this.$emit('message', true)
                this.$router.push({
                  name: 'enterCreate'
                })
            }
          }
        } else {
          this.$utils.layerMsg.warning('请先登录！')
        }

      }
    }
  }

</script>
<style lang="less" scoped>
  @import url('../../assets/less/index.less');
  .banner {
    height: 500px;
    width: 100%;
    background: url('../../assets/img/enter/store-info-bg.jpg')center center no-repeat;
    background-size: cover;

    h3 {
      padding-top: 90px;
      font-size: 60px;
      color: @color-white;
      font-weight: 500;
      text-align: center;
      line-height: 100px;
    }

    .banner-info {
      font-size: 30px;
      text-align: center;
      color: @color-white;
      padding-top: 10px;
    }

    .btn-jion {
      position: relative;
      display: block;
      margin: 70px auto 0;
      color: @color-white;
      width: 280px;
      padding-right: 10px;
      height: 58px;
      line-height: 58px;
      text-align: center;
      font-size: 24px;
      background: @color-orange;

      &:hover {
        background: @color-orange-hover
      }

      &:after {
        content: '';
        display: block;
        position: absolute;
        top: 22px;
        right: 72px;
        width: 0;
        height: 0;
        border: 8px solid transparent;
        border-left: 10px solid @color-white;
      }
    }
  }

  .info-msg {
    padding: 30px 0 80px;
    line-height: 2;
    color: @color-6;

    li:before {
      content: '';
      display: block;
      float: left;
      width: 4px;
      height: 4px;
      border-radius: 2px;
      background: @color-6;
      margin: 14px 10px 0 0;
    }
  }

</style>
