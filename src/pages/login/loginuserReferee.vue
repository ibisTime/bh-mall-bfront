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
        <div>
            <i v-show="errors.has('introducer')" class="error-tip">{{errors.first('introducer')}}</i>
            <span>介绍人手机号</span> <input @keyup="introducerChange" class="pl2rem" v-model="options.introducer" type="text" name="introducer" placeholder="可不填，跨级介绍时必填">
        </div>
        <div class="area">
            <i v-show="errors.has('area')" class="error-tip">{{errors.first('area')}}</i>
            <span>省份、市、区</span>
            <city-picker class="item-input pl2rem"
                        :province="options.province"
                        :city="options.city"
                        :district="options.district"
                        @change="cityChange">
            </city-picker>
            <img class="more" src="../../assets/imgs/more@2x.png" alt="">
        </div>
        <div>
            <i v-show="errors.has('address')" class="error-tip">{{errors.first('address')}}</i>
            <span>详细地址</span>
          <input class="pl2rem" v-model="options.address" v-validate="'required'" type="text" name="address" placeholder="请输入详细地址">
        </div>
        <div class="area">
            <i v-show="errors.has('applyLevel')" class="error-tip">{{errors.first('applyLevel')}}</i>
            <span>等级</span><div class="pl2rem item-input">{{level}}</div><img class="more" src="../../assets/imgs/more@2x.png" alt="">
            <select v-validate="'required'" name="applyLevel" v-model="options.applyLevel" @change="chooseLevel">
              <option v-for="item in levelList" :value="item.level">{{item.name}}</option>
            </select>
        </div>
        <div>
            <span>团队名称</span>
          <i v-show="errors.has('teamName')" class="error-tip">{{errors.first('teamName')}}</i>
            <!--<span class="pl2rem" v-if="options.applyLevel != userInfo.toLevel && userInfo.toTeamName">{{errors.first('teamName')}}</span>-->
          <span class="pl2rem" v-if="options.applyLevel != '1'">{{teamName}}</span>
          <input class="pl2rem" v-else v-model="teamName" v-validate="'required'" type="text" name="teamName" placeholder="请输入团队名称">
        </div>
        <div v-if="isRealNameShow">
          <i v-show="errors.has('idNo')" class="error-tip">{{errors.first('idNo')}}</i>
          <span>证件号</span>
          <input class="pl2rem" v-model="options.idNo" v-validate="'required'" type="text" name="idNo" placeholder="请输入证件号">
        </div>
        <qiniu
          ref="qiniu"
          style="visibility: hidden;position: absolute;width: 0;"
          :token="token"
          :uploadUrl="uploadUrl"></qiniu>
        <form ref="form" v-if="isRealNameShow">
          <div class="img">
            <img class="tianjia" src="../../assets/imgs/tianjia@2x.png" alt="">
            <p>上传手持身份证图片</p>
            <input type="file" class="file" :multiple="multiple" ref="fileInput" @change="fileChange(3,$event)" accept="image/*">
            <div class="item" v-for="(photo,index) in photos3" ref="photoItem" @click="choseItem(index)">
              <loading v-if="!photo.ok" title="" class="photo-loading"></loading>
              <img class="picture" ref="myImg" id="myImg" :src="getSrc(photo)">
            </div>
          </div>
        </form>
        <button class="btn" @click="apply" v-show="!loading">申请代理</button>
        <full-loading :title="title" v-show="loading"></full-loading>
        <toast ref="toast" :text="text"></toast>
    </div>
</template>
<script>
import {
  getAppId,
  getAllLevel1,
  replyAgent,
  supplyInfo,
  queryAmount,
  isRealName
} from "api/baohuo";
import {
  isLogin,
  setUser,
  getWxMobAndCapt,
  getImgData,
  formatImg
} from "common/js/util";
import { getCookie, setCookie } from "common/js/cookie";
import CityPicker from "base/city-picker/city-picker";
import { getQiniuToken } from "api/general";
import { getUser, getUserByMobile } from 'api/user';
import BScroll from "better-scroll";
import EXIF from "exif-js";
import Qiniu from "base/qiniu/qiniu";
import Toast from "base/toast/toast";
import Loading from "base/loading/loading";
import FullLoading from 'base/full-loading/full-loading';
import PhotoEdit from "components/photo-edit/photo-edit";

