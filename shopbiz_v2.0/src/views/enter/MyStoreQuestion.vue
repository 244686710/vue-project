<template>
  <div class="question">
    <div class="container">
      <h4 class="title">常见问题解答</h4>
      <ul class="items">
        <li class="item clearfix">
          <div class="overf_leftow">
            <i class="icon f_left icon-enter-blue-circle">Q1</i>
            <div class="f_left">
              <h5>开店要收费吗？</h5>
              <div class="overf_leftow">
                <span class="f_left">答：</span>
                <p class="f_left">开店是免费的，不收取任何服务费用。</p>
              </div>
            </div>
          </div>
        </li>
        <li class="item clearfix">
          <div class="overf_leftow">
            <i class="icon f_left icon-enter-blue-circle">Q2</i>
            <div class="f_left">
              <h5>我可以在开多个店吗？</h5>
              <div class="overf_leftow m_content">
                <span class="f_left">答：</span>
                <p class="f_left">不可以，一个身份证只能开一个店铺，不能重复开店。</p>
              </div>
            </div>
          </div>
        </li>
        <li class="item clearfix">
          <div class="overf_leftow">
            <i class="icon f_left icon-enter-blue-circle">Q3</i>
            <div class="f_left">
              <h5>我已经开过店铺，现在想要注销原来的店铺重新开店，可以吗？</h5>
              <div class="overf_leftow m_content">
                <span class="f_left">答：</span>
                <p class="f_left">不可以，暂时不提供注销店铺的服务。一但成功开店就无法再用身份证另开一家店铺。</p>
              </div>
            </div>
          </div>
        </li>
        <li class="item clearfix">
          <div class="overf_leftow">
            <i class="icon f_left icon-enter-blue-circle">Q4</i>
            <div class="f_left ">
              <h5>我在已经开了个店了，我用别人的身份证再开一个店可以吗？</h5>
              <div class="overf_leftow m_content">
                <span class="f_left">答：</span>
                <p class="f_left">如果同一卖家通过同时经营多家有相同商品的店铺，达到重复铺货的目的，这时，商城核查到后，将会对此种开店行为和方式判定为“重复铺货式 开店”卖家被认定为重复铺货式开店的，商城将对其经营的所有店铺中出售的相同商品进行计件处理，判断标准、扣分标准以及处罚标准将参照重 复铺货类的违规执行。</p>
              </div>
            </div>
          </div>
        </li>
        <li class="item clearfix">
          <div class="overf_leftow">
            <i class="icon f_left icon-enter-blue-circle">Q5</i>
            <div class="f_left">
              <h5>什么时候结算？什么时候给我打款？</h5>
              <div class="overf_leftow m_content">
                <span class="f_left">答：</span>
                <p class="f_left">每月5号结算上月完成的订单。跨月未完成订单到下月结算。</p>
              </div>
            </div>
          </div>
        </li>
        <li class="item clearfix">
          <div class="overf_leftow">
            <i class="icon f_left icon-enter-blue-circle">Q6</i>
            <div class="f_left">
              <h5>为什么实际结算金额比完成订单金额少。</h5>
              <div class="overf_leftow m_content">
                <span class="f_left">答：</span>
                <p class="f_left">实际结算金额需要扣除费率比例。具体费率比例见结算管理。</p>
              </div>
            </div>
          </div>
        </li>
        <li class="item clearfix">
          <div class="overf_leftow">
            <i class="icon f_left icon-enter-blue-circle">Q7</i>
            <div class="f_left">
              <h5>我可以修改我的资料吗？</h5>
              <div class="overf_leftow m_content">
                <span class="f_left">答：</span>
                <p class="f_left">可以的。卖家开店以后可随时在结算管理页修改手机号码以及相关店铺信息。但为了资金安全，卖家不能自信修改收款账户信息，如需修改，需提供新的收款账户（包括开户银行、账号、账户名称）以及手持身份证正反面照片（如是对公账号则需提供营业执照及开户许可证盖章扫描件），发送至邮箱： shangcheng@13322.com，工作人员收到邮件在48小时内审核并进行修改，修改完成后回复邮件告知。如提供资料不全，则不能修改。</p>
              </div>
            </div>
          </div>
        </li>
        <li class="item clearfix">
          <div class="overf_leftow">
            <i class="icon f_left icon-enter-blue-circle">Q8</i>
            <div class="f_left">
              <h5>如何查询入驻进度？</h5>
              <div class="overf_leftow m_content">
                <span class="f_left">答：</span>
                <p class="f_left">关于卖家提交的资质信息，我司将在3个工作日内进行审核，卖家可随时登陆并查看审核进度。</p>
              </div>
            </div>
          </div>
        </li>
        <li class="item clearfix">
          <div class="overf_leftow">
            <i class="icon f_left icon-enter-blue-circle">Q9</i>
            <div class="f_left">
              <h5>商城对卖家的发货时间有要求吗？</h5>
              <div class="overf_leftow m_content">
                <span class="f_left">答：</span>
                <p class="f_left">有的。虚拟物品要求24小时内完成发货。实物商品要求三个工作日内完成发货。如未按时发货收到用户投诉，平台有权向卖家发起违约金赔偿。</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StoreQuestion'
};
</script>
<style lang="less" scoped>
@import url("../../assets/less/index.less");
.question {
  // background: @skin-default;
  padding: 10px 0 65px;
  width: 1200px;
  margin: auto;
}
.container {
  background: #fff;
}

.title {
  color: @color-3;
  padding-left: 35px;
  font-size: 24px;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid @color-border;
}

.items {
  padding: 10px 60px 100px;

  .item {
    padding: 20px 0;
    border-bottom: 1px solid @color-border;

    &:last-child {
      border: none;
    }
  }
}
.icon {
  display: block;
  line-height: 20px;
  text-align: center;
  -webkit-text-size-adjust: none;
  font-size: 9px;
  color: #fff;
  margin-right: 20px;
}

h5 {
  font-size: 16px;
  // color: #333;
  padding-bottom: 10px;
}

.m_content {
  color: @color-6;
  line-height: 24px;

  p {
    width: 1000px;
    word-wrap: break-all !important;
  }
}
</style>
