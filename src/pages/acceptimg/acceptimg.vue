<template>
    <div class="acceptimg">
      <img :src="urlImg" alt="">
      <div class="text">
        <span class="code">{{code}}</span>
        <span class="name">{{name}}</span>
        <span class="wxId">{{wxId}}</span>
        <span class="level">{{level}}</span>
        <span class="impowerDatetime">{{impowerDatetime.time}}</span>
        <span class="shouquanfang">{{shouquanfang.quanfang}}</span>
      </div>
    </div>
</template>
<script>
import { getAcceptImg, getLevel } from 'api/baohuo'
import { getUserById } from 'api/user'
import { formatImg, formatDateDate } from 'common/js/util'
export default {
    data(){
        return{
            urlImg:'',
            name: '',
            wxId: '',
            impowerDatetime: {
                time: ''
            },
            shouquanfang: {
                quanfang: ''
            },
            level: '',
            code: ''
        }
    },
    mounted(){
      Promise.all([
        getAcceptImg('impower_pdf'),
        getUserById(sessionStorage.getItem('userId')),
        getLevel()
      ]).then(([data1, data2, data3]) => {
        this.urlImg = formatImg(data1.cvalue);
        this.code = data2.userId;
        this.name = data2.realName;
        this.wxId = data2.wxId;
        this.$set(this.impowerDatetime, 'time', formatDateDate(data2.impowerDatetime, 'yyyy/MM/dd'));
        this.$set(this.shouquanfang, 'quanfang', '杭州麦记科技有限公司');
        data3.map((item) => {
          if(item.level === data2.level) {
            this.level = item.name;
          }
        });
        this.loadingFlag = false;
      }).catch(() => {});
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
          font-size: 0.01rem;
          margin-top: -2.5rem;
          white-space: nowrap;
          /*transform: scale(0.9);*/
          /*-ms-transform: scale(0.9);*/
          /*-webkit-transform: scale(0.9);*/
          margin-left: 3.4rem;
        }
        .impowerDatetime {
          font-size: 0.01rem;
          margin-top: -2.8rem;
          white-space: nowrap;
          transform: scale(0.8);
          -ms-transform: scale(0.8);
          -webkit-transform: scale(0.8);
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
