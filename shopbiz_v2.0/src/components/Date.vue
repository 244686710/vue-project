<template>
    <input type="text" class="layui-input" :id="dateId" @click="changeDate(dateId)" :placeholder="placeholder" readonly v-model="currentValue">
</template>
<script>
    export default {
        name: 'Date',
        props: ['isEnd','value', 'isTime', 'dateFormat', 'placeholder'],
        data() {
            return {
                dateId: 'laydate_' + Math.random() * Date.now(), // 确保id 唯一
                currentValue: this.value
            }
        },
        mounted() {
            this.changeDate(this.dateId);
        },
        methods: {
            changeDate(dateId) {
                let self = this;
                layui.use('laydate', function() {
                    var laydate = layui.laydate;
                    laydate.render({
                        elem: document.getElementById(dateId),
                        // istime: self.isTime || false,
                        format: self.dateFormat || 'yyyy-MM-dd',
                        istime: self.isTime,
                        type: "datetime",
                        theme: '#FA8C64',
                        done: function(dates) { //选择好日期的回调
                            //调用组件，需要添加isEnd参数，isEnd为true，则为结束时间，如果结束时间未选择时间，那么就默认改为23:59:59
                            var dateArr = dates.split(" ");
                            self.currentValue = !self.isEnd ?
                                dates :
                                dateArr[1] != "00:00:00" ?
                                dates :
                                dateArr[0] + " 23:59:59";
                        }
                    })
                })
            },

            resetDate() {
                this.currentValue = '';
                this.$emit('input', '');
            }
        },
        watch: {
            value(val) {
                // console.log('value：'+val)
                this.currentValue = val;
            },
            currentValue(val) {
                // console.log('currentValue：'+val)
                this.$emit('input', val);
            }
        }
    }
</script>
<style lang="less" scoped>
    input {
        line-height: 1 !important; // 百度浏览器，在input设置line-height: 30px； 存在兼容问题，清除兼容样式影响
    }
</style>