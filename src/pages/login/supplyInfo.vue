<template>
  <div class="offine">
      <div class="login">
        <!--<div v-if="highUserName">-->
            <!--<span>上级</span><span class="pl2rem">{{highUserName}}</span>-->
        <!--</div>-->
        <div>
            <i v-show="errors.has('introducer')" class="error-tip">{{errors.first('introducer')}}</i>
            <span>介绍人手机号</span>
            <input class="pl2rem" @keyup="introducerChange" v-model="introducer" type="tel" name="introducer" placeholder="可不填，跨级介绍时必填">
        </div>
        <div class="area">
            <i v-show="errors.has('applyLevel')" class="error-tip">{{errors.first('applyLevel')}}</i>
            <span>等级</span><div class="pl2rem item-input">{{level}}</div><img class="more" src="../../assets/imgs/more@2x.png" alt="">
            <select v-validate="'required'" v-model="applyLevel" name="applyLevel" @change="chooseLevel">
              <option v-for="item in levelList" :value="item.level">{{item.name}}</option>
            </select>
        </div>
        <div>
            <span>团队名称</span>
            <!--<span class="pl2rem" v-if="applyLevel != userInfo.toLevel && userInfo.toTeamName">{{teamName}}</span>-->
          <span class="pl2rem" v-if="applyLevel != '1'">{{teamName}}</span>
          <input v-else v-model="teamName" v-validate="'required'" type="text" name="teamName" placeholder="请输入团队名称">
        </div>
        <div v-if="isRealNameShow">
          <i v-show="errors.has('idNo')" class="error-tip">{{errors.first('idNo')}}</i>
          <span>证件号码</span>
          <input class="pl2rem" v-model="idNo" v-validate="'required'" type="text" name="idNo" placeholder="请输入证件号码">
        </div>
      </div>
      <qiniu ref="qiniu"
          style="visibility: hidden;position: absolute;width: 0;"
          :token="token"
          :multiple="multiple"
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
      <full-loading :title="title" v-show="loading"></full-loading>
      <toast ref="toast" :text="text"></toast>
      <span class="btn" @click="submit">确定</span>
    <photo-edit ref="photoEdit"
                :url="curUrl"
                :imgKey="curKey"
                :type="curType"
                @beMain="beMainPhoto"
                @updateImg="updateImg"
                @deleteImg="deleteImg"></photo-edit>
  </div>
</template>
<script>
import { supplyInfo, queryAmount, isRealName, getAllLevel1 } from 'api/baohuo'
import { getQiniuToken } from 'api/general'
import { getUser, getUserByMobile } from 'api/user';
import { setCookie } from "common/js/cookie";
import { getUserId } from 'common/js/util';
import BScroll from 'better-scroll';
import EXIF from 'exif-js';
import Qiniu from 'base/qiniu/qiniu';
import Toast from 'base/toast/toast';
import Loading from 'base/loading/loading';
import FullLoading from 'base/full-loading/full-loading';
import { getImgData, formatImg } from 'common/js/util';
import PhotoEdit from 'components/photo-edit/photo-edit';

const MAX_LENGTH = 12;

