<template>
  <div class="activity819 ysd">
    <div class="uploadWrap">
      <div v-if="this.is_activity === 2 || isLogin " @click="clickImg">
        <div class="uploadImg">
          <img :src="require('../../../../assets/819/uploadImg.png')" alt />
        </div>
      </div>
      <div v-else>
        <div class="header_img">
          <avatar-cropper
            @uploading="handleUploading"
            @uploaded="handleUploaded"
            @completed="handleCompleted"
            @changed="handleChanged"
            @error="handlerError"
            :upload-headers="header"
            trigger="#pick-avatar"
            :upload-url="uploadUrl"
            upload-form-name="file"
            mimes="image/*"
          />
          <!-- <img :src="imgUrl||'https://imageysz.yxj.org.cn/1553580093814.png'" alt /> -->
        </div>
        <div class="uploadImg" id="pick-avatar">
          <img :src="imgData.url||require('../../../../assets/819/uploadImg.png')" alt />
        </div>
      </div>

      <div class="desc">上传清晰正面照，生成医生风采海报</div>
      <div class="uploadFooter">
        <y-button type="upload" :disabled="false" @handleClick="confirmBdg">穿上白大褂</y-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getUrlParam } from '@/utils/func'
import { mapActions, mapMutations } from 'vuex'
import storage from 'storejs'
import share from '../../../../utils/share'
import AvatarCropper from '@/components/common/AvatarCropper'
import yButton from '@/components/common/yButton'
import mixin819 from '../../../../utils/mixin819'
import { Dialog } from 'vant'
import { Toast } from 'mint-ui'
import serviceApi from '../../../../core/serviceAPI'

