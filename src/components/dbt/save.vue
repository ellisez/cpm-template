<template>
  <div class="saveWrap" style="min-height:100%">
    <div class="poster" v-if="showDom" id="canvasPoster">
      <div class="top">
        <img :src="dataUrl" alt @load="imgLoad" />
        <!-- <div class="qrBox"> -->
        <div class="box">
          <div class="name">{{from}}</div>
          <div class="codeImg" style="width:.97rem;" id="qrCode"></div>
          <div class="msg">{{msg}}</div>
        </div>
        <!-- </div> -->
      </div>
    </div>
    <img style="width:100%;height:100%" :src="dataImg" v-if="dataImg" alt />

    <div class="btn">
      <div @click="back" class="InvitationBtn cancel">修改一下</div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import storage from 'storejs'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode2'
import share from '../../utils/share'
import { changeTitle } from '../../utils/func'
export default {
  data () {
    return {
      msg: '',
      from: '',
      dataUrl: '',
      dataImg: '',
      showDom: true,
      userInfo: {}
    }
  },
  created () {
    this.from = this.$route.query.from
    this.msg = this.$route.query.msg
    this.dataUrl = this.$route.query.dataUrl
    this.userInfo = storage('amyxy')

    changeTitle('长按保存海报')
    this.hideLoad()
  },
  mounted () {
    this.QCode()

    share({
      title: '傲美云学院',
      desc: '智能学院在手，心血管医学知识一网打尽 ！',
      link: `${location.origin}${location.pathname}#/sharePosterDBT?${
        location.href.split('?')[1]
      }`,
      imgUrl: 'http://studioimage.yxj.org.cn/1529378584742.png'
    })
  },
  methods: {
    ...mapMutations(['hideLoad']),
    // 创建海报
    createPoster () {
      const poster = document.getElementById('canvasPoster')
      html2canvas(poster, {
        dpi: window.devicePixelRatio * 2,
        backgroundColor: '#fff',
        useCORS: true,
        scale: 2,
        async: true
      }).then(canvas => {
        this.dataImg = canvas.toDataURL('image/jpeg')
        this.showDom = false
      })
    },

    //
    imgLoad () {
      this.createPoster()
    },
    QCode () {
      const userInfo = storage(`userInfoAMY`)
      let qrcode = new QRCode('qrCode', {
        width: 100,
        height: 100, // 高度
        text: `${location.origin}${location.pathname}/#/?inviteUid=${userInfo.cid}`
        // text: `https://t.merch.yishengzhan.cn/amyxy/#/?inviteUid='818327007883441210'`
      })
    },
    back () {
      this.$router.push({
        path: '/posterDBT',
        query: {
          msg: this.msg,
          userName: this.from
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.saveWrap {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #fff;
}
.poster {
  width: 100%;
  height: 100%;
  background: #fff;
  position: static;
  .top {
    position: relative;
    // margin-bottom: 0.3rem;
    img {
      width: 100%;
    }
    // .qrBox {
    //   width: 300px;
    //   height: 300px;
    //   // background: #fff;
    //   position: absolute;
    //   bottom: 8%;
    //   left: 0;
    //   right: 0;
    //   margin: 0 auto;
    //   border-radius: 6px;
    // border: 1px solid #f2f2f2;
    .name {
      width: 100%;
      font-size: 0.12rem;
      font-weight: 400;
      color: #666;
      line-height: 0.44rem;
      display: block;
      position: absolute;
      top: 5%;
    }
    .codeImg {
      margin: 0 auto;
      position: absolute;
      top: 22%;
      left: 50%;
      transform: translate(-50%, 0);
    }
    .msg {
      width: 100%;
      left: 0%;
      top: 62%;
      font-size: 0.12rem;
      position: absolute;
      padding: 0 0.1rem;
      text-align: left;
      text-indent: 2em;
      font-size: 0.1rem;
      font-weight: 400;
      color: #4a4a4a;
      word-break: break-all;
    }
    // }
  }
}
.btn {
  height: 0.8rem;
  display: flex;
  justify-content: space-around;
  margin-bottom: 0;
  align-items: center;
}
.InvitationBtn {
  height: 0.4rem;
  margin: 0 auto;
  width: 90%;
  line-height: 0.4rem;
  background: linear-gradient(
    315deg,
    rgba(32, 42, 161, 1) 0%,
    rgba(75, 50, 228, 1) 100%
  );
  box-shadow: 0px 1px 4px 0px rgba(124, 149, 254, 0.15);
  border-radius: 0.05rem;
  margin: auto;
  text-align: center;
  color: #fff;
  font-size: 0.15rem;
  border-radius: 0.2rem;
}
.cancel {
  background: rgba(155, 155, 155, 1);
  box-shadow: 0px 2px 4px 0px rgba(155, 155, 155, 0.5);
}
.box {
  position: absolute;
  top: 43%;
  width: 2.56rem;
  min-height: 2.6rem;
  background: #fff;
  left: 50%;
  transform: translate(-50%, 0);
  border-radius: 8px;
}
</style>
