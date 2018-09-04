<template>
  <div class="offine">
      <qiniu
            ref="qiniu"
            style="visibility: hidden;position: absolute;"
            :token="token"
            :uploadUrl="uploadUrl"></qiniu>
      <div class="header">
          <p>充值品牌：麦记</p>
          <p>充值类型：门槛款</p>
          <p>当前余额：￥<i class="money">{{account / 1000}}</i></p>
      </div>
      <form ref="form">
        <input type="number" class="money-num" v-model="moneyNum" placeholder="请输入金额（必填）">
        <div class="img">
                <img class="tianjia" src="../../assets/imgs/tianjia@2x.png" alt="">
                <p>点击上传打款图片（如有多张，请合并上传）</p>
                <input type="file" class="file" ref="fileInput" @change="fileChange" accept="image/*">
                <div class="item" v-for="(photo,index) in photos" ref="photoItem" @click="choseItem(index)">
                    <loading v-if="!photo.ok" title="" class="photo-loading"></loading>
                    <img class="picture" ref="myImg" id="myImg" :src="getSrc(photo)">
                </div>
        </div>
      </form>
      <toast ref="toast" :text="text"></toast>
      <full-loading :title="title" v-show="loading"></full-loading>
      <photo-edit ref="photoEdit"
                  :url="curUrl"
                  :imgKey="curKey"
                  :type="curType"
                  @beMain="beMainPhoto"
                  @updateImg="updateImg"
                  @deleteImg="deleteImg"></photo-edit>
      <span class="btn" @click="sendMoney">提交充值</span>
  </div>
</template>
<script>
import { sendMoney, queryAmount, checkRed } from 'api/baohuo'
import { getQiniuToken } from 'api/general'
import EXIF from 'exif-js';
import Qiniu from 'base/qiniu/qiniu';
import Toast from 'base/toast/toast';
import Loading from 'base/loading/loading';
import FullLoading from 'base/full-loading/full-loading';
import { getImgData, formatImg, getUserId } from 'common/js/util';
import PhotoEdit from 'components/photo-edit/photo-edit';
import { setCookie } from "../../common/js/cookie";

const MAX_LENGTH = 12;

export default {
    name:'offine',
    data() {
        return {
            loading: true,
            title: '正在载入...',
            moneyNum:'',
            pdf:'',
            account:'',
            currentItem: null,
            text: '',
            photos: [],
            token: '',
            message:'',
            accountNumber:'',
        }
    },
    created() {
        this.multiple = true;
        this.uploadUrl = 'http://up-z0.qiniu.com';
    },
    methods:{
        sendMoney(){
            this.loading = true;
            if(this.photos.length > 0){
                sendMoney(this.accountNumber,this.moneyNum * 1000, this.photos[0].key).then(res => {
                    if (res.code !== '') {
                        this.photos = [];
                        this.moneyNum = '';
                        this.checkUser();
                    } else {
                        this.text = '提交失败';
                        this.$refs.toast.show();
                    }
                }).catch(() => this.loading = false);
            }else{
                this.loading = false;
                this.text = '请上传图片';
                this.$refs.toast.show();
            }
        },
        checkUser() {
          checkRed(getUserId()).then(res => {
            setCookie('isWare', res.isWare);
            this.loading = false;
            this.text = '提交成功，待审核';
            this.$refs.toast.show(() => {
              if (res.result == '0' || res.result == '1' || res.result == '2'
                || res.result == '3' || res.result == '4' || res.result == '6') {
                this.$router.push('/login/reCharge');
                // this.$router.push('/home');
              } else {
                this.$router.push('/home');
              }
            });
          }).catch(() => this.loading = false);
        },
        /**
         * 选中要操作的图片
         * */
        choseItem(index) {
            let item = this.photos[index];
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
            let index = this.photos.findIndex((photo) => {
            return photo.key === key;
            });
            let item = this.photos[index];
            item.ok = false;
            item.preview = base64;
            this.photos.splice(index, 1, item);
            this.currentItem = item;
            this.uploadPhoto(base64, key).then(() => {
            // 再次获取当前图片的位置，防止在上传过程中有其它图片被删除，导致下标改变
            index = this.photos.findIndex((photo) => {
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
            let index = this.photos.findIndex((photo) => {
            return photo.key === key;
            });
            this.deletePhoto(index);
        },
        /**
         * 从相册中选择图片
         * */
        fileChange(e) {
            let files;
            if (e.dataTransfer) {
            files = e.dataTransfer.files;
            } else if (e.target) {
            files = e.target.files;
            }
            if (this.photos.length + files.length > MAX_LENGTH) {
            this.text = '图片最多上传12张';
            this.$refs.toast.show();
            files = Array.prototype.slice.call(files, 0, MAX_LENGTH);
            }
            let self = this;
            let len = files.length;
            for (let i = 0; i < files.length; i++) {
            (function (i) {
                let file = files[i];
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
                    self.photos.push(item);
                    self.uploadPhoto(data, item.key).then(() => {
                    item = {
                        ...item,
                        ok: true
                    };
                    self.updatePhotos(item);
                    }).catch((err) => {
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
            this.text = error.body && error.body.error || `${error.message}:10M` || '图片上传出错';
            this.$refs.toast.show();
        },
        getSrc(photo) {
            let url = photo.preview || formatImg(photo.key);
            this.pdf = url;
            return url;
        }
    },
    mounted(){
        this.accountNumber = this.$route.query.accountNumber;
        Promise.all([
          queryAmount(this.accountNumber),
          getQiniuToken()
        ]).then(([res, res1]) => {
            this.loading = false;
            this.account = res.amount;
            this.token = res1.uploadToken
        }).catch(() => this.loading = false);
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
</style>
