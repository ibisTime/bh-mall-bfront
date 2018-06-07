<template>
    <div class="login">
        <div>
            <i v-show="errors.has('username')" class="error-tip">{{errors.first('username')}}</i>
            <span>姓名</span> <input v-model="options.receiver" v-validate="'required'" type="text" name="username" placeholder="请输入姓名">
        </div>
        <div>
            <i v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</i>
            <span>手机号</span> <input v-model="options.mobile" v-validate="'required|mobile'" type="text" name="mobile" placeholder="请输入手机号">
        </div>
        <div class="area">
            <i v-show="errors.has('area')" class="error-tip">{{errors.first('area')}}</i>            
            <span>省份、市、区</span><img class="more" src="../../assets/imgs/more@2x.png" alt="">
            <city-picker class="item-input"
                        v-validate="'required'"
                        :province="options.province"
                        :city="options.city"
                        :district="options.district"
                        name="area"
                        @change="cityChange">
            </city-picker>
        </div>
        <div>
            <i v-show="errors.has('address')" class="error-tip">{{errors.first('address')}}</i>  
            <span>详细地址</span> <input v-model="options.address" v-validate="'required'" type="text" name="address" placeholder="请输入详细地址">
        </div>

        <button class="btn" @click="add">添加地址</button>
        <toast ref="mytoast" :text="text"></toast>
    </div>
</template>
<script>
import {addAddress} from 'api/baohuo'
import {getCookie} from 'common/js/cookie'
import CityPicker from 'base/city-picker/city-picker';
import toast from 'base/toast/toast'
export default {
    data(){
        return{
            level:'',
            options:{
                address:'',
                district:'',
                city:'',
                mobile:'',
                province:'',
                receiver:'',
            },
            text:'',
        }
    },
    components: {
      CityPicker,
    },
    methods:{
        cityChange(prov, city, district) {
            this.options.province = prov;
            this.options.city = city;
            this.options.district = district;
        },
        add(){
            addAddress(this.options).then(res =>{
                console.log(res.code)
                if(res.code !== '') {
                    this.text = '添加成功'
                    this.$refs.mytoast.show(this.push)
                }else{
                    this.text = '添加失败'
                    this.$refs.mytoast.show()
                }
            })
        },
        push(){
            this.$router.push('dizhi')
        }
    },

    mounted(){

    },

    components:{
        toast,
        CityPicker,
    }
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.login {
    font-size: $font-size-large-s;
    >div{
        position: relative;
        height: 1rem;
        padding: 0.3rem;
        border-bottom: 1px solid #eee;
        >i{
            position: absolute;
            top: 0.02rem;
            color: $primary-color;
            font-size: $font-size-small-ss;
        }
        span{
            display: inline-block;
            width: 2.4rem;
        }
        .more{
            width: 0.2rem;
            float: right;
        }
        .rotate{
            transform: rotateZ(90deg);
        }
        &.area{
            position: relative;
            .item-input{
                position: absolute;
                top: 0.3rem;
                left: 2.8rem;
            }
            ul{
                width: 100%;
                // background-color: red;
                position: absolute;
                top: 1rem;
                display: none;
                &.show{
                    display: block;
                }
                li{
                    width: 100%;
                    line-height: 0.7rem;
                    font-size: $font-size-medium-s;
                    text-align: center;
                    border-bottom: 1px dashed #f7f7f7;
                }
            }
        }
    }
    .btn{
        display: block;
        width: 90%;
        line-height: 0.9rem;
        margin: 4rem auto;
        background-color: $primary-color;
        color: #fff;
        text-align: center;
        border-radius: 0.1rem;
    }
}
</style>
