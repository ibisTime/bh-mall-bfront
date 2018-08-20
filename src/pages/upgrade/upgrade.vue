<template>
  <div class="logout">
      <qiniu
        ref="qiniu"
        style="visibility: hidden;position: absolute;"
        :token="token"
        :uploadUrl="uploadUrl"></qiniu>
      <div class="header">
        <img src="../../assets/imgs/dailixinxi@2x.png" alt="">
        申请升级
      </div>
      <div class="content">
        <p>姓名：{{userInfo.realName}}</p>
        <p>微信号：{{userInfo.wxId}}</p>
        <p>手机号：{{userInfo.mobile}}</p>
        <p>打款金额：<input type="text" v-model="padAmount"></p>
        <p>等级：{{userInfo.level}}</p>
        <div class="area">
            <span>升级等级</span> <button  @click="chooseLevel" :value='level'>{{level || btntext}}</button>
            <ul :class="[panelLevelShow ? 'show' : 'hidden']" @click="selectLevel($event)">
                <li v-for="item in levelList" v-if="item.level != 6" :level="item.level" @click="chooseLevel(item.isRealName)">{{item.name}}</li>
            </ul>
        </div>
        <p v-show="isTeam">团队名称：<input type="text" v-model="myteamName"></p>
        <p v-show="isIdentity">身份证号：<input type="text" v-model="identity"></p>
        <div class="img" v-show="isIdentity">
            <img class="tianjia" src="../../assets/imgs/tianjia@2x.png" alt="">
            <p>上传手持身份证照片</p>
            <input type="file" class="file" ref="fileInput" @change="identityFile(1,$event)" accept="image/*">
            <div class="item" v-for="(photo,index) in identityPhotos">
                <loading v-if="!photo.ok" title="" class="photo-loading"></loading>
                <img class="picture" ref="myIdentityImg" id="myIdentityImg" :src="getIdentitySrc(photo)">
            </div>
        </div>
        <div class="img">
            <img class="tianjia" src="../../assets/imgs/tianjia@2x.png" alt="">
            <p>上传打款图片（如有多张，请合并上传）</p>
            <input type="file" class="file" ref="fileInput" @change="fileChange(1,$event)" accept="image/*">
            <div class="item" v-for="(photo,index) in photos" ref="photoItem" @click="choseItem(index)">
                <loading v-if="!photo.ok" title="" class="photo-loading"></loading>
                <img class="picture" ref="myImg" id="myImg" :src="getSrc(photo)">
            </div>
        </div>

      </div>
      <div class="footer">
        <span @click="upgradeApplica1">提交申请</span>
      </div>
      <toast ref="mytoast" :text="text"></toast>
  </div>
