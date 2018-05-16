export default {
  // 获取用户信息
  getUserMsg: '/api/user/base-info',
  // 开店
  // 获取所有一级分类
  getCategory: '/api/shop/mall-category',
  // 获取银行列表
  getBackList: '/api/shop/bank-info',
  // 获取入驻协议
  getRule: '/api/shop/settle-agreement',
  // 获取入驻进度
  getJoinStep: '/api/shop/latest-audit-info',
  // 获取入驻信息
  getJoinInfo: '/api/shop/settle-agreement',
  // 获取入驻资料
  getJoinMsg: '/api/shop/latest-audit-record-info',
  // 创建店铺
  createShop: '/api/shop/create-shop',
  // 验证店铺名字
  getStoreNames: '/api/shop/name-duplicate',
  // 获取验证码
  getemscode: '/api/shop/send-sms',
  // 验证短信
  testcode: '/api/shop/validate-sms',
  // 发布，更新商品
  saveGoods: '/api/goods/goods-info/save',
  // 保存到仓库
  saveGoodsBuffer: '/api/goods/goods-info/save-off-shelf',
  getGoodsDetial: '/api/goods/goods-info/view',
  // 查询商城分类
  getMallCategoryTree: '/api/goods/goods-category/mall-category-tree',
  // 获取商品列表
  getGoodsList: '/api/goods/goods-info/page-list',
  // 获取商品分类列表
  getCategoryTree: '/api/goods/shop-goods-category/category-tree',
  // 商品批量下架
  batchSolduot: '/api/goods/goods-info/batch-off-shelf',
  // 商品批量删除
  batchDelete: '/api/goods/goods-info/delete-batch',
  // 商品批量上架
  batchputawayStore: '/api/goods/goods-info/batch-on-shelf',
  // 回收站批量上架到商城
  trashPutawayStore: '/api/goods/goods-info/batch-on-shelf-recycle-to-mall',
  // 回收站批量上架到仓库
  trashPutawayBuffer: '/api/goods/goods-info/batch-on-shelf-recycle-to-wh',
  // 批量修改价格
  changePrice: '/api/goods/goods-info/change-price',

  // 删除商品分类
  deleteClass: '/api/goods/shop-goods-category/delete',
  // 批量删除分类
  deleteBatchClass: '/api/goods/shop-goods-category/delete-batch',
  //批量保存分类
  batchSaveClass: '/api/goods/shop-goods-category/save-batch',
  // 关联商城分类
  bindMallClass: '/api/goods/supplier/goods-info/on-shelf-by-shop-cat-mall-cat-mapping',

  /**
   * 订单管理
   */
  // 订单列表
  orderList: '/api/order/page-list',
  // 订单导出
  orderExport: '/api/order/export-order-list',
  // 订单详情
  orderDetial: '/api/order/detail',
  // 订单评价列表
  orderEstimate: '/api/order/comment/page-list',
  // 订单物流详情
  orderDeliveryDetial: 'api/order/delivery-track',
  // 发货
  orderSend: '/api/order/deliver-goods',
  deliveryList: '/api/order/delivery-company',
  // 改运费
  orderChangeDelivery: '/api/order/update-delivery-amount',
  // 回复评价
  orderReplyEstimate: '/api/order/comment-reply',
  // 订单设置
  orderSet: '/api/order/invoice-enable',
  // 获取订单设置状态
  orderSetDefault: '/api/order/invoice-flag',

  /**
   * vip
   */
  getVipList: '/api/user/list',
  exportVipList: '/api/user/export-member-list',

  /**
   * 运费模板 freight
   */
  // 获取运费模板列表
  getFreightList: '/api/goods/shop-freight-template/page-list',
  // 删除运费模板
  deletFreight: '/api/goods/shop-freight-template/delete',
  // 查看运费模板
  seeFreight: '/api/goods/shop-freight-template/view',
  // 运费模板新增/修改
  addFreight: '/api/goods/shop-freight-template/save',
  // 区域信息-树形结构
  areaTree: '/api/goods/area/all-area-tree',
  // 运费模板是否启用
  getFreightSwitch: '/api/goods/shop-freight-template/get-freight-template-enabled-flag',
  // 启用/停用运费模板
  switchFreight: '/api/goods/shop-freight-template/update-freight-template-enabled-flag',

  /**
   * 店铺素材管理
   */
  //图片分组列表
  picGroupList: '/api/shop/file/folder-list',
  // 添加分组
  picAddGroup: '/api/shop/file/add-folder',
  // 删除分组
  picDeleteGroup: '/api/shop/file/delete-folder',
  // rename
  picRenameGroup: '/api/shop/file/update-folder',
  // pageList
  picPageList: '/api/shop/file/page-list',
  // 添加图片
  uploadPic: '/api/shop/file/save',
  // 删除图片
  deletePic: '/api/shop/file/delete-file',
  // 移动图片
  movePic: '/api/shop/file/move-file',
  // 店铺设置
  getStoreMsg: '/api/shop/shop-info',
  //保存店铺资料
  saveStoreMsg: '/api/shop/update-shop-info',
  //店铺是否开通VIP免支付-马玲-v4新增
  shopVipFlag:'/api/shop/shop-vip-flag'
}
