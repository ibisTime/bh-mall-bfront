<template>
    <div class="login">
        <div>
            <i v-show="errors.has('username')" class="error-tip">{{errors.first('username')}}</i>
            <span>姓名</span> <input v-model="options.realName" v-validate="'required'" type="text" name="username" placeholder="请输入姓名">
        </div>
        <div>
            <i v-show="errors.has('mobile')" class="error-tip">{{errors.first('mobile')}}</i>
            <span>手机号</span> <input v-model="options.mobile" v-validate="'required|mobile'" type="text" name="mobile" placeholder="请输入手机号">
        </div>
        <div>
            <i v-show="errors.has('wxNum')" class="error-tip">{{errors.first('wxNum')}}</i>
            <span>微信号</span> <input v-model="options.wxId" v-validate="'required'" type="text" name="wxNum" placeholder="请输入微信号">
        </div>
        <div>
            <i v-show="errors.has('mobile')" class="error-tip">{{errors.first('introducer')}}</i>
            <span>介绍人手机号</span> <input v-model="options.introducer" v-validate="'required|mobile'" type="text" name="introducer" placeholder="请输入介绍人手机号">
        </div>
          <div>
            <i v-show="errors.has('wxNum')" class="error-tip">{{errors.first('wxNum')}}</i>
            <span>证件号</span> <input v-model="options.idNo" v-validate="'required'" type="text" name="idNo" placeholder="请输入证件号">
        </div>
              <qiniu
            ref="qiniu"
            style="visibility: hidden;position: absolute;"
            :token="token"
            :uploadUrl="uploadUrl"></qiniu>
      <form ref="form">
        <div class="img">
                <img class="tianjia" src="../../assets/imgs/tianjia@2x.png" alt="">
                <p>上传身份证正面图片</p>
                <input type="file" class="file" :multiple="multiple" ref="fileInput" @change="fileChange(1,$event)" accept="image/*">
                <div class="item" v-for="(photo,index) in photos1" ref="photoItem" @click="choseItem(index)">
                    <loading v-if="!photo.ok" title="" class="photo-loading"></loading>
                    <img class="picture" ref="myImg" id="myImg" :src="getSrc(photo)">
                </div>
        </div>
        <div class="img">
                <img class="tianjia" src="../../assets/imgs/tianjia@2x.png" alt="">
                <p>上传身份证反面图片</p>
                <input type="file" class="file" :multiple="multiple" ref="fileInput" @change="fileChange(2,$event)" accept="image/*">
                <div class="item" v-for="(photo,index) in photos2" ref="photoItem" @click="choseItem(index)">
                    <loading v-if="!photo.ok" title="" class="photo-loading"></loading>
                    <img class="picture" ref="myImg" id="myImg" :src="getSrc(photo)">
                </div>
        </div>
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
        <div class="area">
            <i v-show="errors.has('area')" class="error-tip">{{errors.first('area')}}</i>            
            <span>省份、市、区</span><img class="more" src="../../assets/imgs/more@2x.png" alt="">
            <city-picker class="item-input"
                        v-validate="'required'"
                        :province="options.province"
                        :city="options.city"
                        :district="options.district"
                        name="area"
                        @change="cityChange">
            </city-picker>
        </div>
        <div>
            <i v-show="errors.has('address')" class="error-tip">{{errors.first('address')}}</i>  
            <span>详细地址</span> <input v-model="options.address" v-validate="'required'" type="text" name="address" placeholder="请输入详细地址">
        </div>
        <div class="area" @click="chooseLevel">
            <span>等级</span> <span>{{level}}</span><img class="more rotate" src="../../assets/imgs/more@2x.png" alt="">
            <ul  :class="[panelLevelShow ? 'show' : '','panel']" @click="selectLevel($event)">
                <li v-for="item in levelList" v-if="item.level != 6" :level="item.level">{{item.name}}</li>
            </ul>
        </div>
        <button class="btn" @click="apply">申请代理</button>
    </div>
