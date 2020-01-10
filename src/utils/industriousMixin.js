import storage from 'storejs'
import { baseUrl } from '../interfaceUrl'
import { getUrlParam } from './func'

const indMixin = {
  data () {
    return {
      qmyNameRoute: this.$route.name, // 路由名字
      userInfoMoonCakeQMY: storage.get('userInfoMoonCakeQMY'),
      qmymoonCakeObj: { nowDate: new Date().toLocaleDateString() }, // 月饼必要信息
      newsList: [{
        'title': '金秋收获，勤勉10月----你阅读，我赠送活动'
      }, {
        'title': '金秋收获，勤勉10月----你阅读，我赠送活动'
      }, {
        'title': '金秋收获，勤勉10月----你阅读，我赠送活动'
      }, {
        'title': '金秋收获，勤勉10月----你阅读，我赠送活动'
      }]
    }
  },
  created () {
    if (!this.userInfoMoonCakeQMY) {
      this.qmygetMoonBaseInftFist().then(res => {
        if (res.body.code === 1) {
          this.qmymoonCakeObj = res.body.data //
          this.qmymoonCakeObj.nowDate = new Date().toLocaleDateString() // 对比时间
          this.userInfoMoonCakeQMY = this.qmymoonCakeObj
          storage.set('userInfoMoonCakeQMY', this.qmymoonCakeObj) // 保存用户信息
          this.qmyModel() // 月饼
        }
      })
    }
    if (this.userInfoMoonCakeQMY) {
      console.log(this.qmyinviteUid, 'qmyinviteUid')
      this.qmyModel() // 月饼
    }
  },
  beforeRouteLeave (to, from, next) {
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
    optionLeft () {
      return {
        step: 1,
        direction: 2,
        autoPlay: true,
        limitMoveNum: 2
      }
    },
    qmyinviteUid () { // 目标用户
      return storage.get('userInfoMoonCakeQMY') && storage.get('userInfoMoonCakeQMY').inviteUid || this.qmymoonCakeObj.inviteUid
    },
    qmytypeMoonCake () { // 代表用户
      return storage.get('userInfoMoonCakeQMY') && storage.get('userInfoMoonCakeQMY').type === 'A' || this.qmymoonCakeObj.type === 'A'
    },
    qmyshowMoonCakeMixin () {
      return storage.get('userInfoMoonCakeQMY') && storage.get('userInfoMoonCakeQMY').showMoonCakeMixin || this.qmymoonCakeObj.showMoonCakeMixin
    },
    /**
         * 11月14下线banner
         *  1 隐藏  0 显示
         *
         */
    qmyisPary_banner () {
      let c = new Date().getTime()
      let s = new Date('2018/11/15').getTime()
      // let s = new Date('2018/9/20').getTime()
      if (c < s) {
        return 0
      } else {
        return 1
      }
    },
    /**
         * 自上线开始至10月14日23:59:00
         *  1 不弹活动弹窗，
         *
         */
    qmyisPary () {
      let c = new Date().getTime()
      // let s = new Date('2018/9/21').getTime()
      let s = new Date('2018/10/15').getTime()
      if (c < s) {
        return 0
      } else {
        return 1
      }
    },
    qmyshowNowtimeDay () {
      let nowDay = new Date().toLocaleDateString()
      let storaDay = storage.get('userInfoMoonCakeQMY') && storage.get('userInfoMoonCakeQMY').nowDate || this.qmymoonCakeObj.nowDate
      if (nowDay !== storaDay) {
        this.userInfoMoonCakeQMY.nowDate = nowDay
        this.userInfoMoonCakeQMY.showMoonCakeMixin = false
        storage.set('userInfoMoonCakeQMY', this.userInfoMoonCakeQMY)
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    toQMY () {
      this.$router.push({
        path: '/industrious'
      })
    },
    /**
        * 获取用户基本信息
        *
        */
    qmygetMoonBaseInftFist () {
      let data = {
        userId: storage.get('amy').userId,
        areaCode: storage.get('amy').areaCode,
        companyCode: storage.get('amy').companyCode
      }
      let encrypt = storage.get('amy').encrypt
      return this.$http.post(baseUrl + '/accounts/mobile/base/info', JSON.stringify(data),
        {
          emulateJSON: true,
          headers: { 'Content-Type': 'application/json;charset=UTF-8', 'encrypt': encrypt }
        })
    },
    /**
         * 勤勉月弹框
         */
    qmyModel () {
      let that = this
      if (this.qmyisPary === 1 || this.qmyisPary_banner === 1 || this.qmyNameRoute === 'industrious') {
        return
      }
      console.log(this.qmytypeMoonCake, 'this.qmytypeMoonCake')
      console.log(this.qmyinviteUid, 'this.qmyinviteUid')
      if (!getUrlParam('inviteUid')) {
        if (!this.qmyinviteUid || this.qmytypeMoonCake) {
          return
        }
      }

      if (storage.get('amy') && !storage.get('amy').hasOwnProperty('encrypt') || this.nameRoute === 'login' || this.nameRoute === 'agree') {
        storage.clear()
        return
      }
      if (!this.qmyshowMoonCakeMixin && (this.qmyinviteUid || getUrlParam('inviteUid')) || this.qmyshowNowtimeDay) { // 如果没弹过 并且是代表用户
        this.userInfoMoonCakeQMY.showMoonCakeMixin = true
        storage.set('userInfoMoonCakeQMY', this.userInfoMoonCakeQMY)
        this.$moonDialogQMY.show(
          {
            currentComponent: 'detailMoonCake',
            moonCakeType: 'industrious',
            toRouter: function () {
              that.$router.push({
                path: '/industrious'
              })
            }
          }
        ).then(re => {
          console.log(re, '出来')
        }).catch(err => {
          console.log('关闭')
        })
      }
    }
  }
}
export default indMixin
