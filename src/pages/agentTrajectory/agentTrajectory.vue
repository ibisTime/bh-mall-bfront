<template>
    <div class="agentTrajectory">
      <div class="header">
        <p><span>微信：</span> <i>{{info.wxId}}</i></p>
        <p><span>当前等级：</span> <i>{{level}}</i></p>
        <p><span>当前上级：</span> <i>{{highUserName}}</i></p>
        <p><span>推荐人：</span> <i>{{userRefreeName ? userRefreeName : '无'}}</i></p>
      </div>
      <div class="blank"></div>
      <div class="content">
        <div :class="['item',index !== 0 ? 'color' : '']" v-for="(item,index) in logList" :key="index">
            <div class="line"></div>
            <img src="../../assets/threshold/point01.png" alt="">
            <i></i>
            <div class="detail">
                <p class="username">{{item.realName}}</p>
                <p>{{item.applyDatetime ? item.applyDatetime : item.approveDatetime}}</p>
                <p>推荐人：{{item.userReferrerName ? item.userReferrerName : '无' }}</p>
                <p>操作人：{{item.approveName ? item.approveName : '无' }}</p>
                <span class="tip">{{status[item.status]}}</span>
            </div>
        </div>
      </div>
      <div class="backcenter">
          <span class="back" @click="$router.push('/home');">返回个人中心</span>
      </div>
      <full-loading :title="title" v-show="loading"></full-loading>
    </div>
</template>
<script>
import FullLoading from 'base/full-loading/full-loading';
import {getTrack,getLevel} from 'api/baohuo'
import {formatDate} from 'common/js/util';
import {getCookie} from 'common/js/cookie';
import {getUser,getUserById} from 'api/user';
import {status} from 'api/status';
export default {
  data(){
      return{
        info:'',
        level:'',
        highuser: '',
        logList:[],
        status:[],
        userId: '',
        highUserId: '',
        introduceName: '',
        title: '正在加载...',
        loading: false
      }
  },
  methods:{

  },
  mounted(){
      this.status = status;
      this.loading = true;
      //当前用户以及轨迹
      getTrack().then(res => {
        this.info = res;
        this.logList = res.logList;
        this.userId = res.userId;
        this.highUserName = res.highUserName;
        this.userRefreeName = res.userRefreeName;
        this.approveName = res.approveName;
        //当前等级
        getLevel(this.info.level).then(res =>{
          this.loading = false;
          this.level = res[0].name;
        });
        //遍历轨迹 重新生成轨迹数组
        this.logList.map(function(item){
            item.applyDatetime = formatDate(item.applyDatetime)
        })
      })
  },
  computed:{
  },
  components: {
    FullLoading
  }
}
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
    .agentTrajectory{
        font-size: $font-size-medium;
        .fl{
            float: left;
        }
        .header{
            height: 3.2rem;
            padding: 0.5rem 0.45rem;
            p + p{
                margin-top: 0.36rem;
            }
            p{
                span{
                    color: #666;
                }
                i{
                    color: #333;
                }
            }
        }
        .blank{
            height: 0.2rem;
            background-color: #f7f7f7;
        }
        .content{
            padding-left: 0.7rem;
            .item{
                position: relative;
                .line{
                    width: 0.04rem;
                    height: 2.65rem;
                    background-color: #f7f7f7;
                }
                img{
                    width: 0.3rem;
                    position: absolute;
                    top:50%;
                    transform: translate(-50%,-50%);
                }
                >i{
                    width: 0.3rem;
                    height: 2px;
                    position: absolute;
                    top: 50%;
                    left: 0.15rem;
                    transform: translateY(-50%);
                    background-color: #666;
                }
                .detail{
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left:0.45rem;
                    width: 5.58rem;
                    height: 2.16rem;
                    border-radius: 0.2rem;
                    background-color: #666;
                    color:#fff;
                    font-size: $font-size-small;
                    padding: 0.32rem 0.3rem;
                    .time{
                        font-size: $font-size-small-ss;
                    }
                    .tip{
                        position: absolute;
                        top: 0.32rem;
                        right: 0.3rem;
                    }
                    p + p{
                        margin-top: 0.21rem;
                        font-size: $font-size-small-ss;
                    }
                }
            }
            .color{
               .detail{
                    background-color: #f0f0f0 !important;
               }
                >i{
                    background-color: #f0f0f0 !important;
                }
                .username{
                    color: #333 !important;
                }
                p{
                    color: #999 !important;
                }
                .tip{
                    color: #333 !important;
                }
            }
        }
        .backcenter{
            margin-top: 1rem;
            margin-left: 0.7rem;
            width: 6rem;
            height: 0.89rem;
            line-height: 0.89rem;
            text-align: center;
            background-color: $primary-color;
            border-radius: 0.1rem;
            color: #fafafa;
            span{
                font-size: $font-size-medium-xx;
            }
        }
    }
</style>
