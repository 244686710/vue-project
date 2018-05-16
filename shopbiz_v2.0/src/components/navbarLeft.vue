<!--
    标题：侧边栏导航条
    作者：273714068@qq.com
    时间：2017-11-13
    描述：本项目系在原项目基础上重构，因时间有限，部分内容没有进行模块化处理，后续开发需要根据需要进行模块化
    备注：导航选中状态通过获取当前页面路由控制，变量为currentRouter，需要同时在created生命周期钩子以及路由监听中监听当前路由
-->
<template>
  <div class="navbar_left">
    <div class="navbar_left_slide navbar">
      <ul class="layui-nav layui-nav-tree layui-nav-side" lay-filter="navbar">
        <li class="layui-nav-item capital">
          <a href="javascript:;">
            <i class="f_left icon-mystore icon"></i>店铺</a>
          <dl class="layui-nav-child">
            <dd>
              <i></i>
              <router-link :to="{path:'/shop'}" class="interval" tag="a">素材管理</router-link>
            </dd>
          </dl>
        </li>
        <li class="layui-nav-item capital">
          <a href="javascript:;">
            <i class="f_left icon-product icon"></i> 商品</a>
          <dl class="layui-nav-child">
            <dd>
              <i></i>
              <router-link :to="{path:'/goodManage'}" class="interval" tag="a">全部商品</router-link>
            </dd>
            <dd>
              <i></i>
              <router-link :to="{path:'/goodEdit', query:{goodsId:0}}" class="interval" tag="a">发布商品</router-link>
            </dd>
            <dd>
              <i></i>
              <router-link :to="{path:'/goodPublish'}" class="interval" tag="a">品类管理</router-link>
            </dd>
            <dd v-show="isFlag == 1">
              <i></i>
              <router-link :to="{path:'/marketList'}" class="interval" tag="a">我要分销</router-link>
            </dd>
          </dl>
        </li>
        <li class="layui-nav-item capital">
          <a href="javascript:;">
            <i class="f_left icon-delivey icon"></i>配送</a>
          <dl class="layui-nav-child">
            <dd>
              <i></i>
              <router-link :to="{path:'/delivery'}" class="interval" tag="a">邮费模板</router-link>
            </dd>
          </dl>
        </li>
        <li class="layui-nav-item capital">
          <a href="javascript:;">
            <i class="f_left icon-order icon"></i>订单</a>
          <dl class="layui-nav-child">
            <dd>
              <i></i>
              <router-link :to="{path:'/order'}" class="interval" tag="a">全部订单</router-link>
            </dd>
            <dd>
              <i></i>
              <router-link :to="{path:'/afterSale'}" class="interval" tag="a">维权订单</router-link>
            </dd>
            <dd>
              <i></i>
              <router-link :to="{path:'/orderEstimate'}" class="interval" tag="a">订单评价</router-link>
            </dd>
            <dd>
              <i></i>
              <router-link :to="{path:'/orderSet'}" class="interval" tag="a">订单设置</router-link>
            </dd>
          </dl>
        </li>
        <li class="layui-nav-item capital">
          <a href="javascript:;">
            <i class="f_left icon-vip-default icon"></i>会员</a>
          <dl class="layui-nav-child">
            <dd>

              <router-link :to="{path:'/vip'}" class="interval" tag="a">会员管理</router-link>
            </dd>
          </dl>
        </li>
        <li class="layui-nav-item capital">
          <a href="javascript:;">
            <i class="f_left icon-fund icon"></i>资金</a>
          <dl class="layui-nav-child">
            <dd>
              <i></i>
              <router-link :to="{path:'/fund'}" class="interval" tag="a">资金概况</router-link>
            </dd>
            <dd>
              <i></i>
              <router-link :to="{path:'/fundDetial'}" class="interval" tag="a">收支明细</router-link>
            </dd>
            <dd>
              <i></i>
              <router-link :to="{path:'/fundCheck'}" class="interval" tag="a">对账单</router-link>
            </dd>
          </dl>
        </li>
        <li class="layui-nav-item capital">
          <a href="javascript:;">
            <i class="icon-set f_left icon"></i>设置</a>
          <dl class="layui-nav-child">
            <dd>
              <i></i>
              <router-link :to="{path:'/setting'}" class="interval" tag="a">店铺资料</router-link>
            </dd>
          </dl>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'navbarLeft',
    props: [ 'isFlag' ],
    data() {
      return {
        currentRouter: '', // 当前路由是否被选中
      }
    },
    created: function () {
      // 获取当前页面路由（刷新的时候有效）
      this.currentRouter = this.$router.toUrl
      layui.use('element', function () {
        // 监听导航点击
        var element = layui.element;
        element.init();
        element.on('nav(navbar)', function (elem) {
          if ($(elem).hasClass("layui-nav-item") && $(elem).attr("tagName") != "DD") {
            $(".layui-nav-itemed").removeClass("layui-nav-itemed")
          }

        })
        $(".layui-nav-item").click(function () {
          $(this).siblings().removeClass("layui-nav-itemed");
        });

      });
      // 查看分销状态

    },

    // 监听路由的路径，来切换侧边栏导航栏选中状态（切换路由有效，刷新页面需要在created钩子中获取）
    watch: {
      '$route' (to, from) {
        this.currentRouter = to.path
      }
    }
  }

</script>

<style lang="less" scoped="">
  @import url('../assets/less/variable.less');
  /*导航栏样式*/

  .icon {
    margin-top: 20px;
    margin-right: 26px;
  }

  .interval {
    margin-left: 60px;
  }

  .navbar_left {
    .navbar {
      .layui-nav-tree {
        margin-top: 70px;
        background: @color-nav-bg;
        .layui-nav-item {
          a {
            color: @color-white;
            height: 60px;
            line-height: 60px;
            ;
            font-size: 14px;
            padding-left: 14px;
            background-position: 14px 20px;
          }
        }
        .layui-nav-itemed {
          >a {
            background: @color-nav-select;
            color: @color-orange!important;
          }
          >dl.layui-nav-child {
            background: @color-nav-bg!important;
            dd {
              i {
                position: absolute;
                top: 28px;
                left: 45px;
                line-height: 60px;
                width: 4px;
                height: 4px;
                border-radius: 100%;
                background: @color-white;
              }
            }
            dd.layui-this {
              background: @color-nav-bg;
              i {
                background: @color-orange;
              }
              a {
                background: @color-nav-bg;
                color: @color-orange;
              }
            }
          }
        }
        .layui-nav-bar {
          width: 2px;
          background-color: @color-orange!important;
        }
      }
    }
  }

</style>
