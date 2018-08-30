<template>
  <div class="checkdispose">
    <div class="checkdispose-top">
      <p>姓名：{{userinfo.realName}}
        <i class="tip" @click="$router.push('/journal?id=' + userinfo.userId + '&name=' + userinfo.realName);">流转日志</i>
      </p>
      <p>
        <span>微信号：{{userinfo.user ? userinfo.user.wxId : userinfo.wxId}}</span>
      </p>
      <p>
        <span>手机号：{{userinfo.user ? userinfo.user.mobile : userinfo.mobile}}</span>
      </p>
      <p v-show="userinfo.idNo">
        <span>身份证号：{{userinfo.idNo}}</span>
      </p>
      <p v-show="userinfo.idHand">
        <span>身份证照片：</span>
      </p>
      <p style="padding: 0 0.3rem;" v-show="userinfo.idHand"><img style="max-width: 100%;float:none;" :src="formatImg(userinfo.idHand)"/><p>
      <p v-show="userinfo.idHand">
        <span>打款照片：</span>
      </p>
      <p style="padding: 0 0.3rem;" v-show="userinfo.payPdf"><img style="max-width: 100%;float:none;" :src="formatImg(userinfo.payPdf)"/><p>
      <p>区域：
        <i>{{userinfo.user ? userinfo.user.province : userinfo.province}}</i>
        <i>{{userinfo.user ? userinfo.user.city : userinfo.city}}</i>
        <i>{{userinfo.user ? userinfo.user.area : userinfo.area}}</i>
      </p>
    </div>
    <div class="checkdispose-bottom">
      <p>意向等级：<i>{{userinfo.applyLevel}}</i></p>
      <p>该等级政策：</p>
      <p>1.授权单金额：{{formatAmount(levelInfo.amount)}}</p>
      <p>2.门槛费：{{formatAmount(levelInfo.minCharge)}}</p>
      <p>3.红线金额：{{formatAmount(levelInfo.redAmount)}}</p>
      <p>4.门槛可有余额：{{formatAmount(levelInfo.minSurplus)}}</p>
      <p>5.是否启用云仓：{{getBool(levelInfo.isWare)}}</p>
    </div>
    <div class="checkdispose-bottom">
      <textarea placeholder="审核说明" :value="approveNote" style="width: 100%;" rows="3"></textarea>
    </div>
    <div class="footer">
      <span class="footer-check" @click="pass">通过</span>
      <span class="footer-back" @click="unpass">不通过</span>
    </div>
    <toast ref="mytoast" :text="text"></toast>
    <confirm ref="confirm" :text="confirmText" @confirm="handleConfirm"></confirm>
  </div>

</template>
<script>
import { accredit, upgrade, accreditCancel, getLevel, shouquandanDetail, shouquandanDetail1111 } from 'api/baohuo';
import { formatImg, formatAmount } from 'common/js/util';
import Toast from 'base/toast/toast';
import Confirm from 'base/confirm/confirm';

export default {
  name:'checkdispose',
  data(){
      return{
        index: '',
        userinfo: {},
        levelInfo: {},
        text: '',
        confirmText: '',
        approveNote: '',
        status: []
      }
  },
  methods:{
    getBool(val) {
        const dict = {
          0: '否',
          1: '是'
        };
        return dict[val];
    },
    formatAmount(amount) {
        return formatAmount(amount);
    },
    formatImg(img) {
        return formatImg(img);
    },
    pass() {
        this.showConfirm(1);
    },
    unpass() {
        this.showConfirm(0);
    },
    showConfirm(result) {
        this.result = result;
        this.confirmText = result == 1 ? '确定审核通过吗?' : '确定审核不通过吗?';
        this.$refs.confirm.show();
    },
    handleConfirm() {
        this.audit();
    },
    audit() {
      if (this.index == 6) {
        accredit(this.userId, this.result, this.approveNote).then(res => {
          if (res.isSuccess) {
            this.text = '审核成功';
            this.$refs.mytoast.show();
            setTimeout(() => {
              this.$router.back();
            }, 300);
          } else {
            this.text = '审核失败';
            this.$refs.mytoast.show();
          }
        }).catch(() => {});
        } else if(this.index == 12){
          upgrade(this.userId, this.result, this.approveNote).then(res => {
            if (res.isSuccess) {
              this.text = '审核成功';
              this.$refs.mytoast.show();
              setTimeout(() => {
                this.$router.back();
              }, 300);
            } else {
              this.text = '审核失败';
              this.$refs.mytoast.show()
            }
          }).catch(() => {});
      } else if(this.index == 8) {
        accreditCancel(this.userId, this.result, this.approveNote).then(res => {
          if (res.isSuccess) {
            this.text = '审核成功';
            this.$refs.mytoast.show();
            setTimeout(() => {
              this.$router.back();
            }, 300);
          } else {
            this.text = '审核失败';
            this.$refs.mytoast.show()
          }
        }).catch(() => {});
      }
    },
  },
  mounted(){
      this.userId = this.$route.query.id;
      this.index = this.$route.query.index;
      if(this.index == 12) {
        shouquandanDetail({
          userId: this.userId
        }).then(res => {
          this.userinfo = res;
          getLevel().then(info => {
            let levelArr = [];
            info.map((item) => {
              if(res.applyLevel === item.level) {
                this.levelInfo = item;
                this.userinfo.applyLevel = item.name;
              }
              levelArr.push({
                level: item.level,
                name: item.name
              });
            });
            this.levelArr = levelArr;
          });
        });
      } else {
        shouquandanDetail1111(this.userId).then(res => {
          this.userinfo = res;
          getLevel().then(info => {
            let levelArr = [];
            info.map((item) => {
              if(res.applyLevel === item.level) {
                this.levelInfo = item;
                this.userinfo.applyLevel = item.name;
              }
              levelArr.push({
                level: item.level,
                name: item.name
              });
            });
            this.levelArr = levelArr;
          });
        });
      }

  },
  components: {
      Toast,
      Confirm
  }
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.checkdispose {
    background-color: #f7f7f7;
    font-size: $font-size-medium;
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
      font-size: 0;
      color: #fff;
      background-color: #fff;
      >span{
          display: inline-block;
          width: 48%;
          font-size: $font-size-medium-xx;
          line-height: 0.88rem;
          text-align: center;
          border-radius: 0.1rem;
          background-color: #fff;
      }
      span + span {
          margin-left: 4%;
          color: #333;
          border: 1px solid #dedede;
      }
      .footer-check{
          background-color: $primary-color;
      }
      .footer-back{

      }
  }
}
</style>
