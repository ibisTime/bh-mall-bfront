<template>
    <div class="acceptimg">
      <img :src="urlImg" alt="">
      <div class="text">
        <span class="code">{{code}}</span>
        <span class="name">{{name}}</span>
        <span class="wxId">{{wxId}}</span>
        <span class="level">{{level}}</span>
        <span class="impowerDatetime">{{impowerDatetime}}</span>
        <span class="shouquanfang">{{shouquanfang}}</span>
      </div>
    </div>
</template>
<script>
import { getAcceptImg } from 'api/baohuo'
import { getUserById } from 'api/user'
import { formatImg, formatDateDate } from 'common/js/util'
export default {
    data(){
        return{
            urlImg:'',
            name: '',
            wxId: '',
            impowerDatetime: '',
            shouquanfang: '',
            level: '',
            code: ''
        }
    },
    mounted(){
        getAcceptImg('impower_pdf').then(res => {
            // this.urlImg = res.cvalue
            this.urlImg = formatImg(res.cvalue);
            getUserById(sessionStorage.getItem('userId')).then((data) => {
              this.code = data.userId;
              this.name = data.realName;
              this.wxId = data.wxId;
              this.impowerDatetime = formatDateDate(data.impowerDatetime, 'yyyy/MM/dd');
              this.shouquanfang = '杭州麦记科技有限公司';
              this.level = data.levelName;
            })
        })
    }
}
</script>
<style lang="scss" scoped>
    .acceptimg{
        position: relative;
        img{
            width: 100%;
        }
        span {
          font-size: 0.35rem;
          z-index: 33;
          position: absolute;
        }
        .code {
          margin-top: -7.6rem;
          margin-left: 2.7rem;
        }
        .name {
          margin-top: -7.1rem;
          margin-left: 3rem;
        }
        .wxId {
          margin-top: -6.6rem;
          margin-left: 3rem;
        }
        .shouquanfang {
          font-size: 0.02rem;
          margin-top: -2.5rem;
          white-space: nowrap;
          transform: scale(0.9);
          -ms-transform: scale(0.9);
          -webkit-transform: scale(0.9);
          margin-left: 3.4rem;
        }
        .impowerDatetime {
          font-size: 0.02rem;
          margin-top: -2.8rem;
          white-space: nowrap;
          transform: scale(0.9);
          -ms-transform: scale(0.9);
          -webkit-transform: scale(0.9);
          margin-left: 3.5rem;
        }
        .level {
          color: white;
          font-size: 0.3rem;
          margin-left: 3.5rem;
          margin-top: -4.5rem;
        }
    }
</style>
