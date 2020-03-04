<template>
  <div :class="['activity819','fck','fck'+$route.query.code]" :key="$route.query.url">
    <div
      :class="['fckWrap','fckWrap'+$route.query.code]"
      v-if="showDom"
      :style="style1"
      id="canvasPoster"
    >
      <img :src="style1Img" alt class="style1Img" id="style1Img" />
      <div :class="['avatarWrap','avatarWrap'+$route.query.code]" v-if="$route.query.code=== '3'">
        <div :class="['avatar_bg','avatar_bg'+$route.query.code]">
          <!-- <div class="avatarMain" :style="{'backgroundImage': `url(${synthesisImg})`}"></div> -->
          <!-- <img :src="require('../../../../assets/819/style1Img.png')" alt /> -->
          <img :class="['avatarMain','avatarMain'+$route.query.code]" :src="synthesisImg" alt />
          <div :class="['r'+$route.query.code]">
            <span>{{randomHb_txt}}</span>
          </div>
        </div>
      </div>
      <div class="avatarWrap" v-else>
        <div class="avatar_bg">
          <!-- <div class="avatarMain" :style="{'backgroundImage': `url(${synthesisImg})`}"></div> -->
          <!-- <img :src="require('../../../../assets/819/style1Img.png')" alt /> -->
          <img class="avatarMain" :src="synthesisImg" alt />
        </div>
      </div>
      <div class="desc">
        <img :src="computedFc" @load="imgLoad(3)" alt />
      </div>
      <div class="zsbk">
        <img
          class="iconbk"
          src="src1/assets/819/style819_white.png"
          v-if="$route.query.code=== '1' || $route.query.code=== '3' || $route.query.code=== '4' || $route.query.code=== '6'"
          alt
        />
        <img class="iconbk" src="src1/assets/819/style819_red.png" v-else alt />
        <span v-if="$route.query.code=== '5'" style="min-height: .6rem">知识百科：{{randomZs_txt}}</span>
        <span v-else>知识百科：{{randomZs_txt}}</span>
      </div>

      <div
        :class="['footer','footer'+$route.query.code,$route.query.code=== '3'?'padd':$route.query.code=== '6'?'padd':'']"
      >
        <div class="footer_l">
          <img
            src="src1/assets/819/footer_l_3.png"
            v-if="$route.query.code=== '3' || $route.query.code=== '4'"
            alt
          />
          <img src="src1/assets/819/footer_l.png" v-else alt />
        </div>
        <div :class="['footer_r','footer_r'+ $route.query.code]">
          <div class="txt">
            <p>扫描二维码</p>
            <p>我也生成一张风采卡</p>
          </div>
          <div class="qrCode" id="qrCode">
            <!-- <img src="https://imageysz.yxj.org.cn/AC135E1B016A10D37B2D57681F660F2C" alt /> -->
          </div>
        </div>
      </div>
    </div>
    <img class="resuImg" :src="dataImg" v-if="dataImg" alt />
    <!-- 重新换装 -->
    <y-button
      :class="['fck_btn'+$route.query.code,synthesisTotal+''=== '0'?'fck_btn-true':is_activity === 2 ? 'fck_btn-true':'']"
      type="fck_btn"
      :disable="false"
      @handleClick="confirmHz"
    >重新换装（{{synthesisTotal}}次）</y-button>

    <!-- <div class="fck_btn">重新换装（{{synthesisTotal}}次）</div> -->

    <!-- 翻转有惊喜 -->
    <div :class="['fz','fz'+ $route.query.code]">
      <!-- <img
        src="../../../../assets/819/fzyjx_red.png"
        class="fz_img"
        v-if="$route.query.code=== '2' || $route.query.code=== '3' || $route.query.code=== '4'   || $route.query.code=== '5'|| $route.query.code=== '1'"
        @click="$router.push({path:'/jfrw'})"
        alt
      />
      <img
        src="../../../../assets/819/fzyjx.png"
        class="fz_img"
        v-else
        @click="$router.push({path:'/jfrw'})"
        alt
      />-->
      <img
        src="src1/assets/819/fzyjx.png"
        class="fz_img"
        v-if="$route.query.code=== '1' || $route.query.code=== '6'"
        @click="$router.push({path:'/jfrw'})"
        alt
      />
      <img
        src="src1/assets/819/fzyjx_red.png"
        class="fz_img"
        v-else
        @click="$router.push({path:'/jfrw'})"
        alt
      />
    </div>
  </div>
