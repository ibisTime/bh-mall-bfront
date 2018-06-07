<template>
    <div class="loginAwait">
        <!-- <input type="text" :value="code"> -->
        <loading></loading>
    </div>
</template>
<script>
import {getAppId,usergo} from 'api/baohuo'
import {isLogin, setUser, getWxMobAndCapt} from 'common/js/util'
import {setCookie,getCookie} from 'common/js/cookie'
import loading from 'base/loading/loading'
export default {
    data(){
        return{
            code:'',
            info: '',
            userReferee: ''
        }
    },
    
    methods:{
        //获取用户微信code
        AppId() {
            //获取用户appid 
            getAppId('wx_h5_access_key').then(res => {
                var appId = res.cvalue;
                
                //获取当前地址
                let redirectUri = encodeURIComponent(`${location.origin}?${location.hash}&userReferee=${this.userReferee}`);
                let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
                let suffix = '&response_type=code&scope=snsapi_userinfo#wechat_redirect';

                //发送微信网页授权地址，由此获取code
                setTimeout(() => {
                    location.replace(`${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`);
                }, 100);
            })
        },

        //根据用户状态进入别的页面
        toOther() {
            // alert(this.userReferee);
            usergo(this.code, this.userReferee).then(info => {
                this.info = info
                var userId = info.userId
                setCookie('status', info.status)
                //1,2禁止登陆
                if (info.status == 1 || info.status == 2) {
                    alert('对不起，你被禁登录')
                } else if (info.status == 3) {
                    this.$router.push('/login/login?userId=' + userId)
                } else if (info.status == 0){
                    this.$router.push('/home?userId=' + userId)
                    //6申请中
                } else if (info.status == 6) {
                    this.$router.push('/login/replying')
                    //10没通过
                } else if (info.status == 10) {
                    this.$router.push('/login/replying')
                } else {
                    this.$router.push('/login/login?userId=' + userId)
                }
                
            })
        }
    },

    mounted(){
        // let userReferee = this.$route.query.userReferee;
        // var newUrl = location.href;
        // alert(newUrl);
        // let userReferee = newUrl.slice('=')[1];
        // alert(userReferee);
        // this.userReferee = userReferee;
        // setCookie('userReferee',userReferee)
        // alert(location.href);
        if (!isLogin()) {
            if(/userReferee=([^&]+)&code=([^&]+)&state=/.exec(location.href)) {
                this.userReferee = RegExp.$1;
                this.code = RegExp.$2;
                this.toOther()
            } else if (/userReferee=([^&$]+)/.exec(location.href)) {
                this.userReferee = RegExp.$1;
                this.AppId();
            } else {
                this.AppId();
            }
        }else {
            let status = getCookie('status')
            if(status == 1 || status == 2) {
                alert('对不起 你被禁登录')
            } else if(status == 3) {
                this.$router.push('/login/login')
            } else if(status == 0){
                this.$router.push('/home')
                //6申请中
            } else if(status == 6) {
                this.$router.push('/login/replying')
                //10没通过
            } else if(status == 10) {
                this.$router.push('/login/replying')
            } else {
                this.$router.push('/login/login')
            }
        }
    },
    components:{
        loading,
    }
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.loginAwait {
    font-size: 0.3rem;
    padding: 0.3rem;
    input{
      width: 100%;
    }
}
</style>
