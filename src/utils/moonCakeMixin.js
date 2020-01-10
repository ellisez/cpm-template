import storage from 'storejs'
import { baseUrl, basemoon_Url } from '../interfaceUrl'
import { mapMutations } from 'vuex'
import { Toast } from 'mint-ui'
import { getUrlParam } from './func'
import { POINT_CONVERSION_COMPRESSED } from 'constants'
// amyfrom "https://t.merch.yishengzhan.cn/amyxy/#/pulpit?type=1"
const moonCakeMixin = {
  data () {
    return {
      nameRoute: this.$route.name, // 路由名字
      currentComponent: 'firstMoonCake', // 首次弹窗
      timer: null,
      basemoonStorage: storage.get('amy'),
      userInfoMoonCake: storage.get('userInfoMoonCake'),
      moonConfig: {
        currentComponent: this.$route.name === 'home' ? 'firstMoonCake' : 'detailMoonCake'
      },
      disableObj: { showMoonCakeMixin: true },
      moonCakeObj: {} // 月饼必要信息
    }
  },
  created () {
    if (storage.get('amy') && !storage.get('amy').hasOwnProperty('encrypt')) {
      storage.set('userInfoMoonCake', this.disableObj)
      return
    }
    if (!this.userInfoMoonCake) {
      this.getMoonBaseInftFist().then(res => {
        if (res.body.code === 1) {
          this.moonCakeObj = res.body.data // 保存月饼所需要的用户信息
          this.moonCakeObj.nowDate = new Date().toLocaleDateString() // 对比时间
          this.moonCakeObj.areaCode = 'AMYXY' // 后台返回的是AMYXY
          this.moonCakeObj.companyCode = 'DYSG-GS' // 后台返回的是DYSG-GS
          this.moonCakeObj.showMoonCakeMixin = !!getUrlParam('showMoonCakeMixin') // 首次弹框是否谈过 -- 赛诺菲跳转不谈
          this.userInfoMoonCake = this.moonCakeObj
          storage.set('userInfoMoonCake', this.moonCakeObj) // 保存用户信息
          if (this.isPary === 0) {
            this.firstModel() // 月饼
          }
          this.isWhereToGo() // 二维码 代表跳转
        }
      })
    }
    // this.setUserInfoMoonCake_store(storage.get("amy")) // 设置
    if (this.userInfoMoonCake) {
      if (this.isPary === 0) {
        this.firstModel() // 月饼
      }
      this.isWhereToGo() // 二维码 代表跳转
    }
    // this.jlDetailModel('0') // 测试奖励月饼
    this.setUserInfoMoonCake_store(storage.get('amy')) // 设置
  },
  beforeRouteLeave (to, from, next) {
    clearTimeout(this.timer)
    // 删除弹框
    let items = [...document.querySelectorAll('.h-model')]
    let len = items.length
    if (items.length > 0) {
      for (let i = 0; i < len; i++) {
        document.body.removeChild(items[i])
      }
    }
    next()
  },
  computed: {
    inviteUid () { // 目标用户
      return storage.get('userInfoMoonCake') && storage.get('userInfoMoonCake').inviteUid || this.moonCakeObj.inviteUid
    },
    typeMoonCake () { // 代表用户
      return storage.get('userInfoMoonCake') && storage.get('userInfoMoonCake').type === 'A' || this.moonCakeObj.type === 'A'
    },
    /**
         * 30号下线banner
         *  1 隐藏  0 显示
         *
         */
    isPary_banner () {
      let c = new Date().getTime()
      let s = new Date('2018/9/27').getTime()
      console.log(s, 'banner')
      console.log(c, 'banner-c')
      console.log(c < s, 'c<s')
      if (c < s) {
        return 0
      } else {
        return 1
      }
    },
    /**
         * 24-25日24时，不弹活动弹窗，不能收集月饼，可兑换礼品
         *  1 不弹活动弹窗，
         *
         */
    isPary () {
      let c = new Date().getTime()
      let s = new Date('2018/9/25').getTime()
      console.log(c, 'pary')
      if (c < s) {
        return 0
      } else {
        return 1
      }
    },
    /**
         * 有没有到活动开始时间 --倒计时
         *  0 活动未开始
         *
         */
    isPary_countDown () {
      let c = new Date().getTime()
      let s = new Date('2018/9/18').getTime()
      if (c < s) {
        return 0
      } else {
        return 1
      }
    },
    showMoonCakeMixin () {
      return storage.get('userInfoMoonCake') && storage.get('userInfoMoonCake').showMoonCakeMixin || this.moonCakeObj.showMoonCakeMixin
    },
    showNowtimeDay () {
      let nowDay = new Date().toLocaleDateString()
      let storaDay = storage.get('userInfoMoonCake') && storage.get('userInfoMoonCake').nowDate || this.moonCakeObj.nowDate
      if (nowDay !== storaDay) {
        this.userInfoMoonCake.nowDate = nowDay
        this.userInfoMoonCake.showMoonCakeMixin = false
        storage.set('userInfoMoonCake', this.userInfoMoonCake)
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapMutations(['setUserInfoMoonCake_store']),
    /**
      * 获取用户基本信息
      *
      */
    getMoonBaseInftFist () {
      let data = {
        userId: this.basemoonStorage.userId,
        areaCode: this.basemoonStorage.areaCode,
        companyCode: this.basemoonStorage.companyCode
      }
      let encrypt = storage.get('amy').encrypt
      return this.$http.post(baseUrl + '/accounts/mobile/base/info', JSON.stringify(data),
        {
          emulateJSON: true,
          headers: { 'Content-Type': 'application/json;charset=UTF-8', 'encrypt': encrypt }
        })
    },
    /**
         * 首次弹框
         */
    firstModel () {
      let that = this
      if (storage.get('amy') && !storage.get('amy').hasOwnProperty('encrypt') || this.nameRoute === 'login' || this.nameRoute === 'agree') {
        storage.clear()
        return
      }
      console.log(this.showMoonCakeMixin, 't111111his.showMoonCakeMixin')

      if (!this.showMoonCakeMixin && (this.inviteUid || this.typeMoonCake) || this.showNowtimeDay) { // 如果没弹过 并且是代表用户
        console.log(this.showMoonCakeMixin, 'this.showMoonCakeMixin')
        console.log(this.showNowtimeDay, 'this.showNowtimeDay')
        this.userInfoMoonCake.showMoonCakeMixin = true
        storage.set('userInfoMoonCake', this.userInfoMoonCake)
        this.$moonDialog.show(
          {
            currentComponent: 'firstMoonCake'
          }
        ).then(re => {
          console.log(re, '出来')
        }).catch(err => {
          console.log('关闭')
        })
      }
    },
    /**
         * 奖励月饼 弹框
         *
         */
    jlDetailModel (type) {
      if (this.inviteUid) {
        this.$moonDialog.show(
          {
            currentComponent: 'detailMoonCake',
            moonCakeType: '0' + type + ''
          }
        ).then(re => {
          console.log(re, '出来')
          clearTimeout(this.timer) // 一篇文章只能弹一次
        }).catch(err => {
          console.log('关闭')
        })
      }
    },
    testMoonCake () {
      this.$moonDialog.show({
        currentComponent: 'detailMoonCake',
        moonCakeType: '00'
      }).then(re => {
        console.log(re, '出来')
      }).catch(err => {
        console.log('关闭')
      })
    },
    /**
         * 文章最低10s
         * 视频最低20s
         * 代表不可以获得
         * @param {type} 1 文章 3 视频 。【】从列表获取
         * @param {code} 从列表获取
         *
         * res.body.data {prizeIndex} 0: 五仁月饼 1: 莲蓉月饼 2: 鲜肉月饼 3:豆沙月饼 4: 雪沙月饼 5: 万能月饼
         */
    getMoonCake ({ type, code }) {
      // const { areaCode, companyCode, userId } = this.userInfoMoonCake

      if (this.typeMoonCake) {
        return
      }
      const { areaCode, companyCode, userId } = storage.get('amy')
      let encrypt = storage.get('amy').encrypt
      const data = { areaCode, companyCode, userId, code, type }
      let baseNum = 1000
      let delay = +type === 1 ? baseNum * 10 : +type === 3 ? baseNum * 20 : baseNum
      let that = this
      this.timer = setTimeout(() => {
        try {
          if (this.isPary_countDown === 0 || this.isPary === 1 || this.isPary_banner === 1) { // 活动未开始
            return
          }
          this.$http.post(baseUrl + '/lottery/moon/cake', JSON.stringify(data),
            {
              emulateJSON: true,
              headers: { 'Content-Type': 'application/json;charset=UTF-8', 'encrypt': encrypt }
            }).then((res) => {
            if (res.body.code == 0) {
              // Toast(res.body.msg);

            } else if (res.body.code == 1) {
              if (res.body.data.prizeIndex >= 0) {
                if (res.body.data.prizeIndex + '') {
                  that.jlDetailModel(res.body.data.prizeIndex)
                }
              }
            }
          })
        } catch (e) {
          // Toast(e)
        }
      }, delay)
    },
    /**
         * 判断是不是目标用户， 进行跳转
         */
    isWhereToGo () {
      var shareQrcode = getUrlParam('shareQrcode') || '' // 月饼二维码来的
      var shareURL = getUrlParam('shareURL') || 'false' // 分享来的
      let AMY = storage.get('amy')
      let USERMOONCAKETO_go = storage.get('userInfoMoonCake')
      this.getMoonBaseInftFist().then(res => {
        if (res.body.code === 1) {
          USERMOONCAKETO_go.type = res.body.data.type
          USERMOONCAKETO_go.inviteUid = res.body.data.inviteUid
          storage.set('userInfoMoonCake', USERMOONCAKETO_go)
          AMY = storage.get('amy')
          let invitedHref = `${basemoon_Url}/?zqEncrypt=${
            AMY.encrypt
          }&areaCodeAlias=AMYXY&userId=${AMY.userId}&areaCode=${
            AMY.areaCode
          }&companyCode=${AMY.companyCode}&inviteUid=${
            storage.get('userInfoMoonCake').inviteUid
          }&shareQrcode=${shareQrcode}#/`
          let typeHref = `${basemoon_Url}/?zqEncrypt=${AMY.encrypt}&userId=${
            AMY.userId
          }&areaCodeAlias=AMYXY&areaCode=${AMY.areaCode}&companyCode=${
            AMY.companyCode
          }&type=${storage.get('userInfoMoonCake').type}&shareQrcode=${shareQrcode}#/referee`
          if (shareQrcode || shareURL === 'true') {
            if (storage.get('userInfoMoonCake').type) { // 代表跳二维码
              // window.open(typeHref)
              location.href = typeHref
            } else if (storage.get('userInfoMoonCake').inviteUid) {
              location.href = invitedHref// 目标跳活动首页
            }
          }
        }
      })
    }
  },
  destroyed () {
    clearTimeout(this.timer)
  }
}

export default moonCakeMixin
