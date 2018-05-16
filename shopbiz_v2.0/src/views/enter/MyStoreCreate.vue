<template>
  <div class="create" @click="showPanel = false, LevelShow = false">
    <div class="header">
      <div class="container">
        <div class="icon-enter-logo fl"></div>
        <span>商家入驻</span>
        <ul class="f_right user_info f_info font_14">
          <li class="f_left">
            <img :src="userPic" class="user_pic"  alt="" width="26" height="26">&nbsp;&nbsp;&nbsp;
          </li>
          <li class="f_left">{{userName}}&nbsp;&nbsp;&nbsp;</li>
          <!-- <li class="f_left handle" v-show="!isLogin" @click="toLogin()">登录</li> -->
          <li class="f_left out_login" @click="outLogin()">退出</li>
        </ul>

      </div>
    </div>

    <div class="step_content container" v-show="step == 3">
      <div class="">
        <div class="panel">
          <h3 class="panel-title">
            认证说明
          </h3>
          <div class="panel-content">
            <p>
              <span class="strong">个人认证：</span> 默认使用身份证进行实时快速认证</p>
            <p>
              <span class="strong"> 企业认证：</span> 适合公司经营者，增加可提现至公司银行账户，审核周期为3个工作日；</p>
          </div>
        </div>
        <div class="panel">
          <h3 class="panel-title">
            店铺信息
          </h3>
          <div class="panel-content">
            <ul>
              <li class="item padding-bottom20 clearfix">
                <div class="f_left">
                  <label class="input-label" for="">店铺名称</label>
                  <div class="input-box">
                    <input type="text" v-model="model.name" @keyup="testName" maxlength="20">
                  </div>

                </div>
                <p class="c_error f_left">
                  <span v-show="formTest.nameEmpty">名称不可以为空</span>
                  <span v-show="formTest.nameRepeat">名称已存在，请修改</span>
                </p>
              </li>
              <li class="padding-bottom20 logo">
                <label for="" class="input-label f_left"> 店铺LOGO</label>
                <div class="margin_left4" >
                  <div id="uploadLogo" class="inline_block w80">
                    <img v-show="logoUrl" :src="logoUrl" alt="">
                    <a href="javascript:;" v-show="!logoUrl" class="btn-upload-img">+</a>
                  </div>
                </div>

                <p class="margin_left_space">支持jpg、png格式，大小不超过500kb，尺寸200x200px</p>
                <p class="c_error margin_left_space">
                  <span v-show="formTest.logoUrl && !logoUrl">logo图片不可以为空</span>
                </p>
              </li>
              <li class="padding-bottom20 clearfix">
                <div class="f_left">
                  <label for="" class="input-label">主营类目</label>
                  <div class="input-box categroy">
                    <input type="text" v-model="model.categoryTitle" readonly @click="toDrop()">
                    <div class="dropDown" :class="{show:showPanel}" @mouseover="showPanel=true" @click.stop="">
                      <h4>主营类目支持多选</h4>
                      <ul>
                        <li v-for="(category, index) in categoryLists" :key="`category${index}`">
                          <my-checkbox v-model="category.isChecked" @input="categoryChecked"></my-checkbox> {{category.categoryName}}</li>
                      </ul>

                    </div>
                    <i></i>
                  </div>
                </div>
                <p class="c_error f_left" v-show="formTest.categroy">
                  <span>主营类目不可以为空</span>
                </p>

              </li>
              <li class="padding-bottom20 address clearfix">
                <div class="f_left">
                  <label for="" class="input-label">店铺地址</label>
                  <div class="input-box">
                    <input type="text" v-model="model.address" readonly @click="toAddress()">
                    <div class="dropDown" :class="{show:LevelShow}" @mouseover="LevelShow=true" @click.stop="">
                      <div class="dropdown_title">
                        <ul>
                          <li class="inline_block" :class="{active: FirstLevel}" @click="FirstLevel = true, firstLevel = '请选择', SecondLevel = false, ThirdLevel = false">
                            <span>{{firstLevel}}</span>
                          </li>
                          <li class="inline_block" :class="{active: SecondLevel}" @click="SecondLevel = true, secondLevel= '', ThirdLevel = false">
                            <span v-show="SecondLevel">请选择</span>{{secondLevel}}
                          </li>
                          <li class="inline_block" :class="{active: ThirdLevel}">
                            <span v-show="ThirdLevel">请选择</span>{{thirdLevel}}
                          </li>
                        </ul>

                      </div>
                      <div class="dropdown_content">
                        <ul v-show="FirstLevel">
                          <li @click="checkFirstLevel(item)" v-for="(item, index) in areaLists" :key="`area${index}`">{{item.name}}</li>
                        </ul>
                        <ul v-show="SecondLevel">
                          <li v-for="(child, index) in areaItemChildren" :key="`categoryItem${index}`" @click="checkSecondLevel(child)">{{child.name}}</li>
                        </ul>
                        <ul v-show="ThirdLevel">
                          <li v-for="(child, index) in areaSecondChildren" :key="`categoryItem${index}`" @click="checkThirdLevel(child)">{{child.name}}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="c_error f_left" v-show="formTest.address">
                  <span>店铺地址不可以为空</span>
                </p>
              </li>
              <li class="clearfix">
                <div class="f_left">
                  <label for="" class="input-label">售后电话</label>
                  <div class="input-box">
                    <input type="text" maxlength="11" v-model="model.servicePhone" @change="testPhone(model.servicePhone)" @keyup="model.servicePhone = model.servicePhone ? model.servicePhone.replace(/\D/g,''): ''">
                  </div>
                </div>
                <p class="c_error f_left" v-show="formTest.servicePhone">
                  <span>售后电话不可以为空的11位数字</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="panel">
          <h3 class="panel-title">
            主体信息
          </h3>
          <div class="panel-content">
            <div class="padding-bottom20 clearfix">
              <label for="" class="input-label f_left"></label>
              <my-radio class="f_left" v-model="model.type" :value="model.type" :options="radioOptions" @input="registerTypeChange"></my-radio>
            </div>
            <ul class="" v-show="registerType == 0">
              <li class="padding-bottom20 clearfix">
                <div class="f_left">
                  <label for="" class="input-label">姓名</label>
                  <div class="input-box">
                    <input type="text" v-model="model.fullName" @input="isEmpty(model.fullName, 'fullName')">
                  </div>
                </div>
                <p class="c_error f_left" v-show="formTest.fullName">
                  <span>姓名不可以为空</span>
                </p>
              </li>
              <li class="clearfix">
                <div class="f_left">
                  <label for="" class="input-label">身份证号码</label>
                  <div class="input-box">
                    <input type="text" v-model="model.identityCard" @blur="cardIdTest(model.identityCard)" @change="cardIdTest(model.identityCard)">
                  </div>
                </div>
                <p class="c_error f_left" v-show="formTest.identityformatCard">
                  <span>身份证号码不可以为空</span>
                </p>
                <p class="c_error f_left" v-show="formTest.identityCard">
                  <span>身份证号码格式不正确</span>
                </p>
              </li>

            </ul>
            <!-- 企业入驻 -->
            <ul class="company" v-show="registerType == 1">
              <li class="padding-bottom20 clearfix">
                <div class="f_left">
                  <label for="" class="input-label">企业名称</label>
                  <div class="input-box">
                    <input type="text" v-model="model.entName" @keyup="isEmpty(model.entName, 'entName')">
                  </div>
                </div>
                <p class="c_error f_left" v-show="formTest.entName">
                  <span>企业名称不可以为空</span>
                </p>
              </li>
              <li class="padding-bottom10 clearfix">
                <div class="f_left">
                  <label for="" class="input-label">法人</label>
                  <div class="input-box">
                    <input type="text" v-model="model.entFullName" @keyup="isEmpty(model.entFullName, 'entFullName')">
                  </div>
                </div>

                <p class="c_error f_left" v-show="formTest.entFullName">
                  <span>法人不可以为空</span>
                </p>
              </li>
              <li class="overflow">
                <label for="" class="input-label f_left">法人证件</label>
                <div class="f_left overflow space-change">
                  <div class="fl margin_right20">
                    <h6 class="upload-title padding-bottom10">身份证正面</h6>
                    <div id="upLoadcard3" class="upload_box">
                      <a v-show="!model.entCardFrontUrl" href="javascript:;" class="btn-big-file">
                      </a>
                      <img v-show="model.entCardFrontUrl" :src="model.entCardFrontUrl" alt="" width="0" height="140">
                    </div>
                  </div>
                  <div class="fl">
                    <h6 class="upload-title padding-bottom10 c-primary">示例</h6>
                    <div>
                      <div href="" class="card-demo">
                        <img src="../../assets/img/enter/card-demo-1.jpg" alt="">
                        <!-- <img v-show="model.entCardFrontUrl" :src="model.entCardFrontUrl" alt=""> -->
                      </div>
                    </div>
                  </div>
                  <p class="upload-msg tip" v-show="formTest.entCardFrontUrl && !model.entCardFrontUrl">请上传身份证正面照</p>
                  <div class="f_left margin_right20">
                    <h6 class="upload-title padding-bottom10">身份证反面</h6>
                    <div id="upLoadcard4" class="upload_box">
                      <a href="javascript:;" v-show="!model.entCardReverseUrl" class="btn-big-file" id="">

                      </a>
                      <img v-show="model.entCardReverseUrl" :src="model.entCardReverseUrl" alt="">
                    </div>
                  </div>
                  <div class="fl">
                    <h6 class="upload-title padding-bottom10 c-primary">示例</h6>
                    <div>
                      <div href="" class="card-demo">
                        <img src="../../assets/img/enter/card-demo.jpg" alt="">
                      </div>
                    </div>
                  </div>
                  <p class="upload-msg tip" v-show="formTest.entCardReverseUrl && !model.entCardReverseUrl">请上传身份证反面照</p>
                </div>
              </li>
              <li class="overflow padding-bottom20">
                <label for="" class="input-label fl">营业执照</label>
                <div class="fl overflow space-change">
                  <div class="fl margin_right20">
                    <h6 class="upload-title padding-bottom10">营业执照</h6>
                    <div id="upLoadcard5" class="upload_box">
                      <a href="javascript:;" v-show="!model.entLicenseUrl" class="btn-big-file"></a>
                      <img v-show="model.entLicenseUrl" :src="model.entLicenseUrl" alt="">
                    </div>
                  </div>
                  <div class="fl">
                    <h6 class="upload-title padding-bottom10 c-primary">示例</h6>
                    <div>
                      <div href="" class="card-demo">
                        <img src="../../assets/img/enter/card-demo-2.jpg" alt="">
                      </div>
                    </div>
                  </div>
                  <p class="upload-msg tip" v-show="formTest.entLicenseUrl && !model.entLicenseUrl">请上传营业执照</p>
                </div>
              </li>
              <li class="padding-bottom20">
                <div class="f_left">
                  <label for="" class="input-label">营业执照号</label>
                  <div class="input-box">
                    <input type="text" v-model="model.entLicenseNo" @keyup="isEmpty(model.entLicenseNo, 'entLicenseNo')" maxlength="20">
                  </div>
                </div>
                <p class="c_error f_left" v-show="formTest.entLicenseNo">营业执照号不可以为空</p>

              </li>
            </ul>
          </div>
        </div>
        <div class="panel">
          <h3 class="panel-title">
            收款账号资料
          </h3>
          <div class="panel-content">
            <!-- 个人入驻 -->
            <ul class="person">
              <li class="padding-bottom20 clearfix">
                <div class="f_left">
                  <label for="" class="input-label f_left">开户银行</label>
                  <!-- <bank-select v-if="!diableFlag" class="bank-select" :imgSrc="data.bankLogoUrl" v-model="data.payeeBranchId" :options="bankSecletConfig"></bank-select> -->
                  <bank-select class="f_left margin_left4" v-model="model.payeeBranchId" :options="secletConfig" @input="isEmpty(model.payeeBranchId, 'payeeBranchId')"></bank-select>
                </div>
                <p class="c_error f_left" v-show="formTest.payeeBranchId">
                  <span>请选择开户银行</span>
                </p>
              </li>
              <li class="padding-bottom20 clearfix">
                <div class="f_left">
                  <label for="" class="input-label">
                    <span v-show="registerType == 0">银行账号</span>
                    <span v-show="registerType == 1">公司账号</span>
                  </label>
                  <div class="input-box">
                    <input type="text" v-model="model.payeeBankCardNo" @input="isEmpty(model.payeeBankCardNo, 'payeeBankCardNo')">
                  </div>
                </div>
                <p class="c_error f_left" v-show="formTest.payeeBankCardNo">
                  <span>账号不可以为空</span>
                </p>
              </li>
              <li class="padding-bottom20 clearfix">
                <div class="f_left">

                  <label for="" class="input-label">
                    <span v-show="registerType == 0">持卡人姓名</span>
                    <span v-show="registerType == 1">公司名称</span>
                  </label>
                  <div class="input-box">
                    <input type="text" v-model="model.payeeName" @keyup="isEmpty(model.payeeName, 'payeeName')">
                  </div>
                </div>
                <p class="c_error f_left" v-show="formTest.payeeName">
                  <span v-show="registerType == 0">持卡人姓名不可以为空</span>
                  <span v-show="registerType == 1">公司名称不可以为空</span>
                </p>
              </li>
              <li class="clearfix">
                <div class="f_left">
                  <label for="" class="input-label">短信验证码</label>
                  <div class="mobile-code input-box">
                    <input type="text" v-model="model.smsCode" placeholder="请输入验证码" maxlength="6" @input="isEmpty(model.smsCode, 'smsCode')">
                  </div>
                  <input type="button" class="btn-code btn_white_orange" :value="btnText" @click="getEmsCode()">
                </div>
                <p class="c_error f_left" v-show="formTest.smsCode">
                  <span>请输入验证码</span>
                </p>
              </li>
              <li class="padding-bottom20 last">
                <p class="returnmsg" v-show="isMobile">验证短信将发送到你绑定的手机：
                  <span class="handle">{{mobile}}</span>，请注意查收</p>
                <p class="agree_rule" v-show="isHaveRule">
                  <my-checkbox v-model="model.agreeRule"></my-checkbox>我已阅读并同意
                  <a class="handle" @click="showRule()">“商家入驻协议”</a>
                </p>
                <input type="button" class="btn btn-step " value="提交认证" :class="{'btn_light_orange': (isHaveRule && model.agreeRule) || !isHaveRule , }"
                  @click="toCreateStore()">
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="step3" v-show="step !==3">
      <div class="step_content">
        <div class="text_center success" v-show="step == 1">
          <i class="inline_block icon-enter-success"></i>
          <p class="padding-top30 return-title">恭喜您入驻成功
            <br>快去发布商品吧！</p>
          <a href="javascript:;" class="btn-tostore btn_light_orange" @click="toStore()">管理店铺</a>
        </div>
        <div class="text_center error" v-show="step == 2">
          <i class="inline_block icon-enter-error"></i>
          <p class="padding-top30 return-title">审核未通过</p>
          <p class="return-detail padding-top10">
            <span>原因：</span>{{this.remark || '无'}}</p>
          <a href="javascript:;" class="btn-tostore btn_light_orange" @click="changeMsg()">修改资料</a>
        </div>
        <div class="text_center error" v-show="step == 0">
          <i class="inline_block icon-enter-waiting"></i>
          <p class="padding-top30 return-title">审核中，我们将在3个工作日内告知您结果</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Bus from "../../assets/bus";
  import api from "../../api/api";
  import fetchJson from "../../api/http";
  import MyRadio from "../../components/Radio.vue";
  import MyCheckbox from "../../components/Checkbox.vue";
  import MySelect from "../../components/Select.vue";
  import BankSelect from '../../components/bankSelect.vue'
  import config from "../../config.js";
  export default {
    name: "StoreCreate",
    components: {
      MyRadio,
      MyCheckbox,
      BankSelect
    },
    data() {
      return {
        showPanel: false,
        rule: "", // 入驻协议
        userName: "",
        userPic: require('../../assets/img/man.png'),
        remark: "",
        LevelShow: false,
        FirstLevel: true, // 一级类目显示、隐藏
        SecondLevel: false, // 二级类目显示、隐藏
        areaItemChildren: [], // 二级地址
        areaSecondChildren: [], // 三级地址
        ThirdLevel: false,
        firstLevel: "请选择",
        secondLevel: "",
        thirdLevel: "",
        isLogo: false,
        logoUrl: "",
        storeName: "",
        registerType: 0, // 0 个人，1为企业
        step: 3,
        state: "1", // 认证状态 0 成功, 1 失败, 2 进行中
        isDropDown: false, // 下拉列表
        categoryLists: [], //品类列表
        categroyCheckeds: [], //已经选中的类目
        areaLists: [], // 地址库
        btnText: "获取验证码",
        isSend: true,
        isHaveRule: false, // 是否有用户协议
        model: {
          categoryTitle: "", // 选中的类目名称
          name: "", // 店铺名称
          address: "", // 地址
          servicePhone: "", //售后电话
          type: 0, // 0,1 个人、企业
          fullName: "", // 姓名
          identityCard: "", // 身份证

          payeeBranchId: "", // 开户银行ID
          payeeBankCardNo: "", //卡号
          payeeName: "", // 持卡人
          smsCode: "", // 验证码
          agreeRule: "", // 是否同意
          shopAddress: "", // 地址
          mainCategoryLst: [], // 品类
          entName: "", //企业名称
          entFullName: "", // 法人
          entLicenseNo: "", // 营业执照号
          entCardFrontUrl: "", //正面
          entCardReverseUrl: "", // 反面
          entLicenseUrl: "", // 营业执照
          provinceId: "", // 省
          cityId: "", // 市
          districtId: "" // 区
        },
        isMobile: "", // 显示手机
        mobile: "", // 手机号码
        radioOptions: [{
            Text: "个人",
            Value: 0
          },
          {
            Text: "企业",
            Value: 1
          }
        ],
        secletConfig: {
          // 银行
          size: {
            w: "502px",
            h: "32px"
          },
          selectOptions: []
        },
        card0: "", //证件1
        card1: "", //证件2
        card2: "", //证件2
        card3: "", //证件2
        card4: "", //证件2
        showCard1: false,
        showCard2: false,
        showCard3: false,
        showCard4: false,
        showCard5: false,

        formTest: {
          nameEmpty: false, // 名称为空
          nameRepeat: false, // 名称
          address: false, // 地址
          servicePhone: false, // 售后电话
          fullName: false, //姓名,法人
          identityCard: false, // 身份证
          identityformatCard: false,
          logoUrl: false, // 店铺logo
          categroy: false, // 类目
          payeeBranchId: false, // 开户银行ID
          payeeBankCardNo: false, //卡号
          payeeName: false, // 持卡人
          smsCode: false, // 验证码
          entCardFrontUrl: false, //正面
          entCardReverseUrl: false, // 反面
          entLicenseUrl: false, // 营业执照
          entName: false, //企业名称
          entFullName: false, // 法人
          entLicenseNo: false // 营业执照id
        },
        submit: 0 // 提交次数
      };
    },
    mounted() {
      Bus.$on("enterStep", step => {
        this.step = step;
      });
      this.crateUpload("#uploadLogo");
      this.crateUpload("#upLoadcard2");
      this.crateUpload("#upLoadcard1");
      this.crateUpload("#upLoadcard3");
      this.crateUpload("#upLoadcard4");
      this.crateUpload("#upLoadcard5");
      /*获取一级分类*/
      this.getCategoryLists();
      // 获取地址库
      this.getAreaLists();
      // 获取银行
      this.getBankLists();
      // 获取用户协议
      this.getRule();
      // 获取用户信息
      this.getUserMsg();

      this.getAuditInfo();
    },

    methods: {

      // 获取入驻进度
      async getAuditInfo() {
        const res = await fetchJson.post(api.getJoinStep, "params", {});
        if (res.statusCode == 200) {
          switch (res.responseContent.auditStatus) {
            case 0:
              this.step = 0;
              break;
            case 1:
              this.step = 1;
              this.state = 1;
              break;
            case 2:
              this.step = 2;
              this.remark = res.responseContent.remark;
              break;
            default:
              this.step = 3;
          }
        }
      },

      // 去我的店铺
      toStore() {
        this.$router.push({
          name: "materialManage"
        });
      },

      getUserMsg() {
        let msg = JSON.parse(localStorage.getItem("userMsg"));
        if (msg) {
          this.userPic = msg.logoUrl? msg.logoUrl : this.userPic;
          this.userName = msg.mobile;
        }
      },
      crateUpload(elm) {
        let that = this;
        layui.use("upload", function (upload) {
          upload.render({
            method: "POST",
            elem: elm,
            url: config.upLoad + "/file/upload-new", //要上传的图片地址
            accept: "images",
            field: "file",
            size: 500,
            ext: "jpg|png", //那么，就只会支持这三种格式的上传。注意是用|分割。
            choose: function (obj) {
              var files = obj.pushFile();
              obj.preview(function (index, file, result) {
                // 预读本地文件
                //对上传失败的单个文件重新上传，一般在某个事件中使用
                //obj.upload(index, file);
              });
            },
            done: function (res) {
              if (res.statusCode == 200) {
                //上传成功返回值，必须为json格式
                switch (elm) {
                  case "#uploadLogo":
                    that.logoUrl = res.responseContent.url;
                    that.formTest.logoUrl = false;
                    that.isLogo = true;
                    break;
                  case "#upLoadcard1":
                    that.card0 = res.responseContent.url;
                    that.formTest.entCardFrontUrl = false;
                    that.showCard1 = true;
                    break;
                  case "#upLoadcard2":
                    that.card1 = res.responseContent.url;
                    that.formTest.entCardReverseUrl = false;
                    that.showCard2 = true;
                    break;
                  case "#upLoadcard3":
                    that.model.entCardFrontUrl = res.responseContent.url;
                    that.showCard3 = true;
                    break;
                  case "#upLoadcard4":
                    that.model.entCardReverseUrl = res.responseContent.url;
                    that.showCard4 = true;
                    break;
                  case "#upLoadcard5":
                    that.model.entLicenseUrl = res.responseContent.url;
                    // console.log(that.model.entLicenseUrl)
                    that.showCard5 = true;
                    break;
                }
              } else if (res.result == 1) {}
            }
          });
        });
      },

      // 用户协议
      showRule() {
        let that = this;
        this.$utils.layerOpen({
          title: "商家入驻协议", //弹框标题
          width: "850px", //弹框宽度
          height: "670px",
          content: `<div class="padding_top30 text_left" style="padding:20px">${that.rule}</div> `
        });
      },

      async getCategoryLists() {
        const res = await fetchJson.post(api.getCategory, "params", {});
        if (res.statusCode == 200) {
          this.categoryLists = res.responseContent;
        }
      },

      /*
       *入驻前表单验证
       */
      // 店铺名称验证
      async testName() {
        let that = this;
        let name = that.model.name;
        // 发生改变时对form进行重新赋值
        that.formTest.nameEmpty = false;
        that.formTest.nameRepeat = false;
        name = name.replace(/(^\s*)|(\s*$)/g, ""); // 去除两端的空格
        if (name == "") {
          that.formTest.nameEmpty = true;
        }
        const res = await this.getStoreNames(name);
        if (res) {} else {
          that.formTest.nameRepeat = true;
        }

        that.formTest = Object.assign({}, that.formTest);
      },

      //验证是否为空
      /**
       * @param {any} val
       * @param{String} errorKey
       */
      isEmpty(val, errorKey) {
        this.formTest[errorKey] = this.$utils.isEmpty(val);
      },

      testPhone(pheneNum) {
        var regx = /^[0-9]{11}$/;
        if (regx.test(pheneNum)) {
          this.formTest.servicePhone = false;
        } else {
          this.formTest.servicePhone = true;
        }
      },

      // 验证身份证
      cardIdTest(cardId) {
        this.formTest.identityCard = false;
        this.formTest.identityformatCard = false;

        let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (cardId == "") {
          this.formTest.identityformatCard = true;
          return false;
        }
        if (!regIdNo.test(cardId)) {
          this.formTest.identityCard = true;
          return false;
        }
        return true;
      },

      //创建店铺
      async toCreateStore() {
        if (this.isHaveRule && !this.model.agreeRule) {
          this.$utils.layerMsg.warning("请先勾选用户协议!");
          return;
        }
        let params = {},
          that = this,
          isCreate = true; // 提交的数据
        // 验证店铺名称
        if (this.$utils.isEmpty(this.model.name) || this.formTest.nameRepeat) {
          if (this.$utils.isEmpty(this.model.name)) {
            this.formTest.nameEmpty = true;
          }
          that.$utils.layerMsg.warning("店铺名称错误！");
          return (isCreate = false);
        }
        if (!that.logoUrl) {
          that.$utils.layerMsg.warning("店铺logo不可以为空！");
          that.formTest.logoUrl = true;
          return (isCreate = false);
        }
        if (that.model.mainCategoryLst.length == 0) {
          that.$utils.layerMsg.warning("请选择经营类目");
          that.formTest.categroy = true;
          return (isCreate = false);
        }
        if (!that.model.shopAddress) {
          that.$utils.layerMsg.warning("请选择店铺地址");
          that.formTest.address = true;
          return (isCreate = false);
        }
        if (!that.model.servicePhone || this.formTest.servicePhone) {
          that.$utils.layerMsg.warning("请输入售后电话");
          that.formTest.servicePhone = true;
          return (isCreate = false);
        }
        if (!that.model.payeeBranchId) {
          that.$utils.layerMsg.warning("请选择开户银行");
          that.formTest.payeeBranchId = true;
          return (isCreate = false);
        }
        if (!that.model.payeeBankCardNo) {
          that.$utils.layerMsg.warning("请输入账号");
          that.formTest.payeeBankCardNo = true;
          return (isCreate = false);
        }
        if (!that.model.payeeName) {
          let title = this.model.type == 0 ? "请输入持卡人姓名" : "请输入公司名称";
          that.$utils.layerMsg.warning(title);
          that.formTest.payeeName = true;
          return (isCreate = false);
        }
        if (!that.model.smsCode) {
          that.$utils.layerMsg.warning("请输入验证码");
          that.formTest.smsCode = true;
          return (isCreate = false);
        }

        if (this.model.type == 0) {
          if (!that.model.fullName) {
            that.$utils.layerMsg.warning("请输入姓名");
            that.formTest.fullName = true;
            return (isCreate = false);
          }
          if (that.formTest.identityCard) {
            that.$utils.layerMsg.warning("请输入正确的身份证号");
            return (isCreate = false);
          }
          if (that.formTest.identityformatCard) {
            that.$utils.layerMsg.warning("请输入身份证号");

            return (isCreate = false);
          }
          params = {
            name: that.model.name,
            logoUrl: that.logoUrl,
            mainCategoryLst: that.model.mainCategoryLst.join(","),
            shopAddress: that.model.address,
            servicePhone: that.model.servicePhone,
            type: that.model.type,
            // entCardFrontUrl: that.card0, // 身份证
            // entCardReverseUrl: that.card1, // 身份证
            fullName: that.model.fullName,
            identityCard: that.model.identityCard,
            payeeBranchId: that.model.payeeBranchId,
            payeeBankCardNo: that.model.payeeBankCardNo,
            payeeName: that.model.payeeName,
            mobile: this.mobile,
            smsCode: that.model.smsCode,
            provinceId: this.model.provinceId,
            cityId: this.model.cityId,
            districtId: this.model.districtId
          };
        } else {
          if (!that.model.entName) {
            that.$utils.layerMsg.warning("请输入企业名称");
            that.formTest.entName = true;
            return (isCreate = false);
          }
          if (!that.model.entFullName) {
            that.$utils.layerMsg.warning("请输入企业法人");
            that.formTest.entFullName = true;
            return (isCreate = false);
          }
          if (!that.model.entLicenseNo) {
            that.$utils.layerMsg.warning("请输入营业执照");
            that.formTest.entLicenseNo = true;
            return (isCreate = false);
          }

          if (!that.model.entCardFrontUrl) {
            that.$utils.layerMsg.warning("请上传身份证反面照");
            that.formTest.entCardFrontUrl = true;
            return (isCreate = false);
          }
          if (!that.model.entCardReverseUrl) {
            that.$utils.layerMsg.warning("请上传身份证反面照");
            that.formTest.entCardReverseUrl = true;
            return (isCreate = false);
          }
          if (!that.model.entLicenseUrl) {
            that.$utils.layerMsg.warning("请上传营业执照");
            that.formTest.entLicenseUrl = true;
            return (isCreate = false);
          }

          params = {
            name: that.model.name,
            logoUrl: that.logoUrl,
            mainCategoryLst: that.model.mainCategoryLst.join(","),
            shopAddress: that.model.address,
            servicePhone: that.model.servicePhone,
            type: that.model.type,
            entName: that.model.entName,
            entFullName: that.model.entFullName,
            entCardFrontUrl: that.model.entCardFrontUrl,
            entCardReverseUrl: that.model.entCardReverseUrl,
            entLicenseUrl: that.model.entLicenseUrl,
            entLicenseNo: that.model.entLicenseNo,
            payeeBranchId: that.model.payeeBranchId,
            payeeBankCardNo: that.model.payeeBankCardNo,
            payeeName: that.model.payeeName,
            mobile: this.mobile,
            smsCode: that.model.smsCode,
            provinceId: this.model.provinceId,
            cityId: this.model.cityId,
            districtId: this.model.districtId
          };
        }

        if (isCreate) {
          this.submit ++;
          if(this.submit>1){
            return
          }
          const res = await fetchJson.post(api.createShop, "params", params);
          this.submit = 0;
          if (res.statusCode == 200) {
            this.$utils.layerMsg.success("提交成功！");
            this.getAuditInfo();
          }
        }
      },

      // 类目下拉列表
      toDrop() {
        let that = this;
        this.formTest.category = false;
        if (this.categroyCheckeds.length == 0) {
          // this.formTest.categroy = true;
        } else {
          this.formTest.categroy = false;
          that.model.mainCategoryLst = [];
          this.categroyCheckeds.map(item => {
            that.model.mainCategoryLst.push(item.categoryId);
          });
        }
      },

      // checkbox 点击
      categoryChecked(val) {
        let that = this;
        that.categroyCheckeds = [];
        let titleArr = [];
        that.model.categoryTitle = "";
         that.model.mainCategoryLst = [];
        this.categoryLists.map(item => {
          if (item.isChecked) {
            that.categroyCheckeds.push(item);
            titleArr.push(item.categoryName);
            that.model.mainCategoryLst.push(item.categoryId)
          }
        });
        that.model.categoryTitle = titleArr.join("、");
        // this.model = Object.assign({}, this.model)
      },

      // 获取地址库
      async getAreaLists() {
        let areaTree = JSON.parse(localStorage.getItem("areaTree"));
        if (areaTree) {
          this.areaLists = areaTree;
        } else {
          const res = await fetchJson.post(api.areaTree, "params", {});
          if (res.statusCode == 200) {
            this.areaLists = res.responseContent;
            localStorage.setItem("areaTree", JSON.stringify(res.responseContent));
          }
        }
      },

      /*
       *选择地址库
       * param { Object } item
       */
      toAddress() {
        let that = this;

        this.formTest.address = false;
        if (!this.model.address) {
          // that.formTest.address = true;
        } else {
          that.model.shopAddress = that.model.address;
          that.formTest.address = false;
        }
      },
      checkFirstLevel(item) {
        this.FirstLevel = false;
        this.model.provinceId = item.id;
        this.areaItemChildren = item.children;
        this.bufferCategory = [];
        this.bufferCategory.push(item);
        if (this.areaItemChildren.length == 0) {
          this.LevelShow = false;
          this.SecondLevel = false;
          this.FirstLevel = true;
          this.model.address = item.name;
          return;
        } else {
          this.SecondLevel = true;
        }
        this.firstLevel = item.name;
      },

      checkSecondLevel(child) {
        this.model.cityId = child.id;
        this.SecondLevel = false;
        this.formTest.address = false;
        this.areaSecondChildren = child.children;
        if (child.children && child.children.length == 0) {
          this.firstLevel = "请选择";
          this.FirstLevel = true;

          this.LevelShow = false;
          this.bufferCategory.push(child);
          let categoryArr = [];
          this.bufferCategory.map(item => {
            categoryArr.push(item.name);
          });
          this.model.address = categoryArr.join(" — ");
        } else {
          this.bufferCategory.push(child);
          this.secondLevel = child.name;
          this.ThirdLevel = true;
        }
      },

      checkThirdLevel(lastChild) {
        this.model.districtId = lastChild.id;
        this.firstLevel = "请选择";
        this.FirstLevel = true;
        this.SecondLevel = false;
        this.secondLevel = "";
        this.ThirdLevel = false;
        this.thirdLevel = "";

        this.LevelShow = false;
        this.bufferCategory.push(lastChild);
        let categoryArr = [];
        this.bufferCategory.map(item => {
          categoryArr.push(item.name);
        });
        this.model.address = categoryArr.join(" — ");
        this.model.shopAddress = this.model.address;
        this.formTest.address = false;
      },

      /**
       * 改变入驻状态
       * @param {number} type
       */
      registerTypeChange(type) {
        this.registerType = type;
      },

      // 获取银行列表
      async getBankLists() {
        let res = await fetchJson.post(api.getBackList, "params", {});
        if (res.statusCode == 200) {
          res.responseContent.map(item => {
            this.secletConfig.selectOptions.push({
              Text: item.bankName,
              Value: item.bankId,
              Src: item.bankLogoUrl
            });
          });
        }
      },

      // 获取店铺名称列表
      async getStoreNames(name) {
        const res = await fetchJson.post(api.getStoreNames, "params", {
          name
        });
        let isrepty = false;
        if (res.statusCode == 200) {
          if (res.responseContent.nameDuplicateFlag == 1) {
            isrepty = true;
          } else {
            isrepty = false;
          }
        }
        return isrepty;
      },

      // 获取验证码
      async getEmsCode() {
        if (!this.isSend) {
          this.$utils.layerMsg.warning("不可以频繁发送验证码");
          return;
        }
        this.mobile = JSON.parse(localStorage.getItem("userMsg")).mobile;
        let res = await fetchJson.post(api.getemscode, "params", {});
        if (res.statusCode == 200) {
          this.isSend = false;
          var t = 60;
          this.isMobile = true;

          this.timer = setInterval(() => {
            if (t > 0) {
              this.btnText = t + "s后重发";
              t--;
            } else {
              clearInterval(this.timer);
              this.btnText = "获取验证码";
              this.isSend = true;
            }
          }, 1000);
        }
      },

      async getRule() {
        const res = await fetchJson.post(api.getJoinInfo, "params", {});
        if (res.statusCode == 200) {
          if (!res.responseContent) {
            this.isHaveRule = false;
          } else {
            this.isHaveRule = true;
            this.rule = res.responseContent;
          }
        }
      },

      // 获取入驻资料
      async changeMsg() {
        let res = await fetchJson.post(api.getJoinMsg, "params", {});

        if (res.statusCode == 200 && res.responseContent) {
          this.step =3;
          this.model = {
            ...res.responseContent
          };
          this.model = Object.assign({}, this.model);
          this.model.address = res.responseContent.addressNameMap.provinceName + " — " + res.responseContent.addressNameMap
            .cityName + " — " + res.responseContent.addressNameMap.districtName;
          this.model.categoryTitle = res.responseContent.mainCategoryList.join(","); // 上次提交的主营类目的title
          this.model.mainCategoryLst = res.responseContent.mainCategoryIdList; // 上次选中的主营类目Id
          this.model.type = this.model.shopType;
          this.registerType = this.model.shopType;
          this.logoUrl = this.model.logoUrl;
          this.model.shopAddress = this.model.address;
          this.model.cityId = res.responseContent.addressIdMap.cityId;
          this.model.districtId = res.responseContent.addressIdMap.districtId;
          this.model.provinceId = res.responseContent.addressIdMap.provinceId;
        }
      },

      outLogin() {
        localStorage.removeItem("token");
        localStorage.removeItem("userMsg");
        this.$utils.layerMsg.success("退出成功！");
        window.location.href = config.loginPath;
        Bus.$emit("isLogin", false);
      }
    }
  };