export default {
    name:'offine',
    data(){
        return {
            highUserName: '',
            userInfo: {},
            teamName: '',
            loading: true,
            title: '正在载入...',
            moneyNum: '',
            pdf:'',
            account:'',
            currentItem: null,
            text: '',
            photos3: [],
            photos333: '',
            token: '',
            message: '',
            accountNumber: '',
            idKind: '',
            idNo: '',
            introducer: '',
            level: '',
            levelList: [],
            applyLevel: '',
            allLevelList: [],
            isRealNameShow: false
        }
    },
    created() {
        this.multiple = false;
        this.uploadUrl = 'http://up-z0.qiniu.com';
    },
    mounted(){
        this.userId = this.$route.query.userId || getUserId();
        this.userId && setCookie('userId', this.userId);
        Promise.all([
          getUser(),
          getAllLevel1()
        ]).then(([userInfo, levelList]) => {
            this.isRealNameShow = true;
            this.loading = false;
            this.userInfo = userInfo;
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
                this.applyLevel = this.levelList[0].level;
                this.level = this.levelList[0].name;
            } else {
                this.text = '介绍人不能为最高等级代理';
                this.$refs.toast.show();
                this.applyLevel = '';
                this.level = '';
            }
            if (this.applyLevel !== userInfo.toLevel && userInfo.toTeamName) {
                this.teamName = userInfo.toTeamName;
            }
        }).catch(() => this.loading = false);
        //查询七牛token
        getQiniuToken().then(res => {
            this.token = res.uploadToken
        }).catch(() => {});
    },
    methods:{
        introducerChange(e) {
          let mobile = e.target.value;
          if (/^1[3|4|5|6|7|8|9]\d{9}$/.test(mobile)) {
            if (this.timer) {
              clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
              getUserByMobile(mobile).then(user => {
                let leftLevel = this.userInfo.toLevel || 0;
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
            this.applyLevel = '';
            this.level = '';
            this.teamName = '';
          } else {
            if (!list.find(l => l.level == this.applyLevel)) {
              this.applyLevel = list[0].level;
              this.level = this.levelList[0].name;
              if (this.applyLevel != this.userInfo.toLevel && this.userInfo.toTeamName) {
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
          this.applyLevel = val;
          if (this.applyLevel != this.userInfo.toLevel && this.userInfo.toTeamName) {
            this.teamName = this.userInfo.toTeamName;
          } else {
            this.teamName = '';
          }
        },
        submit(){
          this.$validator.validateAll().then((result) => {
            if (result) {
              if (!this.teamName || !this.applyLevel) {
                  this.text = '请确认信息全部填写完整';
                  this.$refs.toast.show();
                  return;
              }
              this.loading = true;
              this.title = '提交中...';
              // isRealName(this.userId).then(res => {
                  if(this.isRealNameShow) {
                      // 需要实名
                      if(this.idNo && this.photos3.length && this.photos3[0].key) {
                          supplyInfo({
                            idKind: '1',
                            idNo: this.idNo,
                            introducer: this.introducer,
                            idHand: this.photos3[0].key,
                            teamName: this.teamName,
                            applyLevel: this.applyLevel,
                            userId: this.userId
                          }).then(res => {
                              this.loading = false;
                              if(res.code !== '') {
                                  this.text = '提交成功，待审核'
                                  this.$refs.toast.show(this.tiaozhuan);
                                  this.photos = [];
                                  this.moneyNum = ''
                              } else {
                                  this.text = '请确认信息全部填写完整';
                                  this.$refs.toast.show();
                              }
                          }).catch(() => this.loading = false);
                      } else {
                        this.loading = false;
                        this.text = '请确认信息全部填写完整';
                        this.$refs.toast.show();
                      }
                  } else {
                      if(!this.photos3[0]) {
                          this.photos333 = ''
                      }
                      if(!this.idNo) {
                          this.idNo = ''
                      }
                      if(!this.introducer) {
                          this.introducer = ''
                      }
                      supplyInfo({
                        idKind: '1',
                        idNo: this.idNo,
                        introducer: this.introducer,
                        idHand: this.photos333,
                        teamName: this.teamName,
                        applyLevel: this.applyLevel,
                        userId: this.userId
                      }).then(res => {
                          this.loading = false;
                          if(res.code !== '') {
                              this.text = '提交成功，待审核';
                              this.$refs.toast.show(this.tiaozhuan);
                              this.photos = [];
                              this.moneyNum = ''
                          }
                      }).catch(() => this.loading = false);
                  }
              // });
            }
          });
        },
        tiaozhuan() {
          this.$router.push('/login/replying')
        },
        /**
         * 选中要操作的图片
         * */
        choseItem(index) {
          console.log(1);
          let item = this.photos3[index];
            if (!item.ok) {
            this.text = '图片还未上传完成';
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
            let index = this.photos.findIndex((photo) => {
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
            let index = this.photos3.findIndex((photo) => {
                return photo.key === key;
            });
            let item = this.photos3[index];
            item.ok = false;
            item.preview = base64;
            this.photos3.splice(index, 1, item);
            this.currentItem = item;
            this.uploadPhoto(base64, key).then(() => {
                // 再次获取当前图片的位置，防止在上传过程中有其它图片被删除，导致下标改变
                index = this.photos3.findIndex((photo) => {
                    return photo.key === key;
                });
                item = this.photos3[index];
                item.ok = true;
                this.photos3.splice(index, 1, item);
                this.currentItem = item;
            });
        },
        /**
         * 在弹出的图片操作页面中删除图片
         * */
        deleteImg(key) {
            let index = this.photos3.findIndex((photo) => {
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
            orientation = EXIF.getTag(this, 'Orientation');
            });
            let reader = new FileReader();
            reader.onload = function(e) {
                getImgData(file.type, this.result, orientation, function(data) {
                    let _url = URL.createObjectURL(file);
                    let item = {
                        preview: data,
                        ok: false,
                        type: file.type,
                        key: _url.split('/').pop() + '.' + file.name.split('.').pop()
                    };
                    self.photos3 = [item];
                    self.uploadPhoto(data, item.key).then(() => {
                        item = {
                            ...item,
                            ok: true
                        };
                        self.updatePhotos(item, index);
                    }).catch((err) => {
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
            this.photos3.splice(index, 1);
        },
        uploadPhoto(base64, key) {
            return this.$refs.qiniu.uploadByBase64(base64, key);
        },
        /**
         * 处理图片上传错误事件
         * @param error 错误信息
         */
        onUploadError(error) {
            this.text = error.body && error.body.error || `${error.message}:10M` || '图片上传出错';
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
            return this.photos.length ? '' : 'no-photo';
        },
        curUrl() {
            return this.currentItem ? this.currentItem.preview : '';
        },
        curKey() {
            return this.currentItem ? this.currentItem.key : '';
        },
        curType() {
            return this.currentItem ? this.currentItem.type : '';
        }
    },
    components: {
        Qiniu,
        Toast,
        Loading,
        FullLoading,
        PhotoEdit
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/scss/variable.scss';
    .offine{
        width: 100%;
        font-size: $font-size-medium;
        padding: 0 0.3rem;
        .header{
            padding-top: 0.4rem;
            p + p {
                margin-top: 0.37rem;
            }
            .money{
                color: $primary-color;
            }
        }
        .money-num{
            margin-top: 0.54rem;
            width: 100%;
            height: 0.9rem;
            border: 1px solid #dedede;
            border-radius: 0.1rem;
            padding-left: 0.3rem;
            color:#333;
        }
        .img{
            margin-top: 0.4rem;
            height: 3.5rem;
            border: 1px dashed #dedede;
            position: relative;
            .tianjia{
                width: 1rem;
                position: absolute;
                top: 0.86rem;
                left: 50%;
                transform: translateX(-50%);
            }
            p{
                width: 100%;
                position: absolute;
                bottom: 0.86rem;
                text-align: center;
            }
            .file{
                width: 100%;
                height: 100%;
                opacity: 0;
            }
            .picture{
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 3;
                // display: none;
            }
        }
        .btn{
            display: block;
            margin-top: 1.2rem;
            line-height: 0.9rem;
            text-align: center;
            font-size: $font-size-medium-xx;
            background-color: $primary-color;
            color: #fff;
            border-radius: 0.1rem;
        }
        .photo-loading {
            position: absolute;
            top: 50%;
            margin-top: -0.24rem;
        }
    }
    .textInfo {
        font-size: $font-size-large-s;
    }
    .login {
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
    .btn {
        display: block;
        width: 90%;
        line-height: 0.9rem;
        margin: 4rem auto;
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
