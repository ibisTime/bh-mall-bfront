<template>
  <div class="sucaichaxun">
    <div class="header clearfix">
      <div @click="changeIndex(item.dkey)" :class="[num == item.dkey ? 'active' : '']" v-for="(item,index) in list">
        <i>{{item.dvalue}}</i>
      </div>
    </div>
    <div class="container">
      <div class="item" v-for="v in shopList" @click="goSucaiDetail(v.code)">
        <img :src="v.pic">
        <p>{{v.title}}</p>
      </div>
    </div>
    <full-loading :title="title" v-show="loading"></full-loading>
  </div>
</template>
<script>
import FullLoading from 'base/full-loading/full-loading';
import {queryFodder,queryFodderName} from 'api/baohuo';
import { getUser } from 'api/user';
import {formatDate,formatImg} from 'common/js/util';
export default {
  data(){
    return{
      loading: false,
      title: '正在加载...',
      num:0,
      list:[],
      shopList:[]
    }
  },
  methods:{
    changeIndex(num) {
      this.num = num;
      this.check(this.level)
    },
    check(level){
      this.loading = true;
      queryFodder(this.num).then(res => {
        this.loading = false;
        let shopList = [];
          res.list.map((item) => {
            // debugger;
            this.levelFlag = false;
            let levelArr = item.level.split(','); // [1,2]
            levelArr.map((v) => {
              if(v == level && item.status) {
                item.pic = formatImg(item.pic);
                shopList.push(item);
              }
            });
          });
        this.shopList = shopList;
      }).catch(() => { this.loading = false })
    },
    goSucaiDetail(code) {
      this.$router.push('/sucaichaxun/sucaiDetail?code=' + code);
    }
  },
  mounted(){
    this.loading = true;
    Promise.all([
      queryFodderName(),
      getUser()
    ]).then(([res1, res2]) => {
      this.loading = false;
      this.list = res1;
      this.level = res2.level;
      this.check(this.level);
    }).catch(() => { this.loading = false });
  },
  components: {
    FullLoading
  }

}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
@import "../../common/scss/base.scss";
    .sucaichaxun{
        background-color: #f7f7f7;
        .header{
            background-color: #fff;
            >div{
                float: left;
                width: 50%;
                height: 0.9rem;
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
        .container{
            // padding: 0.3rem;
            overflow: hidden;
            background-color: #fff;
            .item{
                float: left;
                margin-top: 0.3rem;
                margin-left: 0.3rem;
                >img{
                    width: 3.3rem;
                    height: 3.3rem;
                }
                p{
                    margin-top: 0.3rem;
                    font-size: $font-size-medium-s;
                    color: #333;
                    text-align: center;
                }
            }
        }
    }
</style>
