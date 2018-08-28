<template>
    <div class="sucaichaxun">
        <div class="header clearfix">
            <div>
                <i>{{title}}</i>
            </div>
        </div>
        <div class="container">
            <div class="item">
                <img :src="pic">
            </div>
        </div>
    </div>
</template>
<script>
import { sucaiDetail } from 'api/baohuo';
import { getUser } from 'api/user';
import {formatDate,formatImg} from 'common/js/util';
export default {
    data(){
      return{
        title: '',
        pic: ''
      }
    },
    methods:{
      changeIndex(num) {
        this.num = num;
        this.check(this.level)
      },
      check(level){
        queryFodder(this.num).then(res => {
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
        })
      },
      goSucaiDetail(code) {

      }
    },
    mounted(){
      let code = this.$route.query.code;
      Promise.all([
        sucaiDetail(code)
      ]).then(([res]) => {
        this.title = res.title;
        this.pic = formatImg(res.pic);
      });
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
                width: 100%;
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
                    width: 100%;
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
