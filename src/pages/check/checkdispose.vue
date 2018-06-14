<template>
    <div class="checkdispose">
        <div class="checkdispose-top">
            <p>姓名：{{userinfo.realName}}
                <i class="tip" @click="$router.push('/journal?id=' + userinfo.userId + '&name=' + userinfo.realName);">流转日志</i>
            </p>
            <p>
                <span>微信号：{{userinfo.wxId}}</span>
            </p>
            <p>
                <span>手机号：{{userinfo.mobile}}</span>
            </p>
            <p>区域：
                <i>{{userinfo.province}}</i>
                <i>{{userinfo.city}}</i>
                <i>{{userinfo.area}}</i>
            </p>
        </div>
        <div class="checkdispose-bottom">
            <p>意向等级：<i>{{userinfo.applyLevel}}</i></p>
            <p>该等级政策：</p>
            <p>1.门槛非同20000，天王盖地虎</p>
            <p>2.天王盖地虎，小鸡炖蘑菇。</p>
            <p>3.天王盖地虎，小鸡炖蘑菇。</p>
        </div>
        <div class="footer">
            <span class="footer-check" @click="audit">审核</span>
            <span class="footer-back" @click="$router.push('/check')">返回</span>
        </div>
    </div>
</template>
<script>
import {accredit,upgrade,accreditCancel,getLevel} from 'api/baohuo'
import {getUserById} from 'api/user'
import toast from 'base/toast/toast'
export default {
  name:'checkdispose',
  data(){
      return{
          index:'',
          userinfo:'',
          text:'',
      }
  },
  methods:{
      audit(){
          if(this.index == 6) {
              accredit(this.userId).then(res => {
                    if(res.isSuccess){
                       alert('审核成功');
                       this.$router.go(-1);
                    }else{
                       alert('审核失败');
                    }
              })
          }else if(index == 12){
              upgrade(this.userId).then(res => {
                    if(res.isSuccess){
                        this.text = '审核成功'
                        this.$refs.mytoast.show()
                    }else{
                        this.text = '审核失败'
                        this.$refs.mytoast.show()
                    }

              })
          }else if(this.index == 8) {
              accreditCancel(userId).then(res => {
                    if(res.isSuccess){
                        this.text = '审核成功'
                        this.$refs.mytoast.show()
                    }else{
                        this.text = '审核失败'
                        this.$refs.mytoast.show()
                    }
                  
              })
          }
      },
  },
  mounted(){
        this.userId = this.$route.query.id
        this.index = this.$route.query.index
        getUserById(this.userId).then(res => {
            this.userinfo = res
            getLevel(res.applyLevel).then(info => {
                res.applyLevel = info[0].name
            })
        })
  },
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.checkdispose {
    background-color: #f7f7f7;
    font-size: $font-size-small;
  .checkdispose-top {
    margin-top: 0.2rem;
    padding: 0.3rem;
    background-color: #fff;
    p + p {
      margin-top: 0.36rem;
    }
    .tip {
        width: 1.4rem;
        height: 0.54rem;
        line-height: 0.54rem;
        float: right;
        background-color: $primary-color;
        border-radius: 0.2rem;
        color: #fff;
        text-align: center;
    }
    .tel {
      margin-left: 1.1rem;
    }
    img {
      float: right;
    }
  }
  .checkdispose-bottom{
        padding: 0.3rem;
        margin-top: 0.2rem;
        background-color: #fff;
        p + p {
            margin-top: 0.36rem;
        }
  }
  .footer{
      padding: 0.4rem 0.3rem;
      font-size: $font-size-medium-xx;
      color: #fff;
      background-color: #fff;
      >span{
          display: block;
          line-height: 0.88rem;
          text-align: center;
          border-radius: 0.1rem;
          background-color: #fff;
      }
      span + span {
          margin-top: 0.3rem;
          color: #333;
          border: 1px solid #dedede;
      }
      .footer-check{
          background-color: $primary-color;
      }
      .footer-back{
          display: none;
      }
  }
}
</style>