</template>
<script>
import {
  getAppId,
  getAllLevel,
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
import BScroll from "better-scroll";
import EXIF from "exif-js";
import Qiniu from "base/qiniu/qiniu";
import Toast from "base/toast/toast";
import Loading from "base/loading/loading";
import PhotoEdit from "components/photo-edit/photo-edit";
const MAX_LENGTH = 12;

export default {
  data() {
    return {
      panelLevelShow: false,
      levelList: [],
      level: "",
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
      userReferee: "",
      userId: "",
      photos1: [],
      photos2: [],
      photos3: [],
      photos111: "",
      photos222: "",
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
      moneyNum: ""
    };
  },
  created() {
    this.multiple = true;
    this.uploadUrl = "http://up-z0.qiniu.com";
  },
  methods: {
    submit() {
      // this.userId = 'U201806142229374042532';
      supplyInfo(
              "1",
              this.idNo,
              this.mobile,
              this.introducer,
              this.photos1[0].key,
              this.photos21[0].key,
              this.photos3[0].key,
              this.userId
            ).then(res => {
              // alert(res);
              // alert("4");
              if (res.code !== "") {
                this.text = "提交成功，待审核";
                this.$refs.toast.show(this.tiaozhuan);
                this.photos = [];
                this.moneyNum = "";
              } else {
                this.text = "请确认信息全部填写完整";
                this.$refs.toast.show();
              }
            });
      // isRealName(this.userId).then(res => {
      //   console.log(this.idNo);
      //   if (res.isSuccess) {
      //     // 需要实名
      //     if (
      //       this.idNo &&
      //       // this.introducer &&
      //       this.photos1[0].key &&
      //       this.photos2[0].key &&
      //       this.photos3[0].key
      //     ) {
      //       supplyInfo(
      //         "1",
      //         this.idNo,
      //         this.introducer,
      //         this.photos1[0].key,
      //         this.photos21[0].key,
      //         this.photos3[0].key,
      //         this.userId
      //       ).then(res => {
      //         // alert(res);
      //         // alert("4");
      //         if (res.code !== "") {
      //           this.text = "提交成功，待审核";
      //           this.$refs.toast.show(this.tiaozhuan);
      //           this.photos = [];
      //           this.moneyNum = "";
      //         } else {
      //           this.text = "请确认信息全部填写完整";
      //           this.$refs.toast.show();
      //         }
      //       });
      //     }
      //   } else {
      //     if (!this.photos1[0]) {
      //       this.photos111 = "";
      //     }
      //     if (!this.photos2[0]) {
      //       this.photos222 = "";
      //     }
      //     if (!this.photos3[0]) {
      //       this.photos333 = "";
      //     }
      //     if (!this.idNo) {
      //       this.idNo = "";
      //     }
      //     if (!this.introducer) {
      //       this.introducer = "";
      //     }
      //     supplyInfo(
      //       "1",
      //       this.idNo,
      //       this.introducer,
      //       this.photos111,
      //       this.photos222,
      //       this.photos333,
      //       this.userId
      //     ).then(res => {
      //       // alert(res);
      //       // alert("4");
      //       if (res.code !== "") {
      //         this.text = "提交成功，待审核";
      //         this.$refs.toast.show(this.tiaozhuan);
      //         this.photos = [];
      //         this.moneyNum = "";
      //       }
      //     });
      //   }
      // });
    },
    tiaozhuan() {
      this.$router.push("/login/replying");
    },
    apply() {
      this.options.userReferee = this.userReferee;
      this.options.userId = this.userId;
      this.options.idBehind = this.photos1[0].key;
      this.options.idFront = this.photos2[0].key;
      this.options.idHand = this.photos3[0].key;
      this.options.idNo = this.options.idNo
      // alert(1);
      // alert(JSON.stringify(this.options));
      // console.log('111'+this.options);
      alert(JSON.stringify(this.options));
      replyAgent(this.options).then(res => {
        alert('222');
      // alert(JSON.stringify(this.options));
        this.$router.push("/login/replying");
      });
    },
    changLevelShow() {
      this.panelLevelShow = !this.panelLevelShow;
    },
    chooseLevel() {
      this.changLevelShow();
    },
    selectLevel(event) {
      console.log(this.panelLevelShow);
      this.changLevelShow();
      this.panelLevelShow = !this.panelLevelShow;
      this.options.applyLevel = event.target.getAttribute("level");
      this.level = event.target.innerHTML;
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
      console.log(files);
      console.log(this.photos);
      let self = this;
      let len = files.length;
      for (let i = 0; i < files.length; i++) {
        (function(i) {
          let file = files[i];
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
              if (index == "1") {
                self.photos1.push(item);
              } else if (index == "2") {
                self.photos2.push(item);
              } else {
                self.photos3.push(item);
              }
              self
                .uploadPhoto(data, item.key)
                .then(() => {
                  item = {
                    ...item,
                    ok: true
                  };
                  self.updatePhotos(item, index);
                })
                .catch(err => {
                  self.onUploadError(err);
                });
              if (i + 1 === len) {
                self.$refs.fileInput.value = null;
              }
            });
          };
          reader.readAsDataURL(file);
        })(i);
      }
    },
    /**
     * 图片上传完成后更新photos
     * */
    updatePhotos(item, index) {
      if (index == "1") {
        for (let i = 0; i < this.photos1.length; i++) {
          if (this.photos1[i].key === item.key) {
            this.photos1.splice(i, 1, item);
            break;
          }
        }
      } else if (index == "2") {
        for (let i = 0; i < this.photos2.length; i++) {
          if (this.photos2[i].key === item.key) {
            this.photos2.splice(i, 1, item);
            break;
          }
        }
      } else {
        for (let i = 0; i < this.photos3.length; i++) {
          if (this.photos3[i].key === item.key) {
            this.photos3.splice(i, 1, item);
            break;
          }
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
      this.text =
        (error.body && error.body.error) ||
        `${error.message}:10M` ||
        "图片上传出错";
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
    PhotoEdit,
    CityPicker
  },
  mounted() {
    this.userId = this.$route.query.userId;
    setCookie("userId", this.userId);
    this.userReferee = this.$route.query.userReferee;
    getAllLevel().then(res => {
      this.levelList = res.list;
      this.levelList = this.levelList;
    });
    //查询七牛token
    getQiniuToken().then(res => {
      this.token = res.uploadToken;
    });
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.login {
  font-size: $font-size-large-s;
  > div {
    position: relative;
    height: 1rem;
    padding: 0.3rem;
    border-bottom: 1px solid #eee;
    > i {
      position: absolute;
      top: 0.02rem;
      color: $primary-color;
      font-size: $font-size-small-ss;
    }
    span {
      display: inline-block;
      width: 2.2rem;
    }
    .more {
      width: 0.2rem;
      float: right;
    }
    .rotate {
      transform: rotateZ(90deg);
    }
    &.area {
      position: relative;
      .item-input {
        position: absolute;
        top: 0.3rem;
        left: 2.8rem;
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
    margin: 4rem auto;
    background-color: $primary-color;
    color: #fff;
    text-align: center;
    border-radius: 0.1rem;
  }
}
</style>
