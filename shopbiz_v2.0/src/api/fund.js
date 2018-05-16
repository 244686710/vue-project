export default {
  /* 我的资产 */
  getShopAsset: '/api/shop/shop-asset',

  /* 结算记录列表（未结算和已结算） */
  getShopList: '/api/shop/shop-settle-list',

  //结算凭证
  getSettleVoucher: '/api/shop/shop-settle-voucher',

  //交易明细列表
  getMallTransList: '/api/shop/shop-trans-record',

  //日汇总、月汇总
  getTransSummaryList: '/api/shop/trans-summary',

  //店铺资料（个人、公司）
  getShopInfo: '/api/shop/shop-info',

  //修改店铺资料（个人、公司）
  updateShopInfo: '/api/shop/update-shop-info',

  //短信发送
  sendSms: '/api/sms/send-sms',

  //短信验证
  validateSms: '/api/sms/validate-sms',
  //导出收支详情
  exportTrans: 'api/shop/export-shop-trans-record',

   // 分销记录
   marketlog: 'api/shop/shop-distribution-record',
   // 导出分销记录
   exportMarketLog: 'api/shop/export-shop-distribution-record'
}