export default {
  data() {
    return {
      loading: true,
      title: '正在载入...',
      panelLevelShow: false,
      levelList: [],
      level: "",
      userInfo: {},
      options: {
        address: "",
        district: "",
        city: "",
        applyLevel: "",
        mobile: "",
        province: "",
        realName: "",
        wxId: "",
        idNo: "",
        idBehind: '',
        idFront: '',
        idHand: '',
        introducer: ''
      },
      photos3: [],
      photos333: "",
      token: "",
      currentItem: null,
      pdf: "",
      text: "",
      message: "",
      accountNumber: "",
      idKind: "",
      idNo: "",
      introducer: "",
      moneyNum: "",
      teamName: "",
      allLevelList: [],
      isRealNameShow: false
    };
  },
  created() {
    this.multiple = false;
    this.uploadUrl = "http://up-z0.qiniu.com";
  },
  mounted() {
    this.options.userId = this.$route.query.userId;
    this.options.userId && setCookie("userId", this.options.userId);
    this.options.userReferee = this.$route.query.userReferee;
    Promise.all([
      getUser(),
      getAllLevel1()
    ]).then(([userInfo, levelList]) => {
      this.loading = false;
      this.userInfo = userInfo;
      this.isRealNameShow = true;
      let list = levelList.list.filter(l => {
        return l.level != '6';
      });
      this.allLevelList = list;
      if (userInfo.highUser) {
        this.highUserName = userInfo.highUser.realName;
      }
      let level = userInfo.toLevel || 0;
      this.levelList = list.filter(l => {
        return l.level >= level;
      });
      if (this.levelList.length) {
        this.options.applyLevel = this.levelList[0].level;
        this.level = this.levelList[0].name;
      } else {
        this.text = '暂无可选择的等级';
        this.$refs.toast.show();
        this.options.applyLevel = '';
        this.level = '';
      }
      if (this.options.applyLevel !== '1' && userInfo.toTeamName) {
        this.teamName = userInfo.toTeamName;
      }
    }).catch(() => this.loading = false);
    //查询七牛token
    getQiniuToken().then(res => {
      this.token = res.uploadToken
    }).catch(() => {});
  },
  methods: {
    apply() {
      this.$validator.validateAll().then((result) => {
        console.log(result);
        if (result) {
          if (!this.teamName || !this.options.applyLevel) {
            this.text = '等级或团队信息未填写';
            this.$refs.toast.show();
            return;
          }
          if (!this.options.province) {
            this.text = '省份信息未填写';
            this.$refs.toast.show();
            return;
          }
          this.loading = true;
          this.title = '提交中...';
          this.options.idHand = (this.photos3[0] && this.photos3[0].key) || '';
          this.options.idNo = this.options.idNo;
          this.options.teamName = this.teamName;
          replyAgent(this.options).then(res => {
            this.loading = false;
            this.text = '提交成功，待审核';
            this.$refs.toast.show(() => {
              this.$router.push("/login/replying");
            });
          }).catch(() => this.loading = false);
        }
      });
    },
    introducerChange(e) {
      let mobile = e.target.value;
      if (/^1[3|4|5|6|7|8|9]\d{9}$/.test(mobile)) {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          getUserByMobile(mobile).then(user => {
            let leftLevel = this.userInfo.highUser.level || 0;
            let rightLevel = user.level;
            let list = this.allLevelList.filter(l => l.level >= leftLevel && l.level < rightLevel);
            this.getRealParam(list);
          }).catch(() => {
            this.noLevel();
          });
        }, 300);
      } else {
        this.noLevel();
      }
    },
    noLevel() {
      let leftLevel = this.userInfo.toLevel || 0;
      let list = this.allLevelList.filter(l => l.level >= leftLevel);
      this.getRealParam(list);
    },
    getRealParam(list) {
      this.levelList = list;
      if (!list.length) {
        this.text = '暂无可选择的等级';
        this.$refs.toast.show();
        this.options.applyLevel = '';
        this.level = '';
        this.teamName = '';
      } else {
        if (!list.find(l => l.level == this.options.applyLevel)) {
          this.options.applyLevel = list[0].level;
          this.level = this.levelList[0].name;
          if (this.options.applyLevel != this.userInfo.toLevel && this.userInfo.toTeamName) {
            this.teamName = this.userInfo.toTeamName;
          } else {
            this.teamName = '';
          }
        }
      }
    },
    chooseLevel(e) {
      let val = e.target.value;
      let level = this.levelList.find(v => v.level == val);
      this.allLevelList.map((item) => {
        if(item.level === level.level) {
          if(item.isRealName === '1') {
            this.isRealNameShow = true;
          } else {
            this.isRealNameShow = false;
          }
        }
      })
      this.level = level.name;
      this.options.applyLevel = val;
      // if (this.options.applyLevel != this.userInfo.toLevel && this.userInfo.toTeamName) {
      //   this.teamName = this.userInfo.toTeamName;
      // } else {
      //   this.teamName = '';
      // }
      // console.log(this.options.applyLevel);
      if (this.options.applyLevel != '1') {
        this.teamName = this.userInfo.toTeamName;
      } else {
        this.teamName = '';
      }
    },
    cityChange(prov, city, district) {
      this.options.province = prov;
      this.options.city = city;
      this.options.district = district;
    },
    choseItem(index) {
      let item = this.photos[index];
      if (!item.ok) {
        this.text = "图片还未上传完成";
        this.$refs.toast.show();
        return;
      }
      this.currentItem = item;
      this.$refs.photoEdit.show();
    },
    /**
     * 设置为封面
     * */
    beMainPhoto(key) {
      let index = this.photos.findIndex(photo => {
        return photo.key === key;
      });
      let item = this.photos[index];
      this.photos.splice(index, 1);
      this.photos.unshift(item);
    },
    /**
     * 更新裁剪后的图片
     * */
    updateImg(base64, key) {
      let index = this.photos.findIndex(photo => {
        return photo.key === key;
      });
      let item = this.photos[index];
      item.ok = false;
      item.preview = base64;
      this.photos.splice(index, 1, item);
      this.currentItem = item;
      this.uploadPhoto(base64, key).then(() => {
        // 再次获取当前图片的位置，防止在上传过程中有其它图片被删除，导致下标改变
        index = this.photos.findIndex(photo => {
          return photo.key === key;
        });
        item = this.photos[index];
        item.ok = true;
        this.photos.splice(index, 1, item);
        this.currentItem = item;
      });
    },
    /**
     * 在弹出的图片操作页面中删除图片
     * */
    deleteImg(key) {
      let index = this.photos.findIndex(photo => {
        return photo.key === key;
      });
      this.deletePhoto(index);
    },
    /**
     * 从相册中选择图片
     * */
    fileChange(index, e) {
      let files;
      if (e.dataTransfer) {
        files = e.dataTransfer.files;
      } else if (e.target) {
        files = e.target.files;
      }
      let self = this;
      let file = files[0];
      let orientation;
      EXIF.getData(file, function() {
        orientation = EXIF.getTag(this, "Orientation");
      });
      let reader = new FileReader();
      reader.onload = function(e) {
        getImgData(file.type, this.result, orientation, function(data) {
          let _url = URL.createObjectURL(file);
          let item = {
            preview: data,
            ok: false,
            type: file.type,
            key: _url.split("/").pop() + "." + file.name.split(".").pop()
          };
          self.photos3 = [item];
          self.uploadPhoto(data, item.key).then(() => {
              item = {
                ...item,
                ok: true
              };
              self.updatePhotos(item, index);
          }).catch(err => {
              self.onUploadError(err);
          });
          self.$refs.fileInput.value = null;
        });
      };
      reader.readAsDataURL(file);
    },
    /**
     * 图片上传完成后更新photos
     * */
    updatePhotos(item, index) {
      for (let i = 0; i < this.photos3.length; i++) {
        if (this.photos3[i].key === item.key) {
          this.photos3.splice(i, 1, item);
          break;
        }
      }
    },
    deletePhoto(index) {
      this.photos.splice(index, 1);
    },
    uploadPhoto(base64, key) {
      return this.$refs.qiniu.uploadByBase64(base64, key);
    },
    /**
     * 处理图片上传错误事件
     * @param error 错误信息
     */
    onUploadError(error) {
      this.text = (error.body && error.body.error) || `${error.message}:10M` || "图片上传出错";
      this.$refs.toast.show();
    },
    getSrc(photo) {
      let url = photo.preview || formatImg(photo.key);
      this.pdf = url;
      return url;
    }
  },
  computed: {
    photoCls() {
      return this.photos.length ? "" : "no-photo";
    },
    curUrl() {
      return this.currentItem ? this.currentItem.preview : "";
    },
    curKey() {
      return this.currentItem ? this.currentItem.key : "";
    },
    curType() {
      return this.currentItem ? this.currentItem.type : "";
    }
  },
  components: {
    Qiniu,
    Toast,
    Loading,
    FullLoading,
    PhotoEdit,
    CityPicker
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.login {
  padding: 0 0.2rem;
  width: 100%;
  font-size: $font-size-large-s;
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
    }
  }
  .img {
    margin-top: 0.4rem;
    height: 3.5rem;
    border: 1px dashed #dedede;
    position: relative;
    .tianjia {
      width: 1rem;
      position: absolute;
      top: 0.86rem;
      left: 50%;
      transform: translateX(-50%);
    }
    p {
      width: 100%;
      position: absolute;
      bottom: 0.86rem;
      text-align: center;
    }
    .file {
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    .picture {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;
      // display: none;
    }
  }
  .btn {
    display: block;
    width: 90%;
    line-height: 0.9rem;
    margin: 0.6rem auto;
    font-size: $font-size-large-ss;
    background-color: $primary-color;
    color: #fff;
    text-align: center;
    border-radius: 0.1rem;
  }
  select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .pl2rem {
    padding-left: 0.2rem;
  }
}
</style>
