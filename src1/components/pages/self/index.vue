<template>
  <div class="box">
    <div class="header">
      <router-link class="setting" to="/setting?from=123123">
        <img class src="https://imageysz.yxj.org.cn/1546715408219.png">
      </router-link>
      <div class="user">
        <div class="head">
          <img src="https://imageysz.yxj.org.cn/1546788613423.png">
        </div>
        <div class="info">
          <div class="name">{{ info.userName }}</div>
          <div class="score">
            拥有积分：{{ info.userIntegral }}
            <div class="exchange" @click="toMall">去兑换</div>
          </div>
          <div class="hospital">{{ info.hospitalName }} · {{ info.departmentName }}</div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="sign">
        <div class="sign-title">福利中心</div>
        <div class="days">
          <div class="day">
            <div class="day-index">
              <img v-if="signNum >= 1 " src="http://studioimage.yxj.org.cn/1545284129980.png">
              <div v-else>1</div>
            </div>
            <div class="point">5</div>
          </div>
          <div class="day">
            <div class="day-index">
              <img v-if=" signNum >= 2 " src="http://studioimage.yxj.org.cn/1545284129980.png">
              <div v-else>2</div>
            </div>
            <div class="point">10</div>
          </div>
          <div class="day">
            <div class="day-index">
              <img v-if=" signNum >= 3 " src="http://studioimage.yxj.org.cn/1545284129980.png">
              <div v-else>3</div>
            </div>
            <div class="point">20</div>
          </div>
          <div class="day">
            <div class="day-index">
              <img v-if=" signNum >= 4 " src="http://studioimage.yxj.org.cn/1545284129980.png">
              <div v-else>4</div>
            </div>
            <div class="point">40</div>
          </div>
          <div class="day">
            <div class="day-index">
              <img v-if=" signNum >= 5 " src="http://studioimage.yxj.org.cn/1545284129980.png">
              <div v-else>5</div>
            </div>
            <div class="point">60</div>
          </div>
          <div class="day">
            <div class="day-index">
              <img v-if=" signNum >= 6 " src="http://studioimage.yxj.org.cn/1545284129980.png">
              <div v-else>6</div>
            </div>
            <div class="point">80</div>
          </div>
          <div class="day">
            <div class="day-index">
              <img v-if=" signNum >= 7 " src="http://studioimage.yxj.org.cn/1545284129980.png">
              <div v-else>7</div>
            </div>
            <div class="point">100</div>
          </div>
        </div>

        <div class="line"></div>
        <div class="sign-btn dbj" :class="{'active':isSigned}" @click="addSign">签到领积分</div>
      </div>
    </div>

    <div class="list">
      <div class="item new-msg" :class="{'news':fleg}" @click="newMsg">消息通知</div>
      <div class="item collect" @click="collection">我的收藏</div>
      <div class="item add-meeting" @click="toMyMeeting">直播报名</div>
      <div class="item interaction" @click="toDiscussion">我的同期声</div>
      <div class="item mession" @click="newMusion">日常任务</div>
      <div class="item mall" @click="toMall">积分商城</div>
    </div>

  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { Toast, Dialog } from 'vant'
import storage from 'storejs'
import { changeTitle } from '../../../utils/func'
import share from '../../../utils/share'
export default {
  created () {
    this.getInfo()
    this.getsign()
    this.getNewsMsg()
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '个人中心',
        EventID: '1',
        ControlName: '',
        Description: ''
      })
    } catch (error) {
      console.log(error)
    }
  },
  mounted () {
    changeTitle('个人中心')
    this.hideLoad()
    share({
      title: '傲美云学院',
      desc: '智能学院在手，心血管医学知识一网打尽 ！',
      link: `${location.origin}${location.pathname}#/`,
      imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg'
    })
  },
  data () {
    return {
      info: {},
      isSigned: false,
      signNum: 0,
      list: ['', '', '', '', '', '', ''],
      fleg: false
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
      sign: 'user/sign',
      signLast: 'user/signLast',
      isCanSign: 'user/isCanSign',
      getNews: 'content/getNews',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    // 查询是否有新消息
    getNewsMsg () {
      this.getNews({}).then(res => {
        console.log(res)
        this.fleg = !res.data.flag
        console.log(this.fleg)
      })
    },
    // 获取用户信息
    async getInfo () {
      try {
        var res = await this.getUserInfo()
        console.log(res)
        this.info = res.data
      } catch (err) {
        console.log(err)
      }
    },
    // 签到
    async addSign () {
      if (this.isSigned) {
        return
      }
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '个人中心',
          EventID: '2',
          ControlName: '签到',
          Description: '签到'
        })
      } catch (error) {
        console.log(error)
      }
      try {
        var res = await this.sign()
        console.log(res)
        Toast('签到成功，积分+' + res.data.score)
        this.getsign()
        this.getInfo()
      } catch (err) {
        console.log(err)
        Dialog.alert({
          title: '提示',
          message: err
        })
      }
    },
    // 检测是否签到
    async getsign () {
      try {
        var res = await this.signLast()
        this.signNum = res.data.signDayCount
        var res1 = await this.isCanSign()
        console.log(res1)
        this.isSigned = res1.data.flag === 1
        console.log(this.isSigned)
      } catch (err) {
        console.log(err)
      }
    },

    toMyMeeting () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '个人中心',
          EventID: '2',
          ControlName: '会议报名',
          Description: '跳转到-会议报名'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/mymeeting'
      })
    },
    toMall () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '个人中心',
          EventID: '2',
          ControlName: '商城',
          Description: '跳转到-商城'
        })
      } catch (error) {
        console.log(error)
      }
      if (this.info.realnameAuthStatus != 'C') {
        Dialog.alert({
          message: '请完成认证信息后兑换商品'
        }).then(() => {
          // on close
          this.$router.push({
            path: '/setting',
            query: {
              from: 123
            }
          })
        })
        return
      }
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '个人中心',
          EventID: '2',
          ControlName: '商城',
          Description: '跳转到-商城-成功'
        })
      } catch (error) {
        console.log(error)
      }
      location.href = `${window.location.origin}/mall/#/?shopEncrypt=${
        storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt
      }&userId=${storage.get(process.env.VUE_APP_STORAGE_NAME).userId}&areaCode=${
        process.env.VUE_APP_AREA_CODE
      }&companyCode=${process.env.VUE_APP_COMPANY_CODE}`
    },
    collection () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '个人中心',
          EventID: '2',
          ControlName: '我的收藏',
          Description: '跳转到-我的收藏'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/collection'
      })
    },
    newMsg () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '个人中心',
          EventID: '2',
          ControlName: '消息通知',
          Description: '跳转到-消息通知'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/msg'
      })
    },
    newMusion () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '个人中心',
          EventID: '2',
          ControlName: '日常任务',
          Description: '跳转到-日常任务'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/dailymusion'
      })
    },
    toDiscussion () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '个人中心',
          EventID: '2',
          ControlName: '我的同期声',
          Description: '跳转到-我的同期声'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/mydiscussion'
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import url("src1/stylef.less");
</style>
