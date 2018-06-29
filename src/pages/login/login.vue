<template>
    <div class="login">
        <div>
            <i v-show="errors.has('username')" class="error-tip">{{errors.first('username')}}</i>
            <span>姓名</span> <input class="pl2rem" v-model="options.realName" v-validate="'required'" type="text" name="username" placeholder="请输入姓名">
        </div>
        <div>
            <i v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</i>
            <span>手机号</span> <input class="pl2rem" v-model="options.mobile" v-validate="'required|mobile'" type="text" name="mobile" placeholder="请输入手机号">
        </div>
        <div>
            <i v-show="errors.has('wxNum')" class="error-tip">{{errors.first('wxNum')}}</i>
            <span>微信号</span> <input class="pl2rem" v-model="options.wxId" v-validate="'required'" type="text" name="wxNum" placeholder="请输入微信号">
        </div>
        <div class="area">
            <i v-show="errors.has('area')" class="error-tip">{{errors.first('area')}}</i>
            <span>省份、市、区</span>
            <city-picker class="item-input pl2rem"
                        :province="options.province"
                        :city="options.city"
                        :district="options.district"
                        name="area"
                        @change="cityChange">
            </city-picker>
            <img class="more" src="../../assets/imgs/more@2x.png" alt="">
        </div>
        <div>
            <i v-show="errors.has('address')" class="error-tip">{{errors.first('address')}}</i>
            <span>详细地址</span> <input class="pl2rem" v-model="options.address" v-validate="'required'" type="text" name="address" placeholder="请输入详细地址">
        </div>
        <div class="area">
            <i v-show="errors.has('applyLevel')" class="error-tip">{{errors.first('applyLevel')}}</i>
            <span>等级</span><div class="pl2rem item-input">{{level}}</div>
            <select v-validate="'required'" name="applyLevel" v-model="options.applyLevel" @change="chooseLevel">
              <option v-for="item in levelList" :value="item.level" v-if="item.level != 6">{{item.name}}</option>
            </select>
            <img class="more" src="../../assets/imgs/more@2x.png" alt="">
        </div>
        <div class="area">
            <i v-show="errors.has('fromInfo')" class="error-tip">{{errors.first('fromInfo')}}</i>
            <span>意向来源</span><span class="pl2rem item-input">{{fromInfo}}</span>
            <select v-validate="'required'" name="fromInfo" v-model="options.fromInfo" @change="chooseFrom">
              <option v-for="item in fromList" :value="item.dkey">{{item.dvalue}}</option>
            </select>
            <img class="more" src="../../assets/imgs/more@2x.png" alt="">
        </div>
        <button class="btn" @click="apply">申请代理</button>
        <toast ref="toast" :text="text"></toast>
        <full-loading :title="title" v-show="loading"></full-loading>
    </div>
</template>
<script>
import { getAppId, getAllLevel, replyAgent, _replyAgent } from "api/baohuo";
import { getDictList } from 'api/general';
import { getUser } from 'api/user';
import { isLogin, setUser, getWxMobAndCapt } from "common/js/util";
import { setCookie } from "common/js/cookie";
import CityPicker from "base/city-picker/city-picker";
import FullLoading from 'base/full-loading/full-loading';
import Toast from "base/toast/toast";

export default {
  data() {
    return {
      loading: true,
      title: '正在载入...',
      text: '',
      userInfo: {},
      panelLevelShow: false,
      levelList: [],
      level: "",
      fromList: [],
      fromInfo: "",
      options: {
        address: "",
        district: "",
        city: "",
        applyLevel: "",
        mobile: "",
        province: "",
        realName: "",
        wxId: ""
      },
      userId: ""
    };
  },
  components: {
    Toast,
    CityPicker,
    FullLoading
  },
  methods: {
    apply() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.title = '提交中...';
          this.loading = true;
          _replyAgent(this.options, this.userId).then(res => {
            this.loading = false;
            this.text = '提交成功，待审核';
            this.$refs.toast.show(() => this.$router.push("/login/replying"));
          }).catch(() => this.loading = false);
        }
      });
    },
    chooseLevel(e) {
      let val = e.target.value;
      let level = this.levelList.find(v => v.level == val);
      this.level = level.name;
    },
    chooseFrom(e) {
      let val = e.target.value;
      let from = this.fromList.find(v => v.dkey == val);
      this.fromInfo = from.dvalue;
    },
    cityChange(prov, city, district) {
      this.options.province = prov;
      this.options.city = city;
      this.options.district = district;
    },
    AppId() {
      getAppId("wx_h5_access_key").then(res => {
        var appId = res.cvalue;
        let redirectUri = encodeURIComponent(
          `${location.origin}?${location.hash}`
        );
        let url = "https://open.weixin.qq.com/connect/oauth2/authorize";
        let suffix =
          "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
        setTimeout(() => {
          location.replace(
            `${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`
          );
        }, 100);
      });
    }
  },
  mounted() {
    this.userId = this.$route.query.userId;
    this.userId && setCookie('userId', this.userId);
    Promise.all([
      getUser(),
      getAllLevel(),
      getDictList('source')
    ]).then(([userInfo, res, list]) => {
      this.loading = false;
      let level = userInfo.toLevel || 0;
      this.levelList = res.list.filter(l => {
        return l.level != '6' && l.level >= level;
      });
      this.options.applyLevel = this.levelList[0].level;
      this.level = this.levelList[0].name;

      this.fromList = list;
      this.options.fromInfo = list[0].dkey;
      this.fromInfo = list[0].dvalue;
    }).catch(() => this.loading = false);
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.login {
  font-size: $font-size-large-s;
  width: 100%;
  > div {
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    height: 1rem;
    padding: 0 0.3rem;
    border-bottom: 1px solid #eee;
    > i {
      position: absolute;
      top: 0.4rem;
      right: 0.6rem;
      color: $color-red;
      font-size: $font-size-medium-s;
    }
    span {
      display: inline-block;
      width: 2.2rem;
      flex: 0 0 2.2rem;
    }
    .more {
      width: 0.2rem;
      flex: 0 0 0.2rem;
    }
    .rotate {
      transform: rotateZ(90deg);
    }
    input {
      flex: 1;
    }
    &.area {
      position: relative;
      .item-input {
        flex: 1;
      }
      ul {
        width: 100%;
        // background-color: red;
        position: absolute;
        top: 1rem;
        display: none;
        &.show {
          display: block;
        }
        li {
          width: 100%;
          line-height: 0.7rem;
          font-size: $font-size-medium-s;
          text-align: center;
          border-bottom: 1px dashed #f7f7f7;
        }
      }
      select {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
  .pl2rem {
    padding-left: 0.2rem;
  }
  .btn {
    display: block;
    width: 90%;
    line-height: 0.9rem;
    margin: 2rem auto 1rem;
    font-size: $font-size-large-ss;
    background-color: $primary-color;
    color: #fff;
    text-align: center;
    border-radius: 0.1rem;
  }
}

</style>
