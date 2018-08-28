<template>
  <div class="subAgent">
      <div class="header clearfix">
        <div class="header-select fl" @click="changeLevelShow">
            {{selectText}}
            <img src="../../assets/subAgent/select.png" alt="">
            <div :class="['level',levelShow ? 'show' : '']">
                <span @click="changeSelect($event)" v-for="(item,index) in levelArr" v-if="item.level != 6" :key="index" :level="item.level">{{item.name}}</span>
            </div>
        </div>
        <div class="header-search fl">
            <img src="../../assets/subAgent/search.png" alt="">
            <input v-model="inputText" type="text" placeholder="请输入代理信息">
        </div>
        <div class="header-button fl" @click="getMysub">
            搜索
        </div>
      </div>
      <div class="container">
          <div class="item" v-for="item in list">
              <div class="item-left">
                  <img :src="item.photo" alt="">
                  <div class="userinfo">
                      <p class="username">{{item.realName}}</p>
                      <p class="usertel">{{item.mobile}}</p>
                  </div>
              </div>
              <div class="item-right">
                  <span>微信号：{{item.wxId}}</span>
                  <span>当前等级：{{item.level}}</span>
                  <span>当前余额：{{formatAmount(item.amount)}}</span>
                  <span>授权时间：{{item.approveDatetime}}</span>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import { getTrack, getLevel, getAllLevel, getLevelSub, getKeywordSub, getBill } from 'api/baohuo'
import { setCookie, getCookie } from 'common/js/cookie';
import { formatDate, formatAmount } from 'common/js/util';
import { getUser, getUserById } from 'api/user';
export default {
  name: 'subAgent',
  data() {
      return{
          levelShow : false,
          selectText:'请选择等级',
          levelArr:[],
          inputText:'',
          list:[],
      }
  },
  methods: {
      formatAmount(amount) {
          return formatAmount(amount);
      },
      //变化等级是否显示
      changeLevelShow() {
          this.levelShow = !this.levelShow
      },
      //选择等级
      changeSelect(event) {
          this.selectText = event.target.innerText;
          console.dir(event.target.getAttribute('level'))
          var level = event.target.getAttribute('level')

          //根据所选等级查询我的下级
          getLevelSub(level).then(res => {
              res.list.map(function(item){
                    //格式化时间
                    item.approveDatetime = formatDate(item.approveDatetime)

                    //数字等级转化文字等级
                    getLevel(item.level).then(res => {
                        item.level = res[0].name
                    })

                    //查询用户余额
                    getBill(item.userId).then(res => {
                        item.amount = res[0].amount
                    })
              })

              this.list = res.list
          })
      },
      //根据我的下级查询我的下级
      getMysub() {
          getKeywordSub(this.inputText).then(res => {
              res.list.map(function(item){
                  //格式化时间
                  item.approveDatetime = formatDate(item.approveDatetime)
                  //数字等级转化文字等级
                  getLevel(item.level).then(res => {
                      item.level = res[0].name
                  });
                  //查询用户余额
                  getBill(item.userId).then(res => {
                      item.amount = res.length ? res[0].amount : '';
                  });
              });
              this.list = res.list;
          });
      }
  },
  mounted(){
      getUser().then(res => {
          getAllLevel(res.level).then(res => {
              this.levelArr = res.list
          })
      })
      this.getMysub();
      //获取全部等级
  },
  computed:{
      proList:function(){

          //格式化时间
          this.list.map(function(item) {
              item.approveDatetime = formatDate(item.approveDatetime)
          })

          //数字等级转化文字等级
          this.list.map(function(item) {
              item.level = getLevel(item.level).then(res => {
                  item.level = res[0].name
              })
          })
      },
  }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
@import '../../common/scss/base.scss';
    .subAgent{
        background-color: #f7f7f7;
        .fl{
            float: left;
        }
        .header{
            padding: 0.16rem 0;
            border-bottom: 1px solid #eee;
            background-color: #fff;
            .header-select{
                margin-left: 0.3rem;
                width: 1.7rem;
                height: 0.54rem;
                line-height: 0.54rem;
                border-radius: 0.1rem;
                padding: 0 0.1rem;
                border: 1px solid #dedede;
                font-size: $font-size-small-ss;
                color: #2e2e2e;
                position: relative;
                img{
                    position: absolute;
                    top: 50%;
                    right: 0.1rem;
                    transform: translateY(-50%);
                }
                .level{
                    position: absolute;
                    top: 0.54rem;
                    left: 0;
                    display: none;
                    z-index: 11;
                    background-color: rgba($color: #000000, $alpha: 0.7);
                    color: #ddd;
                    &.show{
                        display: block;
                    }
                    span{
                        width: 1.7rem;
                        display: block;
                        line-height: 0.5rem;
                        text-align: center;
                        border: 1px solid #eee;
                        border-top: none;
                    }
                }
            }
            .header-search{
                margin-left: 0.2rem;
                width: 4.1rem;
                height: 0.54rem;
                border-radius: 0.1rem;
                border: 1px solid #dedede;
                position: relative;
                img{
                    width: 0.3rem;
                    position: absolute;
                    top: 50%;
                    left: 0.2rem;
                    transform: translateY(-50%);
                }
                input{
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 0.6rem;
                    font-size: $font-size-small-ss;
                    color: #333;
                }
            }
            .header-button{
                width: 0.9rem;
                height: 0.54rem;
                line-height: 0.54rem;
                padding-left: 0.2rem;
                font-size: $font-size-small;
                color: #2e2e2e;
            }
        }
        .container{
            .item{
                background-color: #fff;
                .item-left{
                    float: left;
                    width: 3.3rem;
                    height: 2.6rem;
                    padding-left: 0.3rem;
                    position: relative;
                    img{
                        width: 0.7rem;
                        position: absolute;
                        top: 50%;
                        left: 0.3rem;
                        transform: translateY(-50%);
                    }
                    .userinfo{
                        position: absolute;
                        top: 50%;
                        left: 1.2rem;
                        transform: translateY(-50%);
                        .username{
                            font-size: $font-size-medium-s;
                            color: #333;
                        }
                        .usertel{
                            margin-top: 0.18rem;
                            font-size: $font-size-small-s;
                            color: #999;
                        }
                    }
                }
                .item-right{
                    height: 2.6rem;
                    // background-color: #000;
                    margin-left: 3.3rem;
                    padding: 0.12rem 0;
                    span{
                        display: block;
                        line-height: 0.58rem;
                        font-size: $font-size-small-s;
                        color: #333;

                    }
                    span + span {
                        border-top: 1px dashed #dedede;
                    }
                }
            }
            .item + .item{
                margin-top: 0.2rem;
            }
        }
    }
</style>
