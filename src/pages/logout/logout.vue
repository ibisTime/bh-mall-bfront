<template>
  <div class="logout">
    <div class="header">
      <img src="../../assets/imgs/dailixinxi@2x.png" alt="">
      代理信息
    </div>
    <div class="content">
      <p>姓名：{{userInfo.realName}}</p>
      <p>微信号：{{userInfo.wxId}}</p>
      <p>手机号：{{userInfo.mobile}}</p>
      <p>等级：{{userInfo.level}}</p>
      <p>余额：<i class="money">{{formatAmount(account)}}</i></p>
    </div>
    <div class="footer">
      <span @click="loginOut">申请提交</span>
    </div>
    <toast ref="mytoast" :text="text"></toast>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
import {userExit,getLevel,getAccount} from 'api/baohuo'
import { formatAmount } from 'common/js/util'
import {getUser} from 'api/user';
import toast from 'base/toast/toast'
import FullLoading from 'base/full-loading/full-loading';
export default {
  name:'logout',
  data(){
    return{
      loading: false,
      title: '正在加载...',
      userInfo:'',
      text:'',
      account:0,
    }
  },
  methods:{
    formatAmount(amount) {
      return formatAmount(amount);
    },
    loginOut(){
      this.loading = true;
      userExit().then(res => {
        this.loading = false;
        if(res.isSuccess){
          this.text = '申请成功';
          this.$refs.mytoast.show();
          setTimeout(() => {
            this.$router.back();
          }, 300);
        }else{
          this.text = '申请失败';
          this.$refs.mytoast.show()
        }
      }).catch(() => { this.loading = false })
    }
  },
  components:{
    toast,
    FullLoading
  },
  mounted(){
    this.loading = true;
    Promise.all([
      getUser(),
      getAccount()
    ]).then(([res1, res2]) => {
      getLevel(res1.level).then(info => {
        this.loading = false;
        res1.level = info[0].name;
        this.userInfo = res1;
      });
      this.account = res2.amount;
    });
  }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
  .logout{
    background-color: #f7f7f7;
    .fl{
      float: left;
    }
    .header{
      line-height: 0.7rem;
      font-size: $font-size-medium;
      color: $primary-color;
      background-color: #fff;
      border-bottom: 1px solid #eee;
      img{
        width: 0.28rem;
        margin-left: 0.3rem;
        vertical-align: text-bottom;
        margin-right: 0.08rem;
      }
    }
    .content{
      padding-left: 0.3rem;
      padding-bottom: 0.36rem;
      font-size: $font-size-medium-s;
      color: #333;
      background-color: #fff;
      overflow: hidden;
      border-bottom: 1px solid #eee;
      p{
        margin-top: 0.36rem;
      }
      .money{
        color: $primary-color;
      }
    }
    .footer{
      height: 1rem;
      position: relative;
      background-color: #fff;
      span{
        width: 1.4rem;
        height: 0.64rem;
        line-height: 0.64rem;
        text-align: center;
        border-radius: 0.1rem;
        position: absolute;
        top: 50%;
        right: 0.3rem;
        transform: translateY(-50%);
        background-color: $primary-color;
        font-size: $font-size-small;
        color: #fff;
      }
    }
  }
</style>
