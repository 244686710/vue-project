<!--
     标题：头部导航条
	作者：273714068@qq.com
	时间：2017-11-14
-->
<template>
  <div class="appheader">
    <div class="sj_head">
      <div class="sj_logo">
        <a href="/">
          <img  src="../assets/img/brand.png" style="height: 60px; margin-top:-10px; margin-left:-40px" alt="">

        </a>
      </div>
      <div class="sj_login">
        <div class="sj_login_yes">
          <i v-show="!pic"></i>
          <img v-show="pic" :src="pic" alt="" width="25px" height="25px">
          <a href="javascript:void(0)">{{name}}</a>
          <span class="f_green"></span>
          <a href="javascript:void(0)" @click="logOut()">[退出登录]</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import api from "../api/";
  import config from '../config.js'
  import md5 from 'js-md5'
  export default {
    name: 'appheader',
    props: ['user'],
    data() {
      return {
        name: this.user.userName,
        pic: this.user.userPic,
      }
    },
    created: function () {
      this.getUserMsg()
    },
    watch: {
      user (now, old) {
        this.name = now.userName;
        this.pic = now.userPic
      }
    },
    methods: {
      getUserMsg() {
        const msg = JSON.parse(localStorage.getItem('userMsg'));
        if (msg) {
          this.name = msg.mobile;
          this.pic = msg.logoUrl;
        }
      },
      /**
       * 退出
       */
      logOut: function () {
        var self = this
        layer.msg('退出成功!', {
          icon: 1,
          time: 1000 //2秒关闭（如果不配置，默认是3秒）
        }, function () {
          localStorage.removeItem("token");
          localStorage.removeItem('userMsg');
          window.location.href = config.loginPath;
        });

      }
    }
  }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
   @import url('../assets/less/variable.less');
  /*公共头部*/

  .appheader {
    height: 70px;
    .sj_head {
      height: 70px;
      position: fixed;
      background: @color-orange;
      width: 100%;
      z-index: 1000;
      .sj_logo {
        position: absolute;
        overflow: hidden;
        width: 106px;
        height: 16px;
        padding: 14px 47px 40px 47px;
        background: @color-nav-select;
      }
      .sj_login {
        position: absolute;
        right: 20px;
        top: 20px;
        .sj_login_yes {
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          padding-right: 20px;
          img{
            border-radius: 25px;
          }
          i {
            display: inline-block;
            width: 22px;
            height: 22px;
            background: url(../assets/img/head_show.png) no-repeat;
            vertical-align: middle;
          }
          a {
            display: inline-block;
            vertical-align: middle;
            color: @color-white;
            font-size: 14px;
            margin-left: 6px;
          }
          a:last-child {
            margin-left: 58px;
          }
        }
      }
    }
  }

</style>
