<!--
    标题：店铺资料
    描述：包括个人、企业修改与展示
-->
<template>
  <div class="dp_content" @click="isDropDown = false, LevelShow= false" >
    <div class="nav">
      <span>店铺资料</span>
    </div>
    <div class="sj_list_content">
      <dl>
        <dt>
          <span class="title">店铺信息</span>
          <span class="binding">（ 店铺编号：{{data.shopCode}} {{data.enaleFlagDesc}} ）</span>
          <span class="btn_orange btn_pos" @click="editData()" v-show="diableFlag">修改</span>
        </dt>
        <dd class="row">
          <div class="col-3 ie-left">
            <p>店铺名称：</p>
            <p style="margin-bottom: 39px;">店铺LOGO：</p>
            <!-- <p>入驻时间：</p> -->
            <p>主营类目：</p>
            <p>店铺地址：</p>
            <p>售后电话：</p>
          </div>
          <div class="col-7 ie-left">
            <p class="item">
              <input type="text" v-model="data.shopName" @keyup="testName" class="layui-input" v-bind:disabled="diableFlag" :class="{'input-white': !diableFlag}"
                maxlength="20">
              <span class="tips c_error" v-show="!diableFlag && isRepty">此名称已存在，请修改</span>
              <span class="tips c_error" v-show="!diableFlag && nameEmpty">店铺名称不可以为空</span>
            </p>
            <p class="m_logo item" v-show="diableFlag">
              <img class="border_grey" width="80" height="80" v-bind:src="data.logoUrl">
            </p>
            <p class="m_logo item" id="upLoad" v-show="!diableFlag">
              <img class="border_grey" width="80" height="80" v-bind:src="data.logoUrl">
            </p>
            <span class="f_left upload_info" v-show="!diableFlag">支持.igp,.png格式，不超过500k，尺寸200pxx200px</span>
            <!-- <p>
              <input type="text" v-model="data.auditTime" class="layui-input" v-bind:disabled="diableFlag" :class="{'input-white': !diableFlag}">
            </p> -->
            <div class="clearfix category_item item" style="padding: 17px;">
              <div class="input-box categroy">
                <input type="text" class="input_width" placeholder="请选择类目" v-model="data.categoryTitle" readonly @click.stop="toDrop()" v-bind:disabled="diableFlag"
                  :class="{'input-white': !diableFlag}">
                <i></i>
                <div v-show="isDropDown" class="dropDown"  @mouseover="isDropDown=true" @click.stop="">
                  <h4>主营类目支持多选</h4>
                  <ul>
                    <li v-for="(category, index) in categoryLists" :key="`category${index}`">
                      <my-checkbox v-model="category.isChecked" @input="categoryChecked"></my-checkbox> {{category.categoryName | strLenght(8)}}</li>
                  </ul>
                </div>
              </div>
              <span class="tips c_error" v-show="!diableFlag && isCategoryTitle">主营类目不可以为空</span>
            </div>
            <div class="address clearfix item">

              <div class="input-box">
                <input type="text" class="input_width" v-model="data.shopAddress" readonly @click.stop="toAddress()" v-bind:disabled="diableFlag"
                  :class="{'input-white': !diableFlag}">
                <div class="dropdown" v-show="LevelShow" @mouseover="LevelShow=true" @click.stop="">
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
            <p class="item">
              <input type="text" v-model.trim="data.servicePhone" class="layui-input" v-bind:disabled="diableFlag" :class="{'input-white': !diableFlag}"
                maxlength="11" @change="testServicePhone(data.servicePhone)" @keyup="data.servicePhone = data.servicePhone ? data.servicePhone.replace(/\D/g,''): ''">
              <span class="tips c_error" v-show="!diableFlag && isServicePhone">请输入长度为11位的电话号码</span>
            </p>
          </div>
        </dd>
        <dt>
          <span class="title">主体信息</span>
        </dt>
        <dd class="row" v-if="data.shopType == 1">
          <div class="col-3 ie-left">
            <p>认证主体：</p>
            <p>企业名称：</p>
            <p>法人：</p>
            <p class="mb_photo">法人证件照：</p>
            <p class="mb_photo" >营业执照：</p>
            <p style="padding-top: 22px">营业执照号：</p>
          </div>
          <div class="col-7 ie-left">
            <p class="text_left">
              <input v-if="diableFlag" type="text" value="企业" class="layui-input" disabled>
              <span v-if="!diableFlag">企业</span>
            </p>
            <p class="text_left">
              <input v-if="diableFlag" type="text" v-model="data.entName" class="layui-input" disabled>
              <span v-if="!diableFlag">{{data.entName}}</span>
            </p>
            <p class="text_left">
              <input v-if="diableFlag" type="text" v-model="data.entFullName" class="layui-input" disabled>
              <span v-if="!diableFlag">{{data.entFullName}}</span>
            </p>
            <p class="m_logo flex_photo">
              <img class="border_grey" width="220" height="120" v-bind:src="data.entCardFrontUrl">
              <img class="border_grey" width="220" height="120" v-bind:src="data.entCardReverseUrl">
            </p>
            <p class="m_logo">
              <img class="border_grey" width="220" height="120" v-bind:src="data.entLicenseUrl">
            </p>
            <p class="text_left">
              <input v-if="diableFlag" type="text" v-model="data.entLicenseNo" class="layui-input" disabled>
              <span v-if="!diableFlag">{{data.entLicenseNo}}</span>
            </p>
          </div>
        </dd>

        <dd class="row" v-if="data.shopType == 0">
          <div class="col-3 ie-left">
            <p>认证主体：</p>
            <p>姓名：</p>
            <p>身份证号码：</p>
          </div>
          <div class="col-7 ie-left">
            <p class="text_left">
              <input v-if="diableFlag" type="text" value="个人" class="layui-input" disabled>
              <span v-if="!diableFlag">个人</span>
            </p>
            <p class="text_left">
              <input v-if="diableFlag" type="text" v-model="data.fullName" class="layui-input" disabled>
              <span v-if="!diableFlag">{{data.fullName}}</span>
            </p>
            <p class="text_left">
              <input v-if="diableFlag" type="text" v-model="data.identityCard" class="layui-input" disabled>
              <span v-if="!diableFlag">{{data.identityCard}}</span>
            </p>
          </div>
        </dd>

        <dt>
          <span class="title">收款账号资料</span>
        </dt>
        <dd class="row row3">
          <div class="col-3 ie-left f_left">
            <p>开户银行：</p>
            <p>{{data.shopType == 1 ? '公司账户：': '银行账号：'}}</p>
            <p>{{data.shopType == 1 ? '公司名称：': '持卡人姓名：'}}</p>
            <p v-if="!diableFlag">短信验证码：</p>
          </div>
          <div class="col-7 ie-left">
            <p class="bank">
              <input v-if="diableFlag" style="padding-left:70px" type="text" name="name" v-model="bankName" class="layui-input" v-bind:disabled="diableFlag" :class="{'input-white': !diableFlag}">
              <img v-if="diableFlag" v-bind:src="data.bankLogoUrl">
              <!-- <my-select v-if="!diableFlag" class="bank-select" v-model="data.payeeBranchId" :options="secletConfig"></my-select> -->
              <bank-select v-if="!diableFlag" class="bank-select" :imgSrc="data.bankLogoUrl" v-model="data.payeeBranchId" :options="bankSecletConfig"></bank-select>
            </p>
            <p class="item">
              <input type="text" v-model="data.payeeBankCardNo" class="layui-input" v-bind:disabled="diableFlag" :class="{'input-white': !diableFlag}"
                maxlength="20" @keyup="isEmpty(data.payeeBankCardNo, 'payeeBankCardNo')">
              <span class="tips c_error" v-show="formTest.payeeBankCardNo">账号不可以为空</span>
            </p>
            <p class="item">
              <input type="text" v-model="data.payeeName" class="layui-input" v-bind:disabled="diableFlag" :class="{'input-white': !diableFlag}"
                maxlength="10" @keyup="isEmpty(data.payeeName, 'payeeName')">
              <span class="c_error tips" v-show="formTest.payeeName">
                <span v-show="data.shopType == 0">持卡人姓名不可以为空</span>
                <span v-show="data.shopType == 1">公司名称不可以为空</span>
              </span>
            </p>
            <p v-if="!diableFlag" class="item">
              <input class="layui-input input-white" type="text" v-model="data.smsCode" maxlength="6">
              <em class="btn_msg" @click="getMsg">{{btnText}}</em>
            </p>
            <div class="text_left" style="margin-left: 30px; margin-top:-10px">

            <i v-show="formTest.mobile">验证短信将发送到你绑定的手机：
              <i class="orange">+86-{{mobile}}</i>，请注意查收</i>
            </div>
          </div>
        </dd>
      </dl>
      <div v-show="diableFlag">
        <p class="p_center">
          <i class="c_red">*</i>收费说明：</p>
        <p class="p_center">1、销售费率：{{(data.settleRate*100).toFixed(2)}}%（不限店铺销售商品品类，从每月结算金额中扣除）</p>
      </div>
      <div v-show="!diableFlag" class="save_btn">
        <span class="btn_orange btn_pos1" @click="saveData()">保存</span>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../api/api';
  import fetchJson from '../../api/http';
  import fund from '../../api/fund';
  // import MySelect from '../../components/Select.vue'
  import BankSelect from '../../components/bankSelect.vue'
  import MyCheckbox from '../../components/Checkbox.vue'
  import config from '../../config'
  export default {
    name: "setting",
    components: {
      // MySelect,
      BankSelect,
      MyCheckbox,
    },
    data() {
      return {
        isMobile: '',
        mobile: '',
        btnText: '获取验证码',

        diableFlag: true, //disable
        LevelShow: false, //类目
        data: {
          shopCode: '',
          enaleFlagDesc: '',
          shopName: '',
          logoUrl: '',
          auditTime: '',
          mainCategory: '',
          address: '',
          shopAddress: '',
          servicePhone: '',
          entName: '',
          entFullName: '',
          entCardFrontUrl: '',
          entCardReverseUrl: '',
          entLicenseUrl: '',
          entLicenseNo: '',
          fullName: '',
          identityCard: '',
          payeeBranchId: '',
          payeeBankCardNo: '',
          payeeName: '',
          settleRate: '',
          mobile: '',
          smsCode: '',
          categoryTitle: '',
          districtId: '',
          cityId: '',
          provinceId: '',
          mainCategoryLst: [],

          shopType: 0, //认证主体（1.企业/0.个人）
        },
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
          entLicenseNo: false, // 营业执照id
          mobile:false

        },

        categroyCheckeds: [], //已经选中的类目
        bankName: '',
        secletConfig: { // 银行
          size: {
            w: '502px',
            h: '42px'
          },
          selectOptions: []
        },
        bankSecletConfig: { // 银行
          size: {
            w: '502px',
            h: '42px'
          },
          selectOptions: []
        },
        categoryLists: [], // 已经分类
        areaLists: [], // 地址
        LevelShow: false,
        FirstLevel: true, // 一级类目显示、隐藏
        SecondLevel: false, // 二级类目显示、隐藏
        areaItemChildren: [], // 二级地址
        areaSecondChildren: [], // 三级地址
        ThirdLevel: false,
        firstLevel: '请选择',
        secondLevel: '',
        thirdLevel: '',
        isDropDown: false,
        bufferCategory: [],
        isSend: true,

        isRepty: false,
        nameEmpty: false,
        isCategoryTitle: false,
        isServicePhone: false,
      }
    },
    mounted: function () {
      this.loadList();
      // 获取银行列表；
      this.getBankLists();
      this.crateUpload('#upLoad')
      /*获取一级分类*/
      this.getCategoryLists()
      // 获取地址库
      this.getAreaLists()
    },
    watch: {
      'secletConfig' () {
        if (this.data.payeeBranchId != '' && this.secletConfig.selectOptions.length != 0) {
          for (var i = 0; i < this.secletConfig.selectOptions.length; i++) {
            (this.secletConfig.selectOptions[i].Value == this.data.payeeBranchId) && (this.bankName = this.secletConfig
              .selectOptions[i].Text);
          }
        }
      },
      'data' () {
        let that = this;
        if (this.data.payeeBranchId != '' && this.secletConfig.selectOptions.length != 0) {
          for (var i = 0; i < this.secletConfig.selectOptions.length; i++) {
            (this.secletConfig.selectOptions[i].Value == this.data.payeeBranchId) && (this.bankName = this.secletConfig
              .selectOptions[i].Text);
          }
        }
        if(this.data.mainCategoryLst) {
          this.categoryLists.map(item => {
            that.data.mainCategoryLst.map(lst => {
              if(item.categoryId ==lst) {
                that.$set(item, 'isChecked', true)
              }
            })
          })
        }
      }
    },
    methods: {

      /**
       * @param {any} val
       * @param{String} errorKey
       */
      isEmpty(val, errorKey) {
        this.formTest[errorKey] = this.$utils.isEmpty(val);
      },

      async getCategoryLists() {
        const res = await fetchJson.post(api.getCategory, 'params', {})
        if (res.statusCode == 200) {
          this.categoryLists = res.responseContent;

        }
      },

      // 对店铺名称进行验证
      async getStoreNames(name) {
        const res = await fetchJson.post(api.getStoreNames, 'params', {
          name
        })
        let isrepty = false;
        if (res.statusCode == 200) {
          return res.responseContent;
          if (res.responseContent.nameDuplicateFlag == 1) {
            isrepty = true
          } else {
            isrepty = false
          }
        }
        return isrepty
      },

      // 店铺名称验证
      async testName() {
        let that = this;
        let name = that.data.shopName;
        // 发生改变时对form进行重新赋值
        // that.formTest.nameEmpty = false;
        // that.formTest.nameRepeat = false;
        name = name.replace(/(^\s*)|(\s*$)/g, ""); // 去除两端的空格
        if (name == '') {
          that.nameEmpty = true;
        } else {
          that.nameEmpty = false;
        }
        const res = await this.getStoreNames(name);
        if (res) {

          that.false = true;
        } else {
          that.isRepty = true;
        }
      },

      //
      testServicePhone(phene) {
        if (!phene || phene.length !== 11) {
          this.isServicePhone = true;
        } else {
          this.isServicePhone = false;
        }
      },

      // 类目下拉列表
      toDrop() {
        let that = this;

        this.isDropDown = !this.isDropDown; // 展开、隐藏
        if (this.categroyCheckeds.length == 0) {} else {
          that.data.mainCategoryLst = [],
            this.categroyCheckeds.map(item => {
              that.data.mainCategoryLst.push(item.categoryId)
            })
        }
      },

      // checkbox 点击
      categoryChecked(val) {
        let that = this;
        that.categroyCheckeds = [];
        let titleArr = [];
        that.data.categoryTitle = '';
        that.data.mainCategoryLst = [];
        this.categoryLists.map(item => {
          if (item.isChecked) {
            that.categroyCheckeds.push(item)
            titleArr.push(item.categoryName)
            that.data.mainCategoryLst.push(item.categoryId)
          }
        })
        that.data.categoryTitle = titleArr.join('、');
        if (titleArr.length == 0) {
          that.isCategoryTitle = true
        } else {
          that.isCategoryTitle = false
        }
        // this.model = Object.assign({}, this.model)
      },

      // 获取地址库
      async getAreaLists() {
        let areaTree = JSON.parse(localStorage.getItem('areaTree'));
        if (areaTree) {
          this.areaLists = areaTree;
        } else {
          const res = await fetchJson.post(api.areaTree, 'params', {})
          if (res.statusCode == 200) {
            this.areaLists = res.responseContent;
            localStorage.setItem('areaTree', JSON.stringify(res.responseContent));
          }
        }
      },

      /**
       *选择地址库
       *@param { Object } item
       */
      toAddress() {
        let that = this;

        this.LevelShow = !this.LevelShow;
        // this.formTest.address = false;
        if (!this.data.address) {
          // that.formTest.address = true;
        } else {
          that.data.shopAddress = that.data.address;
          // that.formTest.address = false;
        }
      },
      checkFirstLevel(item) {
        this.FirstLevel = false;
        // this.data.provinceId = item.id;
        this.areaItemChildren = item.children;
        this.bufferCategory = [];
        this.bufferCategory.push(item);
        if (this.areaItemChildren.length == 0) {
          this.LevelShow = false
          this.SecondLevel = false;
          this.FirstLevel = true;
          this.data.address = item.name
          return;
        } else {
          this.SecondLevel = true;
        }
        this.firstLevel = item.name;
      },

      checkSecondLevel(child) {
        this.SecondLevel = false;
        this.areaSecondChildren = child.children;
        if (child.children && child.children.length == 0) {
          this.firstLevel = '请选择';
          this.FirstLevel = true;

          this.LevelShow = false;
          this.bufferCategory.push(child)
          let categoryArr = [];
          this.bufferCategory.map(item => {
            categoryArr.push(item.name)
          })
          this.data.address = categoryArr.join(' — ')
        } else {
          this.bufferCategory.push(child)
          this.secondLevel = child.name;
          this.ThirdLevel = true;
        }
      },

      checkThirdLevel(lastChild) {

        this.firstLevel = '请选择';
        this.FirstLevel = true;
        this.SecondLevel = false;
        this.secondLevel = '';
        this.ThirdLevel = false;
        this.thirdLevel = '';

        this.LevelShow = false;
        this.bufferCategory.push(lastChild)
        let categoryArr = [];
        this.bufferCategory.map(item => {
          categoryArr.push(item.name)
        })
        this.data.provinceId = this.bufferCategory[0].id;
        this.data.cityId = this.bufferCategory[1].id;
        this.data.districtId = lastChild.id;
        this.data.address = categoryArr.join(' — ')
        this.data.shopAddress = this.data.address;

      },
      // 获取银行列表
      async getBankLists() {
        let res = await fetchJson.post(api.getBackList, 'params', {})
        if (res.statusCode == 200) {
          res.responseContent.map(item => {
            this.secletConfig.selectOptions.push({
              Text: item.bankName,
              Value: item.bankId
            })
            this.bankSecletConfig.selectOptions.push({
              Text: item.bankName,
              Value: item.bankId,
              Src: item.bankLogoUrl
            })
          })
        }
      },
      /**
       * 获取数据
       */
      async loadList () {
        let self = this;
        const res = await fetchJson.post(fund.getShopInfo, 'params', {})
        if (res.statusCode == 200) {
          self.data = { ...res.responseContent
          };
          self.data.mainCategory = self.data.mainCategoryList.join('，');
          self.data.shopAddress = self.data.addressNameMap.provinceName + self.data.addressNameMap.cityName + self.data
            .addressNameMap.districtName + '';
          self.data.address = res.responseContent.addressNameMap.provinceName + ' — ' + res.responseContent.addressNameMap
            .cityName + ' — ' + res.responseContent.addressNameMap.districtName;
          self.data.categoryTitle = res.responseContent.mainCategoryList.join(',') // 上次提交的主营类目的title
          self.data.mainCategoryLst = res.responseContent.mainCategoryIdList; // 上次选中的主营类目Id
          self.data.shopAddress = self.data.address;
          self.data.cityId = res.responseContent.addressIdMap.cityId;
          self.data.districtId = res.responseContent.addressIdMap.districtId;
          self.data.provinceId = res.responseContent.addressIdMap.provinceId;
        }
      },
      /**
       *修改按钮
       */
      editData() {
        let self = this
        self.diableFlag = !self.diableFlag;
      },
      /**
       *获取短信验证码
       */
      async getMsg() {

        if (!this.isSend) {
          this.$utils.layerMsg.warning('不可以频繁发送验证码')
          return;
        }
        this.mobile = JSON.parse(localStorage.getItem('userMsg')).mobile
        this.formTest.mobile = true;

        let res = await fetchJson.post(api.getemscode, 'params', {})
        if (res.statusCode == 200) {
          this.isSend = false;
          var t = 60;
          this.timer = setInterval(() => {
            if (t > 0) {
              this.btnText = t + 's后重发'
              t--
            } else {
              clearInterval(this.timer);
              this.btnText = "获取验证码";
              this.isSend = true;
            }
          }, 1000);
        }
        this.formTest = Object.assign({}, this.formTest);

      },
      // 上传
      crateUpload (elm) {
        let that = this;
        layui.use('upload', function (upload) {
          upload.render({
            method: 'POST',
            elem: elm,
            url: config.upLoad + '/file/upload-new', // 要上传的图片地址
            accept: 'images',
            field: 'file',
            size: 500,
            ext: 'jpg|png', // 那么，就只会支持这三种格式的上传。注意是用|分割。
            choose: function (obj) {
              var files = obj.pushFile();
              obj.preview(function (index, file, result) { // 预读本地文件
                // console.log(index); //得到文件索引
                // console.log(file); //得到文件对象
                // 对上传失败的单个文件重新上传，一般在某个事件中使用
                // obj.upload(index, file);
              });
            },
            done: function (res) {
              if (res.statusCode == 200) { //上传成功返回值，必须为json格式

                if (that.diableFlag) return;
                switch (elm) {
                  case '#upLoad':
                    that.data.logoUrl = res.responseContent.url;
                    break;
                }
                that.data = Object.assign({}, that.data)
              } else if (res.result == 1) {

              }
            }
          })
        })
      },
      /**
       *保存按钮
       */
      async saveData () {
        let self = this;
        let that = this;
        let isCreate = true;
        /* 先验证验证码是否正确，再提交 */
        let phoneParams = {
          phone: self.data.mobile,
          smsCode: self.data.smsCode,
        }

        if (this.$utils.isEmpty(this.data.shopName) || this.isRepty) {
          if (this.$utils.isEmpty(this.data.shopName)) {
            this.nameEmpty = true;
          }
          that.$utils.layerMsg.warning('店铺名称错误！');
          return (isCreate = false);
        }
        if (that.data.mainCategoryLst && that.data.mainCategoryLst.length == 0) {
          that.$utils.layerMsg.warning('请选择经营类目');
          that.isCategoryTitle = true;

        }

        if (!that.data.servicePhone || this.isServicePhone) {
          that.$utils.layerMsg.warning("请输入售后电话");
          that.isServicePhone = true;
          return (isCreate = false);
        }
        if (!that.data.payeeBankCardNo) {
          that.$utils.layerMsg.warning("请输入账号");
          that.formTest.payeeBankCardNo = true;
          return (isCreate = false);
        }
        if (!that.data.payeeName) {
          let title = this.data.shopType == 0 ? '请输入持卡人姓名' : '请输入公司名称';
          that.$utils.layerMsg.warning(title);
          that.formTest.payeeName = true;
          return (isCreate = false);
        }
        if (!that.data.smsCode) {
          that.$utils.layerMsg.warning('请输入验证码');
          return (isCreate = false);
        }

        if (!isCreate) return;
        let params = {
          shopName: self.data.shopName,
          logoUrl: self.data.logoUrl,
          mainCategoryLst: self.data.mainCategoryLst.join(','),
          shopAddress: self.data.shopAddress,
          servicePhone: self.data.servicePhone,
          payeeBranchId: self.data.payeeBranchId,
          payeeBankCardNo: self.data.payeeBankCardNo,
          payeeName: self.data.payeeName,
          // mobile: self.data.mobile,
          smsCode: self.data.smsCode,
          districtId: self.data.districtId,
          cityId: self.data.cityId,
          provinceId: self.data.provinceId
        }
        const res = await fetchJson.post(fund.updateShopInfo, 'params', params)
        if (res.statusCode == 200) {
          self.diableFlag = !self.diableFlag;
          this.LevelShow = false;
          self.loadList()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
 @import url('../../assets/less/variable.less');
  .nav {
    line-height: 20px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
    padding: 21px 0px;
  }

  .sj_list_content {
    border: 1px solid #E8E8E9;
    dl dt:before {
      content: "|";
      color: #FF6600;
      font-weight: bold;
      font-size: 20px;
      border-radius: 1px;
    }
    dl dt {
      line-height: 20px;
      padding-left: 10px;
      background: #f8f8f8;
      height: 40px;
      .title {
        margin: 0 16px;
        font-size: 16px;
        line-height: 40px;
        font-weight: 500;
      }
      .binding {
        color: #999;
        font-size: 14px;
      }
    }

    .row {
      height: auto;
      padding: 35px;
      background-color: white;
      display: flex;
    }
    dd {
      text-align: center;
      font-size: 14px;
    }
  }

  .row .col-3 p {
    padding: 26px 0;
    text-align: right;
  }

  dd.row .col-7 p {
    padding: 15px 30px;
  }

  dd.row .col-7 p input {
    background: #F4F5F7;
    border: 1px solid #ccc;
    border-radius: 2px;
    width: 501px;
    height: 41px;
    padding-left: 23px;
    display: block;
    line-height: 38px;
  }

  dd.row .col-7 p span {
    height: 42px;
    padding-left: 23px;
    display: block;
    line-height: 42px;
  }

  .m_logo {
    text-align: left;
  }

  .border_grey {
    border: 1px solid #E8E8E9;
  }

  dd.row .col-7 p.bank {
    position: relative;
  }

  dd.row .col-7 p.bank img {
    position: absolute;
    top: 20px;
    left: 30px;
    display: block;
    width: 31px;
    height: 31px;
    margin: 0 21px;
  }

  .p_center {
    padding-left: 37%;
    color: #999;
    font-size: 14px;
    line-height: 26px;
    background-color: white;
  }

  .p_center:last-child {
    padding-bottom: 138px
  }

  .c_red {
    color: red;
  }

  .mb_photo {
    margin-bottom: 95px;
    padding-top: 10px !important;
  }

  .flex_photo {
    display: inline-flex;
    img:first-child {
      margin-right: 58px;
    }
  }

  .col-3 {
    width: 33.33%;
  }

  .btn_orange {
    background-color: #fa8c64;
    border-radius: 2px;
    color: #fff;
    display: block;
    cursor: pointer;
    text-align: center;
  }

  .btn_pos {
    width: 80px;
    height: 30px;
    line-height: 30px;
    float: right;
    margin: 4px 10px;
    font-size: 12px;
  }

  .btn_pos1 {
    width: 220px;
    height: 50px;
    border: solid 1px #cccccc;
    font-size: 14px;
    line-height: 50px;
    margin: 0px 584px;
  }

  .input-white {
    background: #fff !important;
  }

  .btn_msg {
    width: 170px;
    height: 38px;
    background-color: #e6e6e6;
    border-radius: 2px;
    border: solid 1px #e8e8e9;
    cursor: pointer;
    position: absolute;
    top: 16px;
    right: 32px;
    line-height: 38px;
  }

  .orange {
    color: #fa8c64;
  }

  .tips {
    display: block;
    float: left;
    padding-left: 29px;
  }

  .save_btn {
    background-color: #fff;
    height: 119px;
  }

  .bank-select .layui-select-title input.layui-input {
    height: 40px !important;
  }

  .input_width {
    width: 500px;
    height: 40px;
    padding: 0px 22px;
    box-sizing: border-box;
    background: #F4F5F7
  }

  .categroy {
    position: relative;


    .dropDown {
      z-index: 1;
      position: absolute;
      right: 13px;
      top: 41px;
      padding: 10px 20px;
      width: 460px;
      overflow: hidden;
      background: @color-white;
      border: 1px solid @color-border;

      li {
        float: left;
        text-align: left;
        margin: 0 10px 0 0;
        width: 30%
      }
    }
  }

  .address {
    position: relative;
    padding: 15px;
    .dropdown {
      position: absolute;

      z-index: 1;
      left: 29px;
      border: 1px solid #E8E8E9;
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
            color: @color-orange
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

  #upLoad {
    width: 85px;
  }

  .upload_info {
    position: relative;
    color: @color-6;
    left: 140px;
    margin-top: -40px;
  }

  .item {
    position: relative;
  }

  .tips {
    position: absolute;
    top: 42px;
    left: 8px;
  }

  .category_item .tips {
    top: 57px
  }

  .row3 .f_left p {
    padding: 25px 20px !important;
  }

</style>
