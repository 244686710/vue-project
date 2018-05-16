<template>
  <div class="header">
    <div class="container clearfix">
      <div class="brand icon-enter-logo">
      </div>
      <ul class="nav">
        <li v-for="list in navList" class="inline_block" :key="list.key" ><router-link  :to ="{name: list.link}">{{list.title}}</router-link></li>
      </ul>
      <!-- <ul v-show="isCreate" class="header_else">
        <li><span>商家入驻</span></li>
      </ul> -->
      <ul class="f_right user_info f_info">
        <li class="f_left" v-show="isLogin"><img :src="userPic"  alt=""></li>
        <li class="f_left" v-show="isLogin">{{userName}}</li>
        <li class="f_left out_login" v-show="isLogin" @click="outLogin()">退出</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Bus from '../../assets/bus';
import config from '../../config.js'
export default {
  name: 'StoreHeader',
  // props: ['isCreate'],

  data () {
    return {
      isLogin: false,
      userPic: require('../../assets/img/man.png'),
      isCreate:false,
      userName: '',
      navList: [
        {key: 'index', title: '首页', link: 'enterIndex'},
        {key: 'step', title: '入驻流程', link: 'enterStep'},
        {key: 'info', title: '招商说明', link: 'enterInfo'},
        {key: 'question', title: '常见问题', link: 'enterQuestion'}
      ]
    }
  },
  mounted () {
    this.getUserMsg();
    Bus.$on('isLogin', (blone)=> {
      this.isLogin = blone;
    })
  },

  methods: {
    getUserMsg () {
      let msg = JSON.parse(localStorage.getItem('userMsg'));
      if(msg) {
        this.isLogin = true;
        this.userPic = msg.logoUrl||this.userPic ;
        this.userName = msg.mobile
      }
    },
    // 退出登录
    outLogin() {
      this.isLogin = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userMsg');
      window.location.href = config.loginPath;
    }
  }
}
</script>

<style  lang="less" scoped>
  @import url('../../assets/less/index.less');
  .header{
    background: @color-white;
    border-bottom: 2px solid @color-orange;
  }
  .header_else{
    color: #999;
    font-size: 24px;
    margin-left: 10px;
    float: left;
  }
  .brand{
    margin-top: 10px;
    float: left;
    margin-top: 25px;
  }
  .nav{
    float: left;
    padding-left:50px;
  }

  ul li{
    height: 90px;
    line-height: 90px;
    padding: 0 25px;
  }

  ul li a{
    color: @color-6;
    font-size: 16px;

    &:hover{
      color: @color-orange
    }
  }

  .router-link-active{
    color: @color-orange
  }
.user_info li {
  padding:0 0 0 6px;
  // color: @color-6;
  font-size: 12px;
  img {
    width: 26px;
    height: 26px;
    border-radius: 50%;
  }
}
.out_login{
  cursor: pointer;

  &:before {
    content: '';
    display: block;
    float: left;
    width: 2px;
    height: 14px;
    background: #999;
    margin: 38px 20px 0 14px;
  }
}
.out_login:hover {
  color: @color-3
}
</style>
