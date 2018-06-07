<template>
    <div class="login">
        <div>
            <i v-show="errors.has('username')" class="error-tip">{{errors.first('username')}}</i>
            <span>姓名</span> <input v-model="options.realName" v-validate="'required'" type="text" name="username" placeholder="请输入姓名">
        </div>
        <div>
            <i v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</i>
            <span>手机号</span> <input v-model="options.mobile" v-validate="'required|mobile'" type="text" name="mobile" placeholder="请输入手机号">
        </div>
        <div>
            <i v-show="errors.has('wxNum')" class="error-tip">{{errors.first('wxNum')}}</i>
            <span>微信号</span> <input v-model="options.wxId" v-validate="'required'" type="text" name="wxNum" placeholder="请输入微信号">
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
        <div class="area" @click="chooseLevel">
            <span>等级</span> <span>{{level}}</span><img class="more rotate" src="../../assets/imgs/more@2x.png" alt="">
            <ul  :class="[panelLevelShow ? 'show' : '','panel']" @click="selectLevel($event)">
                <li v-for="item in levelList" v-if="item.level != 6" :level="item.level">{{item.name}}</li>
            </ul>
        </div>
        <button class="btn" @click="apply">申请代理</button>
    </div>
</template>
<script>
import {getAppId,getAllLevel,replyAgent,_replyAgent} from 'api/baohuo'
import {isLogin, setUser, getWxMobAndCapt} from 'common/js/util';
import {getCookie} from 'common/js/cookie'
import CityPicker from 'base/city-picker/city-picker';
export default {
    data(){
        return{
            panelLevelShow:false,
            levelList:[],
            level:'',
            options:{
                address:'',
                district:'',
                city:'',
                level:'',
                mobile:'',
                province:'',
                realName:'',
                wxId:'',
                userId:'',
            },
            userReferee:'',
        }
    },
    components: {
      CityPicker,
    },
    methods:{
        apply(){
            if(this.userReferee !== '') {
                replyAgent(this.options).then(res =>{
                   this.$router.push('/login/replying')
                })
            } else {
                this.options.userReferee = this.userReferee
                _replyAgent(this.options).then(res =>{
                   this.$router.push('/login/replying')
                })
            }
        },
        changLevelShow(){
            this.panelLevelShow = !this.panelLevelShow
        },
        chooseLevel(){
            this.changLevelShow()
        },
        selectLevel(event){
            console.log(this.panelLevelShow)
            this.changLevelShow()
            this.panelLevelShow = !this.panelLevelShow
            this.options.level = event.target.getAttribute('level')
            this.level = event.target.innerHTML;
        },
        cityChange(prov, city, district) {
            this.options.province = prov;
            this.options.city = city;
            this.options.district = district;
        },
        showplace(){
            console.log(this.options)
        },
        AppId(){
            getAppId('wx_h5_access_key').then(res => {
                var appId = res.cvalue;
                console.log(appId)
                let redirectUri = encodeURIComponent(`${location.origin}?${location.hash}`);
                let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
                let suffix = '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
                setTimeout(() => {
                    location.replace(`${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`);
                }, 100);
            })
        },
    },

    mounted(){
        
        this.options.userId = this.$route.query.userId
        console.log(this.options.userId)
        this.userReferee = getCookie('userReferee')
        getAllLevel().then(res => {
            console.log(res)
            this.levelList = res.list
            this.levelList = this.levelList
        })
    },
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
            width: 2.2rem;
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
