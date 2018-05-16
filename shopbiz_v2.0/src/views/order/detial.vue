<template>
    <div>
        <div class="title_crumbs">
            <router-link class="link" :to="{path: '/order', query:{isCache: true}}">订单管理</router-link> > 订单详情
        </div>
        <div class="main detial">
            <div class="m_panel panel_1">
                <h4 class="m_panel_title">订单概况</h4>
                <div class="m_panel_content">
                    <ul class="f_left">
                        <li>
                            <label for=""> 订单编号：</label>
                            <span class="f_info">{{detialMsg.orderNo || '--'}}</span>
                        </li>
                        <li>
                            <label for=""> 支付方式：</label>
                            <span class="f_info">{{detialMsg.payType | payType}}</span>
                        </li>
                        <li>
                            <label for=""> 实付金额：</label>
                            <span class="f_orange">{{detialMsg.orderAmt | currency}}</span>
                        </li>
                        <li class="clearfix">
                            <label for="" class="f_left"> 订单状态：</label>
                            <span class="f_info f_left">{{detialMsg.statusDesc||"--"}}</span>
                            <a v-if="detialMsg.status == 4 && detialMsg.commentFlag == 1" class="handle" href="javascript:;" @click='toEstimateDetial(detialMsg.id)'>&nbsp;&nbsp;&nbsp;查看评价 > </a>
                            <input style="margin-top: 5px" v-show="detialMsg.status == 2&& detialMsg.supplierId<1&&detialMsg.payType!=5" type="button" class="w80 btn_light_orange margin_left20 f_left" value="发货" @click="send(detialMsg.id, detialMsg.sendType)">
                            <br>
                            <p v-if="detialMsg.status == 5" class="c_error tip"><label for=""></label>{{detialMsg.cancelTypeDesc}}</p>
                            <p class="c_error tip" v-show="detialMsg.paymentCountdown>0 && detialMsg.status == 1"> <label for=""></label>{{min}}分{{second}}秒后将自动取消订单 </p>
                        </li>
                        <li v-show="detialMsg.status == 3 || detialMsg.status == 4">
                            <label for=""> 发货信息：</label>
                            <span v-if="detialMsg.sendType == 2">{{detialMsg.deliveryDesc || '--'}}</span>
                            <span class="f_info" v-show="detialMsg.deliveryCompany">{{detialMsg.deliveryCompany}}&nbsp;&nbsp;{{detialMsg.deliveryNo}}&nbsp;&nbsp;&nbsp;</span>
                            <a v-if="(detialMsg.status == 3 || detialMsg.status == 4) && detialMsg.sendType == 1" class="handle" href="javascript:;" @click='seeDeliveryDetial(detialMsg.deliveryNo)'>查看物流详情 > </a>
                        </li>
                    </ul>
                    <ul class="f_left">
                        <li>
                            <label for=""> 买家：</label>
                            <span class="f_info">{{detialMsg.buyer || '--'}}</span>
                        </li>
                        <li>
                            <label for=""> 配送方式：</label>
                            <span class="f_info">{{detialMsg.sendType | sendType}}</span>
                        </li>
                        <li class="clearfix fixed_item">
                            <label class="f_left" for=""> 收货地址：</label>
                            <span class="f_info fixed_info" :class="{hidden: isHidden1}" @mouseover="isHidden1 = false" @mouseout="isHidden1 = true">
                {{detialMsg.receiveAddress}}， {{detialMsg.receivePerson}}，{{detialMsg.receivePhone}}
                </span>
                        </li>
                        <li class="clearfix fixed_item">
                            <label for="" class="f_left"> 留言：</label>
                            <span class="f_info fixed_info" :class="{hidden: isHidden2}" @mouseover="isHidden2 = false" @mouseout="isHidden2 = true">{{detialMsg.buyerMessage || '无'}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="panel_2">
                <div class="panel_2_left f_left">
                    <div class="m_panel">
                        <h4 class="m_panel_title">发票信息</h4>
                        <div class="m_panel_content">
                            <div v-if="detialMsg.shopInvoiceFlag == 1 || detialMsg.supplierId>0">
                                <ul v-if="detialMsg.invoiceFlag == 1 || detialMsg.supplierId>0">
                                    <li>
                                        <label for=""> 发票类型：</label>
                                        <span class="f_info">{{detialMsg.invoiceType}}</span>
                                    </li>
                                    <li>
                                        <label for=""> 开票方式：</label>
                                        <span class="f_info">{{detialMsg.invoiceMode}}</span>
                                    </li>
                                    <li>
                                        <label for=""> 发票抬头：</label>
                                        <span class="f_info">{{detialMsg.invoiceTitle}}</span>
                                    </li>
                                    <li v-show="detialMsg.companyName">
                                        <label for=""> 公司名称：</label>
                                        <span class="f_info">{{detialMsg.companyName}}</span>
                                    </li>
                                    <li v-show="detialMsg.itinNo">
                                        <label for=""> 纳税人识别号：</label>
                                        <span class="f_info">{{detialMsg.itinNo}}</span>
                                    </li>
                                    <li v-show="detialMsg.personName">
                                        <label for=""> 个人名称 :</label>
                                        <span class="f_info">{{detialMsg.personName}}</span>
                                    </li>
                                    <li v-show="detialMsg.invoiceMode=='电子发票' && detialMsg.invoicePhone">
                                        <label for=""> 手机号码 :</label>
                                        <span class="f_info">{{detialMsg.invoicePhone}}</span>
                                    </li>
                                </ul>
                                <p class="padding_top30 f_label" v-if="detialMsg.invoiceFlag == 0 && detialMsg.supplierId == 0"><i class="c_error">* </i>该订单不需要开发票</p>
                            </div>
                            <p class="padding_top30 f_label" v-if="detialMsg.shopInvoiceFlag == 0 && detialMsg.supplierId == 0"><i class="c_error">*</i>该店铺不支持开具发票</p>

                        </div>
                    </div>
                </div>
                <div class="panel_2_right f_left">
                    <div class="m_panel">
                        <h4 class="m_panel_title">订单跟踪</h4>
                        <div class="m_panel_content">
                            <ul>
                                <li>
                                    <label for=""> 下单时间：</label>
                                    <span>{{detialMsg.createTime}}</span>
                                </li>
                                <li v-show="detialMsg.payTime">
                                    <label for=""> {{detialMsg.payType==5?"核验":"付款"}}时间：</label>
                                    <span>{{detialMsg.payTime}}</span>
                                </li>
                                <li v-show="detialMsg.deliveryTime">
                                    <label for=""> 发货时间：</label>
                                    <span>{{detialMsg.deliveryTime}}</span>
                                </li>
                                <li v-show="detialMsg.finishTime">
                                    <label for=""> 完成时间：</label>
                                    <span>{{detialMsg.finishTime}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!--商品清单 -->
            <div class="m_panel panel_3 clear_border overflow">
                <h4 class="m_panel_title">商品清单</h4>
                <table class="layui-table" lay-skin="line">
                    <colgroup>
                        <col>
                        <col width="340">
                        <col>
                        <col>
                        <col>
                    </colgroup>
                    <thead>
                        <tr>
                            <th v-show="true">商品编号</th>
                            <th>商品信息</th>
                            <th>单价</th>
                            <th>数量</th>
                            <th style="min-width: 60px;">小计</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in detialMsg.goodsList" :key="item.key">
                            <td>&nbsp;&nbsp;&nbsp;<span>{{item.goodsSn || '--'}}</span></td>
                            <td class="clear_padding">
                                <dl>
                                    <dt class="f_left">
                    <img :src="item.picUrl" />
                  </dt>
                                    <dd class="good_title">{{item.name}}</dd>
                                    <dd class="c_gray good_size f_label font_12">
                                        <span v-show="index <2" v-for="(sku,index) in item.skuList" :key="sku.name">{{sku.attrName | strLenght(5)}}： {{sku.attrValName | strLenght(5)}} &nbsp;&nbsp;</span>
                                    </dd>
                                </dl>
                            </td>
                            <td class="clear_padding">
                                <span>{{item.price | currency}}</span>
                            </td>
                            <td>{{item.goodsNum}}</td>

                            <td>{{item.totalAmt | currency}}</td>
                        </tr>
                    </tbody>
                </table>
                <ul class="f_right clearfix total_price">
                    <li class="c_info"><label for="" class="text_right"><span class="f_point">订单共 <span>{{detialMsg.goodsNum}}</span> 件商品，</span>&nbsp;商品金额：</label>
                        <span>{{detialMsg.goodsAmt | currency}}</span></li>
                    <li class="c_info"><label for="" class="text_right">运费：</label> <span>{{detialMsg.deliveryAmt | currency}}</span></li>
                    <li class="c_info" v-if="detialMsg.orderIntegralAmt>0"><label for="" class="text_right">积分抵扣：</label> <span>{{detialMsg.orderIntegralAmt | currency}}</span></li>
                    <li><label for="" class="text_right c_info">实际金额：</label> <span class="f_orange">{{detialMsg.orderAmt | currency}}</span></li>
                </ul>
            </div>
        </div>

        <!-- send dialog -->
        <div class="hide send_default select_h150" id="sendDefault">
            <ul>
                <li>
                    <label for="">物流公司：</label>
                    <my-select class="inline_block selcet_box" ref="refPayType" v-model="model.deliveryCompanyId" :options="deliveryFactoryLists"></my-select>
                </li>
                <li>
                    <label for="">运单号码：</label>
                    <input type="text" v-model="model.deliveryNo" @change="model.deliveryNo == ''? deliveryNoError = true : deliveryNoError = false">
                    <p v-show="deliveryNoError" class="c_error error_tip"> <label for=""></label>&nbsp;运单号码不可以为空</p>
                </li>
            </ul>
        </div>
        <div class="hide send_dummy" id="sendDummy">
            <label for="">发货说明：</label>
            <textarea name="" id="" cols="30" rows="10" maxlength="200" v-model="model.sendDummy" placeholder="请输入不要超过200字的说明"></textarea>
        </div>

        <!-- 物流详情 dialog -->
        <div class="hide deliveryDetial" id="deliveryDetial">
            <h4 class="font_14 c_info text_center">物流公司：<span class="margin_right20">{{detialMsg.deliveryCompany}}</span>&nbsp;&nbsp;&nbsp;&nbsp; 运单号：<span>{{detialMsg.deliveryNo}}</span></h4>
            <ul class="line_time">
                <li class="line_time_item clearfix" v-for="(trace, index) in  traces" :key="`trace${index}`"><label for="" class="f_label margin_right20 f_left ">{{trace.acceptTime}} &nbsp;&nbsp;&nbsp;&nbsp;</label><span class="f_left info" :class="{'f_orange': index == 0}">{{trace.acceptStation}}</span></li>
            </ul>
        </div>
    </div>
</template>
<script>
    import fetchJson from "../../api/http";
    import api from "../../api/api";
    import MySelect from "../../components/Select.vue";
    export default {
        name: 'OrderDetial',
        components: {
            MySelect
        },
        data() {
            return {
                isHidden1: true,
                isHidden2: true,
                min: 0,
                second: 0,
                traces: [], // 物流信息动态
                deliveryNoError: false, // 发货时的物流编码验证
                detialMsg: {}, // 订单详情
                deliveryFactoryLists: {
                    size: {
                        h: '40px',
                        w: '400px'
                    },
                    selectOptions: [{
                        Value: 0,
                        Text: '请选择'
                    }]
                },
                model: {
                    deliveryCompanyId: '', // 运输公司Id
                    deliveryNo: '', // 运单号
                    sendDummy: '' // 虚拟发货商品描述
                }
            }
        },

        mounted() {
            // 获取详情
            this.detialMsg = {};
            this.getOrderDetial();
            this.getDeliveryLists();
        },
        methods: {
            toEstimateDetial(id) {
                this.$router.push({
                    name: 'orderEstimateDetial',
                    query: {
                        orderId: id
                    }
                })
            },
            /**
             * 获取订单详情
             *
             */
            async getOrderDetial() {
                let orderId = this.$route.query.id;
                let that = this;
                let loading = window.layer.load(2)
                const res = await fetchJson.post(api.orderDetial, 'params', {
                    id: orderId
                })
                window.layer.close(loading);
                if(res.statusCode == 200) {
                    this.detialMsg = res.responseContent;
                    if(this.detialMsg.status == 1) {
                        let time = Number(this.detialMsg.paymentCountdown);
                        that.second = parseInt(time / 1000) % 60;
                        that.min = parseInt(time / 60 / 1000)
                        let Timer = setInterval(() => {
                            if(time <= 1000) {
                                return
                            }
                            time -= 1000;
                            that.second = parseInt(time / 1000) % 60;
                            that.min = parseInt(time / 60 / 1000)
                        }, 1000);
                        setTimeout(() => {
                            clearInterval(Timer)
                            that.getOrderDetial()
                        }, time)

                    }
                }
            },

            // 获取物流公司信息
            async getDeliveryLists() {
                const res = await fetchJson.post(api.deliveryList, 'params', {})
                let that = this;
                if(res.statusCode == 200) {
                    res.responseContent.list.map(item => {
                        that.deliveryFactoryLists.selectOptions.push({
                            Value: item.id,
                            Text: item.name
                        })
                    })
                }
            },

            /**
             *发货
             * @param {Sting} id  订单id
             * @param {Number} sendType 发货类型
             */
            send(id, sendType) {
                let that = this;
                if(sendType == 1) { // 普通发货

                    let dialog = this.$utils.layerOpen({
                        title: '发货信息',
                        height: '380px',
                        width: '650px',
                        content: $('#sendDefault'),
                        btn: ['提交'],
                        yes: async() => {
                            if(!that.model.deliveryCompanyId) {
                                that.$utils.layerMsg.warning('请选择物流公司！')
                                return;
                            }
                            if(!that.model.deliveryNo) {
                                that.deliveryNoError = true
                                return false;
                            }
                            let data = {
                                orderId: id,
                                deliveryNo: that.model.deliveryNo,
                                deliveryCompanyId: that.model.deliveryCompanyId,
                                sendType: sendType
                            }
                            const res = await fetchJson.post(api.orderSend, 'params', data)
                            if(res.statusCode == 200) {
                                that.$utils.layerMsg.success('发货成功')
                                layer.close(dialog);
                                that.getOrderDetial();
                                that.model.deliveryNo = '';
                            }

                        },
                        cancel() {
                            that.model.deliveryNo = '';
                            that.deliveryNoError = false
                        }
                    })

                } else { // 虚拟发货
                    let dialog = this.$utils.layerOpen({
                        title: '发货信息',
                        height: '340px',
                        width: '650px',
                        content: $('#sendDummy'),
                        btn: ['提交'],
                        yes: async() => {
                            if(!that.model.sendDummy) {
                                that.$utils.layerMsg.warning('发货说明不可以为空');
                                return;
                            }
                            let data = {
                                orderId: id,
                                deliveryNo: '',
                                deliveryCompanyId: '',
                                sendType: sendType,
                                deliveryDesc: that.model.sendDummy
                            }
                            const res = await fetchJson.post(api.orderSend, 'params', data)
                            if(res.statusCode == 200) {
                                that.$utils.layerMsg.success('发货成功')
                                layer.close(dialog);
                                that.getOrderDetial();
                                that.model.sendDummy = '';
                            }
                        },
                        cancel() {
                            that.model.sendDummy = '';
                        }
                    })
                }
            },

            /**
             *查看物流详情
             *@param {String} deliveryNo 物流编码
             */
            async seeDeliveryDetial(deliveryNo) {
                let that = this;
                const res = await fetchJson.post(api.orderDeliveryDetial, 'params', {
                    deliveryNo
                })
                if(res.statusCode == 200) {
                    that.traces = res.responseContent.traces;
                } else {
                    this.$utils.layerMsg.error('获取物流信息失败');
                    return '';
                }
                if(res.statusCode == 200) {
                    that.$utils.layerOpen({
                        title: '物流信息',
                        height: '340px',
                        width: '600px',
                        content: $('#deliveryDetial'),
                    })
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    @import url('../../assets/less/variable.less');
    // 面包屑样式
    .title_crumbs .link {
        color: @color-3;
        font-size: @font-14;
        &:hover {
            color: @color-blue
        }
    }
    
    .m_panel {
        border: 1px solid @color-border;
        margin-bottom: 20px;
        background: @color-white;
        .m_panel_title {
            height: 40px;
            line-height: 40px;
            background: @color-section-header;
            padding-left: 30px;
            font-size: @font-16;
            // border: 1px solid @color-border;
            // border-right: none;
            // border-left: none;
        }
        .m_panel_content {
            padding: 10px 40px;
            overflow: hidden;
        }
    }
    
    .detial .m_panel_content li {
        line-height: 40px;
    }
    
    .detial .m_panel_content label {
        display: inline-block;
        width: 140px;
        color: @color-9;
    }
    
    // panel-1
    .panel_1 {
        ul {
            width: 50%
        }
    }
    
    .panel_2 {
        overflow: hidden;
    }
    
    .panel_2_left {
        padding-right: 10px;
    }
    
    .panel_2_right {
        padding-left: 10px;
    }
    
    .panel_2_left,
    .panel_2_right {
        width: 50%;
        box-sizing: border-box;
        .m_panel_content {
            height: 240px;
        }
    }
    
    .panel_3 thead tr th:first-child {
        padding-left: 30px;
    }
    
    .panel_3 tbody tr td dl {
        padding-left: 30px;
    }
    
    .panel_3 .m_panel_title {
        border-top: 1px solid @color-border;
        border-bottom: 1px solid @color-border;
    }
    
    .overflow {
        overflow: hidden;
    }
    
    .total_price {
        padding: 20px 20px 60px;
        line-height: 30px;
        color: @color-6;
        label {
            display: inline-block;
            width: 200px;
            margin-right: 45px;
            color: @color-9
        }
    }
    
    .tip {
        height: 20px;
        line-height: 12px;
    }
    
    .send_default {
        text-align: left;
        ul {
            height: 162px;
            overflow: hidden;
            li {
                padding-bottom: 30px;
            }
            padding: 30px;
            label {
                display: inline-block;
                width: 115px;
            }
            input {
                box-sizing: border-box;
                height: 40px;
                width: 400px;
                padding: 0 6px;
            }
        }
        .layui-layer-btn a {
            margin: 0 !important
        }
    }
    
    .send_dummy {
        padding: 40px 40px 0;
        text-align: left;
        label {
            float: left;
            margin-right: 20px;
        }
        textarea {
            padding: 10px;
            height: 100px !important;
            width: 420px !important;
        }
        .layui-layer-btn a {
            margin: 0 !important
        }
    }
    
    .error_tip {
        padding-top: 6px;
    }
    
    .deliveryDetial {
        padding: 20px 60px 20px 80px;
        text-align: left;
        h4 {
            padding-bottom: 20px;
        }
        .line_time {
            border-left: 3px solid @color-orange;
            padding: 0 20px;
            line-height: 1;
            .line_time_item {
                position: relative;
                padding-bottom: 30px;
                padding-left: 30px;
                line-height: 1.44;
                &::before {
                    content: '';
                    display: block;
                    position: absolute;
                    left: -26px;
                    top: 0px;
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    background: @color-orange;
                }
                &:first-child:before {
                    border: 4px solid rgba(250, 250, 250, .7);
                    left: -30px;
                }
                .info {
                    width: 207px
                }
            }
        }
    }
    
    .fixed_item {
        position: relative;
        label {
            position: absolute;
            top: 0;
        }
        .fixed_info {
            box-sizing: border-box;
            width: 100%;
            display: block;
            padding-left: 140px;
        }
        .hidden {
            height: 40px;
            overflow: hidden;
        }
    }
</style>