</template>
<script>
import { getUrlParam } from '@/utils/func'
import { mapActions, mapMutations } from 'vuex'
import storage from 'storejs'
import share from '../../../../utils/share'
import QRCode from 'qrcode2'
import html2canvas from 'html2canvas'
import { setTimeout } from 'timers'
import yButton from '@/components/common/yButton'
import mixin819 from '../../../../utils/mixin819'
import { Dialog, Toast } from 'vant'
import serviceApi from '../../../../core/serviceAPI'

export default {
  components: {
    yButton
  },
  mixins: [mixin819],
  data () {
    return {
      synthesisTotal: this.$route.query.total || this.$route.query.count,
      showDom: true,
      dataImg: '',
      dataHb: [
        '从穿上白大褂那天起，救死扶伤就成为了责任和使命！',
        '做世上跑得最快的人，在分秒之间赢过死神！',
        '做世上最有力气的人，每一天都在扛起生命的重量！',
        '直面淋漓的鲜血，在高压下挥舞着手中的柳叶刀，与死神争分夺秒!',
        '妙手在左，仁心在右，能拯救生命的，除了高科技，还有温柔和善意！',
        '所谓生命的奇迹，不过是有人不肯放弃！',
        '只要一息尚存，都会竭尽全力！',
        '我也怕血，只是拿起手术刀，就成了超人！',
        '用真诚的心，善待生命；用真诚的爱，延续生命。',
        '救死扶伤的战场上，护佑生命的最前线，我就在这里！'
      ],
      dataZs: [
        '奥美沙坦酯氨氯地平片，强效降压，降压达标率接近85%',
        '奥美沙坦酯氨氯地平片，平稳降压，有效控制24h血压',
        '奥美沙坦酯氨氯地平片 ，安全性佳，96.3%的患者耐受性好',
        '奥美沙坦酯氨氯地平片 ，依从性高，显著改善生活质量',
        '奥美沙坦酯氨氯地平片 ，强强联合，全程心血管保护',
        '奥美沙坦酯/氨氯地平 SPC显著提高血压达标率，可有效应对血压季节变异',
        '奥美沙坦酯片，新一代ARB，更强效、更平稳、更高达标',
        '奥美沙坦平稳，显著降低24h收缩压与舒张压',
        '真实世界研究：与其他ARB相比，初始奥美沙坦治疗的远期心脑血管事件发生率更低',
        '奥美沙坦较其他ARB更有效降低CKD患者的蛋白尿',
        '荟萃分析：奥美沙坦强效，24h降压幅度优于其他六种ARB'
      ],
      randomHb_txt: '从穿上白大褂那天起，救死扶伤就成为了责任和使命',
      randomZs_txt: '奥美沙坦酯氨氯地平片，强效降压，降压达标率接近85%',
      style1: {
        color:
          this.$route.query.code === '2'
            ? 'rgba(147, 28, 32, 1)'
            : this.$route.query.code === '5'
              ? 'rgba(147, 28, 32, 1)'
              : '#fff'
      },
      style1Img: require(`./src1/assets`),
      imgData: {}, // 人头数据
      arrImg: [], // 判断图片有没有加载完
      hongse: [
        // 风采大赏
        require('../../../../assets/819/h1.png'),
        require('../../../../assets/819/h2.png'),
        require('../../../../assets/819/h3.png'),
        require('../../../../assets/819/h4.png'),
        require('../../../../assets/819/h5.png'),
        require('../../../../assets/819/h6.png'),
        require('../../../../assets/819/h7.png'),
        require('../../../../assets/819/h8.png'),
        require('../../../../assets/819/h9.png'),
        require('../../../../assets/819/h10.png')
      ],
      baise: [
        // 风采大赏
        require('../../../../assets/819/b1.png'),
        require('../../../../assets/819/b2.png'),
        require('../../../../assets/819/b3.png'),
        require('../../../../assets/819/b4.png'),
        require('../../../../assets/819/b5.png'),
        require('../../../../assets/819/b6.png'),
        require('../../../../assets/819/b7.png'),
        require('../../../../assets/819/b8.png'),
        require('../../../../assets/819/b9.png'),
        require('../../../../assets/819/b10.png')
      ],
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
      }
    }
  },
  created () {
    changeTitle('穿上白大褂，向医者致敬')
    this.isRepresent = storage.get('userInfoAMY') ? 'Y' : 'N'

    if (this.isRepresent !== 'N') {
      // 如果为非代表用户，进入专区首页
      this.$router.push({
        path: '/'
      })
    }
    this.synthesisTotal = this.$route.query.total || this.$route.query.count
    this.randomHb_txt = this.dataHb[
      Math.floor(Math.random() * this.dataHb.length - 1 + 1)
    ]
    this.randomZs_txt = this.dataZs[
      Math.floor(Math.random() * this.dataZs.length - 1 + 1)
    ]
    this.init819Activity().then(res => {})
    this.hideLoad()
  },
  computed: {
    // 合成的图像
    synthesisImg () {
      let img = this.$route.query.url
      return img
    },
    /**
     * 计算风采大赏的图片
     */
    computedFc () {
      let random = Math.floor(Math.random() * this.hongse.length - 1 + 1)
      console.log(random, 'random') // 红色和白色的数量相同
      let img = this.baise[0]
      let code = this.$route.query.code
      if (code === '2' || code === '5') {
        img = this.hongse[random] // 2 和5 采用 红色文字
      } else {
        img = this.baise[random] // 其他白色
      }
      return img
    },
    t () {
      let img = this.$route.query.total || this.$route.query.count
      return img
    }
  },
  mounted () {
    try {
      this.baoSaveReport({
        PageName: '819医师节活动-风采卡页面',
        EventID: '1',
        ControlName: '',
        Description: '风采卡页面'
      })
    } catch (error) {
      console.log(error)
    }
    share({
      title: '8·19 医师节，彰显医者风采',
      desc: '敬畏生命，致敬医者',
      link: `${location.origin}${location.pathname}#/activity819ysd`,
      imgUrl: 'https://imageysz.yxj.org.cn/1565578562066.png'
    })
    // try {
    //   this.baoSaveReport({
    //     PageName: "819医师节活动",
    //     EventID: "1",
    //     ControlName: "",
    //     Description: "首页访问"
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  },

  methods: {
    ...mapMutations(['hideLoad', 'showNetLoad', 'hideNetLoad']),
    ...mapActions({
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    /**
     * 循环不重复
     */
    async forSet (maxNum) {
      let code = this.$route.query.code // 现在的皮肤

      try {
        let amySkinCodeArr = storage.get('amySkinCode') // [2,3]

        if (amySkinCodeArr) {
          console.log(amySkinCodeArr.includes(code), 'amySkinCodeArr')
          if (amySkinCodeArr.includes(code)) {
            return amySkinCodeArr
          }
        } else {
          let retult = []
          code = Number(code)

          let ci = maxNum - 2
          let cmaxI = maxNum + 1
          console.log(cmaxI, 'cmaxI')
          // let amyCode = code;
          // storage.set('amyCode', "amyCode");
          // let prevCode = storage.get(amyCode, "amyCode");

          for (let i = ci; i < cmaxI; i++) {
            console.log(i, 'i')
            console.log(i === code, 'i = code')
            if (i === code) {
              continue
            }
            retult.push(i)
          }
          storage.set('amySkinCode', retult)
          return retult
        }
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * 合成
     * @param {code} 模板标志
     * @param {composeName} 合成模板
     * @param {fileName} 人脸图像
     */
    async _TrueUpload () {
      console.log('_TrueUpload', '-----------------')
      let imgData = storage.get('amyImgData') // 获取本地存下的人头
      if (!imgData) {
        let p = {
          fileName: this.$route.query.url.replace(/(.*\/)*([^.]+)/i, '$2'),
          code: this.$route.query.code,
          sex: '1'
          // sex:res.data.sex
        }
        // var src='https://studioyszimg.yxj.org.cn/2019081315224100033.jpg';
        // src =src.replace(/(.*\/)*([^.]+)/i,"$2");
        storage.set('amyImgData', p) // 存下人头 风采卡页面用
      }
      imgData = storage.get('amyImgData') // 获取本地存下的人头
      let sex = imgData.sex // 获取男女
      let maxNum = sex === '1' ? 6 : 3
      let code = this.$route.query.code // 现在的皮肤

      let skinArr = await this.forSet(maxNum) // [2,3]
      let amySkinCodeArr = storage.get('amySkinCode') // [2,3]
      console.log(amySkinCodeArr, 'amySkinCodeArr')
      if (!imgData) {
        console.log('activity819ysd', '-----------------')
        this.$router.push({
          path: '/activity819ysd'
        })
        return
      }
      console.log(
        amySkinCodeArr[this.synthesisTotal - 1],
        'skinArr[this.synthesisTotal - 1]'
      )
      let params = {
        fileName: imgData.fileName,
        composeName: '201908160142100019.png',
        // composeName: this.composeName[imgData.sex][
        //   [skinArr[this.synthesisTotal - 1]]
        // ],
        // composeName: this.composeName[this.imgData.sex][1],
        code: amySkinCodeArr[this.synthesisTotal - 1]
      }
      switch (params.code) {
        case 1: // 女
          params.composeName = '201908160142100019.png'
          break
        case 2: // 女
          params.composeName = '201908160150300020.png'
          break
        case 3: // 女
          params.composeName = '201908160153600021.png'
          break
        case 6: // 男
          params.composeName = '2019081523431800007.png'
          break
        case 5: // 男
          params.composeName = '2019081523423500005.png'
          break
        case 4: // 男
          params.composeName = '2019081523425800006.png'
          break
        default:
          break
      }
      console.log(params, '--params---------------')

      //   switch (params.composeName) {
      //     case "201908160142100019.png": //女
      //       params.code = 1;
      //       break;
      //     case "201908160142100019.png": //女
      //       params.code = 2;
      //       break;
      //     case "2019080817083500007.png": //女
      //       params.code = 3;
      //       break;
      //     case "2019081523423500005.png": //男
      //       params.code = 6;
      //       break;
      //     case "2019081523423500005.png": //男
      //       params.code = 5;
      //       break;
      //     case "2019080817045200003.png": //男
      //       params.code = 4;
      //       break;
      //     default:
      //       break;
      //   }
      serviceApi
        .TrueUpload(params)
        .then(res => {
          if (res.code === 0) {
            Toast('网络繁忙')
            return
          }
          this.$router.push({
            query: { ...res.data }
          })
        })
        .catch(e => {
          Toast('网络繁忙')
          console.log(e, '合成')
        })
    },
    /**
     * 重新换装
     */
    confirmHz () {
      console.log('重新换装')
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
              path: '/'
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
      console.log(this.synthesisTotal, 'synthesisTotal')
      // 每个人最多切换2次模板，每次模板均不同，超过此数，button置灰，点击toast提示：次数已用完
      if (this.synthesisTotal + '' === '0') {
        Toast('次数已用完')
        return
      }
      Dialog.confirm({
        title: '提示',
        message: '请先保存风采卡噢，重新换装之后之前的风采卡将丢失！',
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
    //
    imgLoad (type) {
      console.log(type, 'eeeeeeee')
      //   if (this.arrImg.indexOf(type) >= 0) {
      //     return;
      //   }
      this.arrImg.push(type)
      console.log(this.arrImg, 'arrImg')

      //   if (this.arrImg.length !== 3) {
      //     return;
      //   }

      //      if (this.arrImg.indexOf(type) >= 0) {
      //     return;
      //   }
      setTimeout(() => {
        console.log(this.$route, '------------------------------')
        let total = 0
        if (this.$route.query.total) {
          total = this.$route.query.total
        } else if (this.$route.query.count) {
          total = this.$route.query.count
        } else {
          total = 0
        }
        this.synthesisTotal = total
        this.QCode().then(qr => {
          this.hideNetLoad()
          console.log(qr, 'qer')
          this.$nextTick(() => {
            this.createPoster()
          })
        })
      }, 800)
    },
    // 创建海报
    createPoster () {
      this.showNetLoad()
      const dom = document.getElementById('canvasPoster')
      const style1Img = document.getElementById('style1Img')
      dom.style.height = style1Img.height + 'px'
      console.log(style1Img.height, '-----sryleImg')
      let _this = this
      const element = document.getElementById('canvasPoster')
      const width = style1Img.width
      const height = style1Img.height
      const scaleBy = 3
      const canvas = document.createElement('canvas')
      canvas.width = style1Img.width * scaleBy
      canvas.height = style1Img.height * scaleBy
      canvas.style.width = width * scaleBy + 'px'
      canvas.style.height = height * scaleBy + 'px'
      const context = canvas.getContext('2d')
      context.scale(scaleBy, scaleBy)
      html2canvas(element, {
        async: true,
        useCORS: true,
        logging: false,
        scale: scaleBy,
        canvas,
        width: width,
        height: height
      }).then(function (canvasResult) {
        _this.hideNetLoad()
        _this.hideLoad()
        _this.dataImg = canvas.toDataURL('image/jpeg', 1.0)
        _this.showDom = false
      })

      //   html2canvas(poster, {
      //     dpi: window.devicePixelRatio * 2,
      //     // backgroundColor: "#fff",
      //     removeContainer: true,
      //     imageTimeout: 0,
      //     useCORS: true,
      //     height: style1Img.offsetHeight,
      //     async: true
      //   }).then(canvas => {
      //     this.hideNetLoad();
      //     this.hideLoad();
      //     this.dataImg = canvas.toDataURL("image/jpeg", 1.0);
      //     this.showDom = false;
      //   });
    },
    /**
     * 创建二维码
     */
    QCode () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let qrcode = new QRCode('qrCode', {
            width: 60,
            height: 60, // 高度
            text: `${location.origin}${location.pathname}/#/`
            // text: `https://t.merch.yishengzhan.cn/amyxy/#/?inviteUid='818327007883441210'`
          })
          resolve()
        }, 300)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.fckWrap5 {
  //   height: 6.3rem;
}
.style1Img {
  position: absolute;
  top: 0;
  left: 0;
}
.resuImg {
  width: 3.43rem;
  height: auto;
  margin: 0 auto;
}
.footer2 {
  bottom: 35px !important;
  right: 5px !important;
  margin: 0 !important;
}
.footer5 {
  right: -10px !important;
}
.footer6 {
  bottom: 30px !important;
  right: -10px !important;
}
.fck {
  width: 100%;
  min-height: 100%;
  height: 100%;
  background: #fff;
  padding: 0.2rem 0;
  &2 {
    background: rgba(147, 28, 32, 0.09);
  }
  &5 {
    background: rgba(147, 28, 32, 0.09);
  }
  .desc {
    width: 2.5rem;
    margin: 0.1rem auto;
    // color: #fff;
    font-size: 0.13rem;
    & img {
      width: 100%;
      height: 100%;
      min-height: 0.15rem;
    }
  }

  .iconbk {
    width: 0.12rem;
    display: inline-block;
    vertical-align: top;
  }
  &Wrap {
    width: 3.43rem;
    // min-height: 5.5rem;
    // min-height: 5.46rem;
    overflow: hidden;
    // height: 5.46rem;
    margin: 0 auto;
    text-align: left;
    padding: 0 0.1rem;
    padding-top: 1.4rem;
  }
  .avatarWrap {
    width: 2.05rem;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    // height: 1.8rem;
    .desc {
      margin: 5px 0;
    }
    .avatar_bg {
      width: 100%;
      //   height: 1.8rem;
      & > img {
        width: 2.05rem;
        // height: 2.1rem;
        position: relative;
      }
    }
    .avatarMain {
      position: absolute;
      width: 2.05rem;
      //   height: 1.8rem;
      bottom: 0;
      background-size: 100% 100%;
      background-repeat: no-repeat no-repeat;
      left: 0;
      //   margin-left: -0.09rem;
      //   transform: translate(-50%, 0);
    }
  }
  .padd {
    padding: 0 0.1rem 0 0.2rem;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 5px;
    align-items: center;
    margin-right: 10px;
    position: absolute;
    bottom: 10px;
    right: -10px;
    &_l {
      & > img {
        width: 0.74rem;
      }
    }
    &_r {
      display: flex;
      align-items: center;
      text-align: right;
      margin-right: 15px;
      font-size: 0.12rem;
      .txt {
        margin-right: 5px;
      }
    }
    .qrCode {
      width: 0.56rem;
      height: 0.56rem;
      & > img {
        width: 0.56rem;
        height: 0.56rem;
      }
    }
  }
  .zsbk {
    font-size: 0.1rem;
    padding: 0 0.1rem;
    span {
      display: inline-block;
      vertical-align: middle;
      width: 90%;
    }
  }
  .fck_btn-true {
    background: #ccc !important;
  }
  .y-button.y-button-fck_btn {
    width: 2.53rem;
    height: 0.32rem;
    text-align: center;
    background: rgba(57, 185, 212, 1);
    border-radius: 0.2rem;
    margin: 5px auto;
    line-height: 0.32rem;
    color: #fff;
    position: fixed;
    bottom: 0.65rem;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .fz {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
    position: fixed;
    bottom: 0.1rem;
    left: 50%;
    transform: translate(-50%, 0);
    & > img {
      width: 120px;
    }
  }
  .avatarWrap3 {
    width: 96%;
  }
  .avatar_bg3 {
    display: flex;
    /* width: 1.8rem; */
    height: 2.1rem;
    justify-content: space-between;
    & > img {
      width: 2.12rem !important;
    }
  }
  .avatarMain3 {
    border: 1px solid #fff;
    padding: 5px;
  }
  .r3 {
    width: 0.86rem;
    /* height: 0.86rem; */
    border: 1px solid #fff;
    padding: 0.1rem;
  }
  .footer_r5 {
    color: #fff;
    margin-top: 25px;
  }
  .fz5 {
    bottom: 14px;
  }
  .fck_btn5 {
    bottom: 0.55rem !important;
  }
  .fz_img {
    width: 120px;
    height: 24px;
  }
}
</style>
