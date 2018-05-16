export default {
  // 分销商品接口api
  // 可分销供应商商品列表
  goodsMarketList: '/api/goods/supplier/goods-info/page-list',
  // 分销商品变更记录
  goodsMarketChangeList: '/api/goods/supplier/goods-info/change-info-page-list',
  // 分销商品上架到店铺
  putAwaySupplier: '/api/goods/supplier/goods-info/on-shelf',
  // 分销商品上架到仓库
  putAwayBufSupplier: '/api/goods/supplier/goods-info/on-shelf-to-wh',
  // 分销商品详情
  goodsDetial: '/api/goods/supplier/goods-info/view',
  // 分销商品详情-地区信息
  areaTree: '/api/goods/area/all-area-tree',
  // 分销商品详情 -获取商品SKU
  getGoodsSku: '/api/goods/supplier/goods-info/goods-sku',
  getGoodsDefaultSku: '/api/goods/supplier/goods-info/get-default-sku',
  // 根据属性获取商品SKU
  getSkuByAttr: '/api/goods/supplier/goods-info/goods-sku-by-attr',
  // 运费计算
  deliveryPriceCount: '/api/goods/supplier/goods-info/goods-delivery-fee',

  //分销商品编辑，查看
  supplierGoodsEdit: '/api/goods/goods-info/supplier/edit',
  // 分销商品保存
  supplierGoodsSave: '/api/goods/goods-info/supplier/save',
  // 分销商品保存并下架
  supplierGoodsSaveOffline: '/api/goods/goods-info/supplier/save-off-shelf'
}