export default {
  mixins: [mixin819],
  components: {
    AvatarCropper,
    yButton
  },
  data () {
    return {
      isRepresent: 'Y', // Y 代表 N 不是代表
      imgUrl: '',
      imgData: {}, // 人头数据
      composeName: {
        // 1 男 2 女
        1: [
          '2019081523431800007.png',
          '2019081523423500005.png',
          '2019081523425800006.png'
        ],
        2: [
          '201908160150300020.png',
          '201908160142100019.png',
          '201908160153600021.png'
        ]
      },
      uploadUrl: `${process.env.VUE_APP_API_HOST}/common/login/upload`,
      header: {
        encrypt:
          storage.get(process.env.VUE_APP_STORAGE_NAME) &&
          storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt
      }
    }
  },
  created () {
    changeTitle('穿上白大褂，向医者致敬')
    this.isRepresent = storage.get('userInfoAMY') ? 'Y' : 'N'
    if (this.isRepresent === 'Y') {
      // 身份判断：如果进入该页面为代表，则直接进入代表端首页
      this.$router.push({
        path: '/activity819'
      })
    }
    this.hideLoad()
  },
  mounted () {
    this.init819Activity().then(res => {})
    // if (this.$route.query.source && this.$route.query.source === "style819") {
    //   return;
    // } else {
    //   // 从重新换装来的
    //   this._is819uploadCount();
    // }
    this._is819uploadCount()

    share({
      title: '8·19 医师节，彰显医者风采',
      desc: '敬畏生命，致敬医者',
      link: `${location.origin}${location.pathname}#/activity819ysd`,
      imgUrl: 'https://imageysz.yxj.org.cn/1565578562066.png'
    })
    try {
      this.baoSaveReport({
        PageName: '819医师节活动-医师端',
        EventID: '1',
        ControlName: '',
        Description: '首页访问'
      })
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    isLogin () {
      return !storage.get(process.env.VUE_APP_STORAGE_NAME)
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    // 判断活动详情页面还是风采页面
    // 状态判断：如果已提交照片并生成风采卡用户，则直接进入风采卡页面
    _is819uploadCount () {
      let params = {}
      let m = {
        code: 1,
        data: {
          code: '1',
          count: 2,
          url: 'https://studioyszimg.yxj.org.cn/2019080520285600000.jpg',
          userId: '385690212006642733'
        },
        encrypt: '',
        msg: 'success'
      }
      //   if (m.data.code) {
      //     // 根据data判断； 如果为空就是活动详情页面，不为空就是风采卡页面
      //     this.$router.replace({
      //       path: "/style819",
      //       query: { ...m.data, type: "old" }
      //     });
      //   }
      serviceApi.is819uploadCount(params).then(res => {
        if (res.code === 0) {
          Toast('网络繁忙')
          return
        }
        if (res.data && res.data.code) {
          let p = {
            fileName: res.data.fileName,
            code: res.data.code,
            sex: res.data.sex
            // sex:res.data.sex
          }
          storage.set('amyImgData', p) // 存下人头 风采卡页面用
          // 根据data判断； 如果为空就是活动详情页面，不为空就是风采卡页面
          this.$router.replace({
            path: '/style819',
            query: { ...res.data, type: 'index' }
          })
        }
        console.log(res, '_is819uploadCount')
      })
    },
    clickImg () {
      console.log(this.isLogin, 'isLogin')
      if (this.is_activity === 2) {
        Toast('活动已结束')
        return
      }
      if (this.isLogin) {
        if (
          !storage.get(process.env.VUE_APP_STORAGE_NAME) ||
          (storage.get(process.env.VUE_APP_STORAGE_NAME) &&
            !storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt)
        ) {
          Dialog.confirm({
            title: '提示',
            message: '未登录无法进行此操作！',
            confirmButtonText: '去登录',
            cancelButtonText: '再看看',
            showCancelButton: true
          })
            .then(() => {
              // on confirm
              this.$router.push({
                path: '/login'
              })
            })
            .catch(() => {
              // on cancel
            })
        }
      }
    },
    /**
     * 穿上白大褂
     */
    confirmBdg () {
      console.log('穿上白大褂')
      if (
        !storage.get(process.env.VUE_APP_STORAGE_NAME) ||
        (storage.get(process.env.VUE_APP_STORAGE_NAME) &&
          !storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt)
      ) {
        Dialog.confirm({
          title: '提示',
          message: '未登录无法进行此操作！',
          confirmButtonText: '去登录',
          cancelButtonText: '再看看',
          showCancelButton: true
        })
          .then(() => {
            // on confirm
            // on confirm
            this.$router.push({
              path: '/login'
            })
          })
          .catch(() => {
            // on cancel
          })
        return
      }
      console.log(this.is_activity, 'this.is_activity = 2;')
      if (this.is_activity === 2) {
        Toast('活动已结束')
        return
      }
      // 判断图片
      if (!this.imgData.url) {
        Toast('请上传照片')
        return
      }

      Dialog.confirm({
        title: '提示',
        message: '穿上白大褂后，则不能再修改图片，点击确定即可生成本人风采照',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true
      })
        .then(() => {
          // on confirm
          this._TrueUpload()
        })
        .catch(() => {
          // on cancel
        })
    },
    handleChanged (file) {
      // mess;
      console.log(file)
    },
    handleUploading () {
      console.log(333)
    },
    handleUploaded (res) {
      if (res.code === 0) {
        Toast(res.msg)
        return
      }
      this.hideLoad()
      console.log(res, 'res----------')
      //   this.portraitUrl = res.data.url;
      this.imgData = res.data
      //   this.imgUrl = res.data;
    },
    handleCompleted () {
      console.log(111)
    },
    handlerError (err) {
      Toast(err)
    },
    /**
     * 合成
     * @param {code} 模板标志
     * @param {composeName} 合成模板
     * @param {fileName} 人脸图像
     */
    _TrueUpload () {
      console.log(
        this.composeName[this.imgData.sex][0],
        ' this.composeName[this.imgData.sex]'
      )

      let params = {
        fileName: this.imgData.fileName,
        // composeName: "https://imageysz.yxj.org.cn/1565068642362.png",
        composeName: this.composeName[this.imgData.sex][
          Math.floor(Math.random() * 2 + 1)
        ],
        // composeName: this.composeName[this.imgData.sex][1],
        code: Math.floor(Math.random() * 2 + 1)
      }
      storage.set('amyImgData', this.imgData) // 存下人头 风采卡页面用
      switch (params.composeName) {
        case '201908160142100019.png': // 女
          params.code = 1
          break
        case '201908160150300020.png': // 女
          params.code = 2
          break
        case '201908160153600021.png': // 女
          params.code = 3
          break
        case '2019081523431800007.png': // 男
          params.code = 6
          break
        case '2019081523423500005.png': // 男
          params.code = 5
          break
        case '2019081523425800006.png': // 男
          params.code = 4
          break
        default:
          break
      }
      serviceApi
        .TrueUpload(params)
        .then(res => {
          console.log(res, 'res-----------')
          if (res.code === 0) {
            Toast('网络繁忙')
            return
          }
          this.$router.push({
            path: '/style819',
            query: { ...res.data }
          })
        })
        .catch(e => {
          Toast('网络繁忙')
          console.log(e, '合成')
        })
    }
  }
}
</script>
<style lang="less" scoped>
.ysd {
  width: 100%;
  min-height: 100%;
  height: 100%;

  background: rgba(120, 8, 16, 1) url(src1/assets/819/ysd_bg.png)
    no-repeat no-repeat;
  background-size: contain;
  padding-top: 2.7rem;
  .uploadWrap {
    width: 2.6rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    color: #222;
    .uploadImg {
      img {
        width: 1rem;
        height: 1rem;
      }
    }
    .desc {
      font-size: 0.12rem;
      margin: 0.1rem;
      color: #fff;
    }
    .uploadFooter {
      width: 100%;
    }
    .y-button.y-button-upload {
      width: 100%;
      height: 0.4rem;
      border-radius: 0.2rem;
      background: rgba(19, 133, 138, 1);
    }
  }
}
</style>
