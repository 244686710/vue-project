<template>
  <div class="footer">

      <ul class="text_center footer-link">
        <li class="inline-block" v-for="link in footerLinks" :key="link.key">
          <router-link :to="link.key">{{link.title}}</router-link>
        </li>
        <li class="inline-block"><a href="http://www.yxlsg.com">关于我们</a></li>
        <li class="inline-block"><a href="http://www.huahaileying.com/joinus/recruitment">人才招聘</a></li>
      </ul>
      <ul class="text_center tels">
        <li class="inline-block margin_left20" v-for="tel in tels" :key="tel.val">
          {{tel.name +'：'+ tel.val}}
        </li>

      </ul>

      <div class="copyright container">
        <div class="overflow">
        <div class="fl info">
        Copyright@2016-2028 深圳华海乐盈网络科技有限公司版权所有 丨 粤ICP备15041803号-1
        </div>
        <ul class="fr overflow">
          <li class="fl" v-for="img in imgs" :key="img.key"><a :href="img.href"><img :src="img.url" alt=""/></a></li>
        </ul>
        </div>
        <div class="clear"></div>
      </div>

  </div>
</template>
<script>
export default {
  name: 'StoreFooter',
  data () {
    return {
      footerLinks: [
        {key: '/question', title: '常见问题'},
        {key: '/step', title: '入驻流程'},
        {key: '/info', title: '招商说明'},
        {key: '/create', title: '创建店铺'},
      ],
      tels: [
        {name: '开店咨询', val: '0755-86553588-6608'},
        {name: '市场合作', val: '17744569904 ( 吴女士 )'},
        {name: '商家服务', val: '0755-86553188-6608'},
        {name: '联系邮箱', val: 'shangcheng@13322.com'}
      ],
      imgs: [
        {url: require('../../assets/img/police_05.png'), link: ''},
        {url: require('../../assets/img/police_04.png'), link: ''},
        {url: require('../../assets/img/police_03.png'), link: ''},
        {url: require('../../assets/img/police_02.png'), link: ''},
        {url: require('../../assets/img/police_01.png'), link: ''}
      ]
    }
  }
}
</script>
<style lang="less" scoped>
 @import url('../../assets/less/index.less');
.footer{
  background: @color-3;
  color: @color-9;
  padding: 50px 0 30px;
}
.footer-link a{
  color: @color-white;
}
.footer-link li {
  position: relative;
  padding: 0 28px;

  &:after{
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    height: 16px;
    width: 2px;
    background: #fff;
  }
  &:last-child:after{
    display: none;
  }
}
.tels{
  padding: 30px 0 50px;
  border-bottom: 1px solid #666
}
.copyright{
  // height: 40px;
  line-height: 40px;
  padding-top: 30px;
  .info{
    font-size: 12px;
    color: @color-9;
  }
  li{
    margin-left: 15px;
  }
}
</style>
