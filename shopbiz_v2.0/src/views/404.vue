<!--
    标题：错误页面
    作者：273714068@qq.com
    时间：2017-11-13
    描述：本项目系在原项目基础上重构，因时间有限，部分内容没有进行模块化处理，后续开发需要根据需要进行模块化
-->
<template>
    <img src="../assets/img/404.png">
</template>

<script>
    export default {
        name: 'error',
        data() {
            return {
                currentRouter:''//当前路由是否被选中
            }
        },
        created: function() {
            
        },mounted:function(){
            console.log(name=="")
        }
    }
</script>

<style>
</style>