</script>

<style lang="less" scoped>
  @import url(../../assets/less/index.less);
  .margin_left4 {
    margin-left: 4px;
  }

  .padding-top30 {
    padding-top: 30px;
  }

  .c-primary {
    color: @color-orange;
  }

  .padding-bottom20 {
    padding-bottom: 20px;
  }

  .create {
    background: @color-white;
  }

  .icon-enter-logo {
    margin-top: 20px;
    margin-right: 20px;
  }

  .header {
    height: 90px;
    line-height: 90px;
    font-size: 24px;
    color: @color-c;
    border-bottom: 2px solid @color-orange;

    .icon-store-logo {
      margin: 26px 10px 0 0;
    }
  }

  .panel {
    padding-top: 30px;
  }

  .input-label {
    box-sizing: border-box;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    width: 120px;
    padding-right: 35px;
    text-align: right;
    color: @color-3;
  }

  .input-box {
    width: 484px;
    display: inline-block;
    padding: 0 8px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #dcdcdc;

    input {
      width: 100%;
      box-sizing: border-box;
      height: 27px;
      border: none;
    }
    input[type="text"]:focus+.dropDown {
      display: block;
    }
  }

  .btn-code {
    height: 32px;
    width: 94px;
    margin-left: 7px;
  }

  .input-box.mobile-code {
    width: 378px;
  }

  .person .last {
    padding-top: 10px;
    margin-left: 124px;
  }

  .panel-title {
    height: 40px;
    line-height: 40px;
    background: @color-section-header;
    color: @color-3;
    font-size: 16px;
    font-weight: 600;

    &:before {
      content: "";
      display: block;
      float: left;
      margin: 10px 20px 0 10px;
      height: 20px;
      width: 3px;
      background: @color-orange;
    }
  }

  .panel-content {
    padding: 30px;
    color: @color-6;

    p {
      line-height: 20px;
      font-size: 12px;
    }
  }

  .btn {
    display: inline-block; // background: @btn-default;
    height: 40px;
    line-height: 40px; // color: @color-f;
    text-align: center; // .border-radius(4px);
  }

  .btn-step {
    margin-top: 68px;
    width: 250px;
    height: 48px;
  }

  .step2 {
    padding: 20px 0 70px;
    .panel-content li {
      line-height: 30px;
      font-size: 12px;
    }
  }

  .step2 .btn-submit {
    width: 300px;
    .btn;
  }

  .margin_left_space {
    margin-left: 122px;
  }

  .step3 {
    height: 600px;
    .step_content {
      width: 460px;
      height: 210px;
      padding-top: 170px;
      margin: 0 auto; // background: #eee;
    }
  }

  .icon-success {
    width: 42px;
    height: 42px; // background: url('../../assets/img/store/success.png') no-repeat;
  }

  .icon-error {
    width: 42px;
    height: 42px; // background: url('../../assets/img/store/error.png') no-repeat;
  }

  .return-title {
    font-size: 24px;
    line-height: 40px;
  }

  .return-detail {
    font-size: 14px;
    color: @color-9;
    line-height: 20px;
  }

  .company_card {
    width: 200px;
    height: 140px; // border: 1px solid @border-default;
    margin-right: 20px;
    background: #ff00ff;
  }

  .btn-upload-img {
    display: inline-block;
    width: 80px;
    height: 80px;
    border: 1px dashed #999;
    text-align: center;
    font-size: 18px;
    line-height: 80px; // background: url('../../assets/img/store/upload-img.jpg')no-repeat;
  }

  .btn-big-file {
    display: block;
    width: 200px;
    height: 140px;
    background: url("../../assets/img/enter/upload-big.jpg")no-repeat;
  }

  .card-demo {
    display: block;
    width: 200px;
    height: 140px;
    img {
      width: 200px;
      height: 140px;
    }
  }

  .card-demo1 {
    display: block;
    width: 200px;
    height: 140px; // background: url('../../assets/img/store/card-demo.jpg')no-repeat;
  }

  .card-demo2 {
    .card-demo1; // background: url('../../assets/img/store/card-demo-2.jpg')no-repeat;
  }

  .upload-title {
    line-height: 30px;
    &.c-primary {
      // color: @main;
    }
  }

  .upload-msg {
    float: left;
    width: 100%;
    height: 30px;
    line-height: 20px;
    font-size: 12px; // color: @error;
  }

  .space-change {
    width: 600px;
    margin-left: 4px;
  }

  .logo {
    vertical-align: middle;
    img {
      width: 80px;
      height: 80px;
      border: 1px solid @color-border;
      margin-left: 3px;
    }
  }

  .categroy {
    position: relative;

    .dropDown {
      z-index: 1;
      display: none;
      position: absolute;
      right: 0;
      top: 30px;
      padding: 10px 20px;
      width: 460px;
      overflow: hidden;
      background: @color-white;
      border: 1px solid @color-border;

      li {
        float: left;
        margin: 0 10px;
        width: 125px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 5px;
        margin-top: 5px;
        line-height: 20px;
      }
    }
  }

  .address {
    position: relative;
    .dropDown {
      position: absolute;
      display: none;
      z-index: 1;
      left: 124px;
      border: 1px solid #e8e8e9;
      width: 470px; // height: 317px;
      background: #ffffff;
      padding: 15px;

      h3 {
        text-align: center;
        height: 60px;
        line-height: 60px;
        font-size: 20px;
        padding-bottom: 10px;
      }

      .icon-close {
        margin: 12px;
        cursor: pointer;
      }

      .dropdown_content {
        padding: 20px;
        line-height: 40px;
        li {
          float: left;
          margin-right: 30px;
          cursor: pointer;
          &:hover {
            color: @color-orange;
          }
        }
      }
    }

    .dropdown_title {
      ul {
        border-bottom: 1px solid @color-border;
        li {
          padding: 0 20px;
          margin-right: 50px;
          text-align: center;
          color: @color-orange;
          cursor: pointer;
          &.active {
            border-bottom: 1px solid @color-orange;
          }
        }
      }
    }
  }

  .agree_rule {
    padding-top: 8px;
    line-height: 18px;
  }

  .c_error {
    line-height: 30px !important;
    padding-left: 10px;
  }

  .tip {
    color: @color-error;
  }

  .upload_box img {
    width: 200px !important;
    height: 140px !important;
  }

  .out_login {
    &:before {
      content: "";
      display: block;
      float: left;
      width: 2px;
      height: 14px;
      background: #999;
      margin: 38px 20px 0 6px;
    }
  }

  .show {
    display: block !important;
  }

  .step1 {
    background: #fff;
  }

  .user_pic{
    border-radius:50%;
  }

  .step3 {
    height: 600px;
    background: #fff;
    width: 1200px;
    margin: auto;
    margin-top: 10px;
    margin-bottom: 50px;
    .step_content {
      width: 460px;
      height: 210px;
      padding-top: 170px;
      margin: 0 auto; // background: #eee;
    }

    .icon-success {
      width: 42px;
      height: 42px; // background: url('../../assets/img/store/success.png') no-repeat;
    }

    .icon-error {
      width: 42px;
      height: 42px; // background: url('../../assets/img/store/error.png') no-repeat;
    }

    .return-title {
      margin-top: 30px;
      line-height: 1.44;
      font-size: 24px;
      color: @color-3;
    }

    .return-detail {
      color: @color-9;
      margin-top: 10px;
    }

    .btn-tostore {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      width: 260px;
      margin-top: 50px;
    }
  }

</style>
