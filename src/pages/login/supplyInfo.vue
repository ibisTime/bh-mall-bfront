<template>
  <div class="offine">
      <div class="login">
        <div>
            <span>证件号码</span>
            <input v-model="idNo" v-validate="'required'" type="text" name="idNo" placeholder="请输入证件号码">
        </div>
        <div>
            <span>介绍人手机号</span>
            <input v-model="introducer" v-validate="'required'" type="text" name="idNo" placeholder="请输入介绍人">
        </div>
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
      <toast ref="toast" :text="text"></toast>
      <span class="btn" @click="submit">确定</span>
  </div>
</template>
<script>
import {supplyInfo,queryAmount,isRealName} from 'api/baohuo'
import {getQiniuToken} from 'api/general'
import BScroll from 'better-scroll';
import EXIF from 'exif-js';
import Qiniu from 'base/qiniu/qiniu';
import Toast from 'base/toast/toast';
import Loading from 'base/loading/loading';
import {getImgData, formatImg} from 'common/js/util';
import PhotoEdit from 'components/photo-edit/photo-edit';

const MAX_LENGTH = 12;

export default {
    name:'offine',
    data(){
        return{
            moneyNum:'',
            pdf:'',
            account:'',
            currentItem: null,
            text: '',
            photos1: [],
            photos2: [],
            photos3: [],
            photos111: '',
            photos222: '',
            photos333: '',
            token: '',
            message:'',
            accountNumber:'',
            idKind:'',
            idNo:'',
            introducer:''
        }
    },
    created() {
        this.multiple = true;
        this.uploadUrl = 'http://up-z0.qiniu.com';
    },
    methods:{
        submit(){
            isRealName(this.userId).then(res => {
                console.log(this.idNo);
                if(res.isSuccess) {
                    // 需要实名
                    if(this.idNo && this.photos1[0].key && this.photos2[0].key && this.photos3[0].key) {
                        supplyInfo('1',this.idNo,this.introducer,this.photos1[0].key,this.photos2[0].key,this.photos3[0].key,this.userId).then(res => {
                            // alert(res);
                            // alert('4');
                            if(res.code !== '') {
                                this.text = '提交成功，待审核'
                                this.$refs.toast.show(this.tiaozhuan);
                                this.photos = []
                                this.moneyNum = ''
                            } else {
                                this.text = '请确认信息全部填写完整';
                                this.$refs.toast.show();
                            }
                        }) 
                    }
                } else {
                    if(!this.photos1[0]) {
                        this.photos111 = ''
                    }
                    if(!this.photos2[0]) { 
                        this.photos222 = ''
                    }
                    if(!this.photos3[0]) {
                        this.photos333 = ''
                    }
                    if(!this.idNo) {
                        this.idNo = ''
                    }
                    if(!this.introducer) {
                        this.introducer = ''
                    }
                    supplyInfo('1',this.idNo,this.introducer,this.photos111,this.photos222,this.photos333,this.userId).then(res => {
                        // alert(res);
                        // alert('4');
                        if(res.code !== '') {
                            this.text = '提交成功，待审核'
                            this.$refs.toast.show(this.tiaozhuan);
                            this.photos = []
                            this.moneyNum = ''
                        }
                    })
                }
            })
        },
        tiaozhuan() {
          this.$router.push('/login/replying')
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
                    if(index == '1') {
                      self.photos1.push(item);
                    } else if (index == '2') {
                      self.photos2.push(item);
                    } else {
                      self.photos3.push(item);
                    }
                    self.uploadPhoto(data, item.key).then(() => {
                      item = {
                          ...item,
                          ok: true
                      };
                      self.updatePhotos(item, index);
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
        updatePhotos(item, index) {
          if(index == '1') {
            for (let i = 0; i < this.photos1.length; i++) {
              if (this.photos1[i].key === item.key) {
                  this.photos1.splice(i, 1, item);
                  break;
              }
            }
          } else if(index == '2') {
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
        this.userId = this.$route.query.userId
        //查询账户余额

        //查询七牛token
        getQiniuToken().then(res => {
            this.token = res.uploadToken
        })
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
    .textInfo {
        font-size: $font-size-large-s;
    }
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
