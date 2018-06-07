<template>
  <div class="check">
      <div :class="['toptip',flag ? 'none' : '']">
          <img @click="changeFlag()" src="../../assets/imgs/shanchu@2x.png" alt="">
          负责声明：从前有座山，山里有座庙，庙里有个小和尚。从前有座山，山里有座庙，庙里有个小和尚。从前有座山，山里有座哈哈庙，庙里有个小和尚。
      </div>
      <div class="header clearfix">
          <div @click="changeIndex(1)" :class="[index == 1 ? 'active' : '']">
              <i>待审核</i>
          </div>
          <div @click="changeIndex(2)" :class="[index == 2 ? 'active' : '']">
              <i>已确认</i>
          </div>
          <div @click="changeIndex(3)" :class="[index == 3 ? 'active' : '']">
              <i>已否决</i>
          </div>
      </div>
      <div class="item">
          <div class="item-top">
              <p>充值人姓名：悟空</p>
              <p>充值品牌：哈哈哈</p>
              <p>充值类型：余额充值</p>
              <p>充值金额：2000</p>
              <p>充值时间：2019-09-01 13:00:00</p>
          </div>
          <div class="item-bottom"></div>
      </div>
  </div>
</template>
<script>
export default {
  name:'check',
  data(){
      return{
          index:1,
          data1:['0','2','3'],
          data2:['10','22','333'],
          data3:['30','12','33'],
          flag:false,
      }
  },
  methods:{
      changeIndex(index) {
          this.index = index;
      },
      changeFlag(){
          this.flag = !this.flag;
      }
  }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
@import '../../common/scss/base.scss';
.check{
    background-color: #f7f7f7;
    .fl{
        float: left;
    }
    .show{
        display: block !important;
    }
    .header{
        background-color: #fff;
        margin-top: 0.2rem;
        >div{
            float: left;
            width: 33.3%;
            height: 0.9rem;
            // background-color: rgba($color: #000000, $alpha: 0.1);
            position: relative;
            i{
                font-size: $font-size-medium;
                color:#333;
                height: 0.9rem;
                line-height: 0.9rem;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
            }
            &.active{
                i{
                    color: $primary-color;
                    border-bottom: 0.06rem solid $primary-color;
                }
            }
        }
    }
    .toptip{
        height: 1.5rem;
        padding: 0.2rem 0.74rem 0.2rem 0.3rem;
        background-color: #fff9e3;
        color: #f19a02;
        line-height: 0.4rem;
        font-size: $font-size-small;
        position: relative;
        img{
            width: 0.24rem;
            position: absolute;
            top: 50%;
            right: 0.3rem;
            transform: translateY(-50%);
        }
        &.none{
            display: none;
        }
    }
    .item{
        padding-top: 0.4rem;
        font-size: $font-size-medium-s;
        background-color: #fff;
        color: #333;
        .item-top{
            padding: 0 0.3rem;
            p + p {
                margin-top: 0.36rem;
            }
        }
    }
}
</style>