</template>
<script>
import {
  userExit,
  getLevel,
  getAccount,
  getAllLevel,
  upgradeApplica
} from "api/baohuo";
import { getUser } from "api/user";
import toast from "base/toast/toast";
import Qiniu from "base/qiniu/qiniu";
import Toast from "base/toast/toast";
import Loading from "base/loading/loading";
import { getImgData, formatImg } from "common/js/util";
import PhotoEdit from "components/photo-edit/photo-edit";
import { getQiniuToken } from "api/general";
import EXIF from "exif-js";   // Exif.js 提供了 JavaScript 读取图像的原始数据的功能扩展
const MAX_LENGTH = 12;
export default {
  name: "upgrade",
  data() {
    return {
      padAmount: "",
      panelLevelShow: false,
      levelList: [],
      level: "",
      userInfo: {},
      text: '',
      account: 0,
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
      moneyNum: "",
      pdf: "",
      account: "",
      currentItem: null,
      text: "",
      photos: [],
      identityPhotos: [],
      token: "",
      message: "",
      accountNumber: "",
      btntext: "选择你要升级的等级",
      mylevel: '',
      isTeam: false,
      myteamName: '',
      isIdentity: false,
      identity: '',
      myRealName: -1,
      realName: false
    };
  },
  created() {
    this.multiple = true;
    this.uploadUrl = "http://up-z0.qiniu.com";
  },
  methods: {
    selectLevel(event) {
      this.changLevelShow();
      this.panelLevelShow = !this.panelLevelShow;
      this.options.applyLevel = event.target.getAttribute("level");
      if(this.options.applyLevel == 1){
        this.isTeam = true;
      }else{
        this.isTeam = false;
      }
      if(this.realName && this.myRealName == 0){
        this.isIdentity = true;
      }else{
        this.isIdentity = false;
      }
      this.level = event.target.innerHTML;
    },
    changLevelShow() {
      this.panelLevelShow = !this.panelLevelShow;
    },
    chooseLevel(isRealName) {
      console.log(isRealName);
      if(this.mylevel == 1){
        return;
      }
      this.panelLevelShow = !this.panelLevelShow;
      if(isRealName == 1){
        this.realName = true;
      }else{
        this.realName = false;
      }
    },
    btnClick() {
      this.panelLevelShow = !this.panelLevelShow;
      this.btntext1 = this.level;
    },
    upgradeApplica1() {
      if(this.photos.length === 0){
        return;
      }
      let options = {};
      options.teamName = this.myteamName;
      options.highLevel = this.options.applyLevel;
      options.padAmount = this.padAmount * 1000;
      options.payPdf = this.photos[0].key;
      options.idNo = this.identity;
      console.log(this.isIdentity);
      // if(this.isIdentity) {
      //   options.inHand = this.identityPhotos[0].key;
      // }
      options.idHand = this.identityPhotos[0].key;
      upgradeApplica(options).then(res => {
        if (res.isSuccess) {
          this.text = '申请成功，待上级审核';
          this.$refs.mytoast.show();
          setTimeout(() => {
            this.$router.push('/home');
          }, 500);
        }
        res.isReset && alert(res.isReset);
      });
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
    identityFile(index, e){
      let files;
      if (e.dataTransfer) {
        files = e.dataTransfer.files;
      } else if (e.target) {
        files = e.target.files;
      }
      let self = this;
      let len = files.length;
      let file = files[0];
      let orientation;
      console.log(self);
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
          self.identityPhotos.push(item);
          self
            .uploadPhoto(data, item.key)
            .then(() => {
              item = {
                ...item,
                ok: true
              };
              self.upIdentityPhotos(item);
            })
            .catch(err => {
              self.onUploadError(err);
            });
          if (len === 1) {
            self.$refs.fileInput.value = null;
          }
        });
      };
      reader.readAsDataURL(file);
    },
    fileChange(index, e) {
      let files;
      if (e.dataTransfer) {
        files = e.dataTransfer.files;
      } else if (e.target) {
        files = e.target.files;
      }
      if (this.photos.length + files.length > MAX_LENGTH) {
        this.text = "图片最多上传12张";
        this.$refs.toast.show();
        files = Array.prototype.slice.call(files, 0, MAX_LENGTH);
      }
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
              self.photos.push(item);
              self
                .uploadPhoto(data, item.key)
                .then(() => {
                  item = {
                    ...item,
                    ok: true
                  };
                  self.updatePhotos(item);
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
    updatePhotos(item) {
      for (let i = 0; i < this.photos.length; i++) {
        if (this.photos[i].key === item.key) {
          this.photos.splice(i, 1, item);
          break;
        }
      }
      console.log(this.photos)
    },
    upIdentityPhotos(item){
      this.identityPhotos.push(item);
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
    },
    getIdentitySrc(photo){
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
    PhotoEdit
  },
  mounted() {
    getUser().then(res => {
      this.mylevel = res.level;
      getLevel().then(info => {
        info.map((item) => {
          if(res.level === item.level) {
            this.myRealName = item.isRealName;
            res.level = item.name;
          }
        });
        // this.myRealName = info[0].isRealName;
        // res.level = info[0].name;
        this.userInfo = res;
        getAllLevel().then(res => {
          this.levelList = res.list.filter(item => {
            return item.level < this.mylevel;
          });
          this.levelList = this.levelList;
        });
      });
    });
    getAccount().then(res => {
      this.account = res.amount;
    });
    getQiniuToken().then(res => {
      this.token = res.uploadToken;
    });
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.logout {
  background-color: #f7f7f7;
  .fl {
    float: left;
  }
  .header {
    line-height: 0.7rem;
    font-size: $font-size-medium;
    color: $primary-color;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    img {
      width: 0.28rem;
      margin-left: 0.3rem;
      vertical-align: text-bottom;
      margin-right: 0.08rem;
    }
  }
  .content {
    padding-left: 0.3rem;
    padding-bottom: 0.36rem;
    font-size: $font-size-medium-s;
    color: #333;
    background-color: #fff;
    overflow: hidden;
    border-bottom: 1px solid #eee;
    input {
      border: 0.01rem solid  rgb(145, 135, 135);
      padding: 0.08rem 0.15rem;
      border-radius: 0.05rem;
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
    p {
      margin-top: 0.36rem;
    }
    .money {
      color: $primary-color;
    }
    .area {
      position: relative;
      .item-input {
        position: absolute;
        top: 0.3rem;
        left: 2.8rem;
      }
      button {
        width: 3rem;
        height: 0.7rem;
        border-radius: 0.1rem;
        margin-left: 1.5rem;
        font-size: 0.2rem;
        background-color: #72a52c;
        color: #fff;
      }
      ul {
        width: 96%;
        background-color: #333;
        position: absolute;
        color: #eee;
        top: 0.75rem;
        z-index: 5;
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
  .footer {
    height: 1rem;
    position: relative;
    background-color: #fff;
    span {
      width: 7rem;
      height: 0.7rem;
      line-height: 0.64rem;
      text-align: center;
      border-radius: 0.1rem;
      position: absolute;
      top: 50%;
      right: 0.3rem;
      transform: translateY(-50%);
      background-color: $primary-color;
      font-size: $font-size-small;
      color: #fff;
    }
  }
}
</style>
