<template>
  <div class="activity517">
    <!-- kv -->
    <img src="../../../assets/517/index-kv.png" alt="">
    <div class="time" v-if="!end && !notStart">
      活动倒计时:<span>{{day}}</span>天<span>{{hour}}</span>小时<span>{{minite}}</span>分
    </div>
    <div class="time" v-if="end && !notStart">活动已结束</div>
    <div class="time" v-if="notStart">活动未开始</div>
    <!-- 活动部分 -->
    <div class="act-info">
      <img src="../../../assets/517/index-info.png" alt="">
      <!-- 抽奖部分 -->
      <div class="act-box">

        <div class="info-box">
          <!-- 20积分 -->
          <img v-show="actIndex != 7" src="../../../assets/517/score-1.png" alt="">
          <img v-show="actIndex == 7" src="../../../assets/517/score-1-a.png" alt="">
          <!-- 谢谢参与 -->
          <img v-show="actIndex != 0" src="../../../assets/517/score-2.png" alt="">
          <img v-show="actIndex == 0" src="../../../assets/517/score-2-a.png" alt="">
          <!-- 50积分 -->
          <img v-show="actIndex != 1" src="../../../assets/517/score-3.png" alt="">
          <img v-show="actIndex == 1" src="../../../assets/517/score-3-a.png" alt="">
        </div>

        <div class="info-box">
          <!-- 10积分 -->
          <img v-show="actIndex != 6" src="../../../assets/517/score-4.png" alt="">
          <img v-show="actIndex == 6" src="../../../assets/517/score-4-a.png" alt="">
          <!-- 点击抽奖 -->
          <img v-show="clickDown" @click="startLottery" src="../../../assets/517/score-6.png" alt="">
          <img v-show="!clickDown" @click="added" src="../../../assets/517/score-6-a.png" alt="">
          <!-- 10积分 -->
          <img v-show="actIndex != 2" src="../../../assets/517/score-4.png" alt="">
          <img v-show="actIndex == 2" src="../../../assets/517/score-4-a.png" alt="">
        </div>

        <div class="info-box">
          <!-- 10积分 -->
          <img v-show="actIndex != 5" src="../../../assets/517/score-5.png" alt="">
          <img v-show="actIndex == 5" src="../../../assets/517/score-5-a.png" alt="">
          <!-- 20积分 -->
          <img v-show="actIndex != 4" src="../../../assets/517/score-1.png" alt="">
          <img v-show="actIndex == 4" src="../../../assets/517/score-1-a.png" alt="">
          <!-- 50积分 -->
          <img v-show="actIndex != 3" src="../../../assets/517/score-3.png" alt="">
          <img v-show="actIndex == 3" src="../../../assets/517/score-3-a.png" alt="">
        </div>
      </div>

      <!-- 按钮部分 -->
      <div class="rules-box">
        <!-- 活动规则 -->
        <div class="rule-btn" :class="{'active':showRules}" @click="showRule">
          <img v-show="!showRules" src="../../../assets/517/btn.png" alt="">
          <img v-show="showRules" src="../../../assets/517/btn-a.png" alt="">
          <div>活动规则</div>
        </div>
        <!-- 我的奖品 -->
        <div class="rule-btn" :class="{'active':showRules}" @click="showMyGood">
          <img v-show="!showMyGoods" src="../../../assets/517/btn.png" alt="">
          <img v-show="showMyGoods" src="../../../assets/517/btn-a.png" alt="">
          <div>我的奖品</div>
        </div>
      </div>

    </div>

    <img src="../../../assets/517/index-bnner-top.png" alt="">
    <!-- 礼品展示 -->
    <div class="banner-box" @touchstart='bannerStart' @touchend='bannerEnd'>
      <!-- banner背景 -->
      <img src="../../../assets/517/banner-bg.png" alt="">

      <div class="banner">

        <div class="banner-info"
        @click="bannerClick(0)"
          :class='{
            "active":bannerIndex == 0,
            "next":bannerIndex - 0 == 1,
            "next-2":bannerIndex - 0 == 2,
            "prod":bannerIndex - 0 == -1,
            "right":bannerIndex - 0 > 2
          }'
        >
          <img class="banner-bg" src="../../../assets/517/banner-info-bg.png" alt="">

            <img class="good-img"  src="../../../assets/517/tzq.png" alt="">
          <div class="goods">
            <div class="goods-des">
              <div class="strong">定制听诊器</div>
              <div class="des">（3500积分）</div>
            </div>
          </div>
        </div>

        <div class="banner-info"
        @click="bannerClick(1)"
          :class='{
            "active":bannerIndex == 1,
            "next":bannerIndex - 1 == 1,
            "next-2":bannerIndex - 1 == 2,
            "prod":bannerIndex - 1 == -1,
            "right":bannerIndex - 1 > 2
          }'
        >
          <img class="banner-bg" src="../../../assets/517/banner-info-bg.png" alt="">

          <img class="good-img up" src="../../../assets/517/up.png" alt="">
          <div class="goods">
            <div class="goods-des">
              <div class="strong">水晶U盘 16G</div>
              <div class="des">（4500积分）</div>
            </div>
          </div>
        </div>

        <div class="banner-info"
        @click="bannerClick(2)"
          :class='{
            "active":bannerIndex == 2,
            "next":bannerIndex - 2 == 1,
            "next-2":bannerIndex - 2 == 2,
            "prod":bannerIndex - 2 == -1,
            "right":bannerIndex - 2 > 2
          }'
        >
          <img class="banner-bg" src="../../../assets/517/banner-info-bg.png" alt="">

          <img class="good-img" src="../../../assets/517/bjb.png" alt="">
          <div class="goods">
            <div class="goods-des">
              <div class="strong">定制笔记本</div>
              <div class="des">（2000积分）</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 弹窗部分 -->
    <!-- 我的奖品弹窗 -->
    <Popup v-model="showMyGoods" @closed='showMyGoods = false'>
      <div class="my-goods">
        <img src="../../../assets/517/my-goods-hd.png" alt="">
        <div class="popup-info">
          <div class="no-toast" v-show="goodsList.length ==0">您暂未获得奖品，快去参与抽奖吧</div>
          <div >
            <div class="flex head" v-show="goodsList.length >0">
              <div style="flex:1;">奖品</div>
              <div style="flex:1;">时间</div>
              <div style="flex:1;">答题状况</div>
              <div style="flex:1;">最终奖励</div>
            </div>
            <div class="info">
              <div class="flex body"
                v-for="(item,index) in goodsList"
                :key="index"
              >
                <div style="flex:1;">{{item.prize == '0积分'?'谢谢参与':item.prize}}</div>
                <div style="flex:1;">{{ item.winningTime.slice(0,10).replace(/-/gi,'.') }}</div>
                <div style="flex:1;">{{ item.isCorrect }}</div>
                <div style="flex:1;">{{ item.finalPrize}}</div>
              </div>
            </div>
          </div>

          <div class="act-btn" @click="showMyGoods = false">
            <img src="../../../assets/517/toast-btn.png" alt="">
            <div>好的</div>
          </div>
        </div>
        <img src="../../../assets/517/bottom.png" alt="">
      </div>
    </Popup>
    <!-- 活动规则弹窗 -->
    <Popup v-model="showRules" @closed='showMyGoods = false'>
      <div class="activity-rules">

        <img src="../../../assets/517/activity-rules.png" alt="">

        <div class="popup-info">

          <div class="info">
            <div class="head rules">
              活动时间
            </div>
            <div class="body rules">
              2019.05.17 00:00- -2019.05.30 24:00
            </div>
            <div class="head rules">
              活动对象
            </div>
            <div class="body rules">
              注册并登录《傲美云学院》的医生用户
            </div>
            <div class="head rules">
              活动内容
            </div>
            <div class="body rules">
              1、注册成功后，每日可进入活动页面抽奖一次
            </div>
            <div class="body rules">
              2、每次抽奖，会有一次答题机会，答题正确可获得积分翻倍奖励
            </div>
            <div class="body rules">
            3、每日转发活动页面，可获得10积分奖励
            </div>
            <div class="body rules">
            4、同时可通过傲美云学院的日常任务获得积分
            </div>
            <div class="body rules">
            5、积分可在个人中心--积分商城兑换礼品，礼品5月29日限量上线
            </div>
          </div>

          <div class="act-btn" @click="showRules = false">
            <img src="../../../assets/517/toast-btn.png" alt="">
            <div>好的</div>
          </div>
        </div>
        <img src="../../../assets/517/bottom.png" alt="">
      </div>
    </Popup>

    <!-- 答题询问 -->
    <Popup class="toast" v-model="showTopicAsk" @closed='bindTopicAsk'>
      <div class="topic-ask">

        <img src="../../../assets/517/toast.png" alt="">

        <div class="one-info">
          <div class="score-name" v-show="score != 0">恭喜您获得{{ score }}积分</div>
          <div class="score-name" v-show="score == 0">非常遗憾，没有抽中积分</div>
          <div class="score-body" v-show="score != 0">恭喜您获得积分翻倍机会</div>
          <div class="score-body" v-show="score != 0">(答题正确，奖励翻倍，答错不扣积分)</div>
          <div class="score-body" v-show="score == 0">明天再接再厉！！！</div>

          <div class="act-btn" v-show="score != 0" @click="showTopic = true;showTopicAsk = false">
            <img src="../../../assets/517/toast-btn.png" alt="">
            <div>好的</div>
          </div>
          <div class="act-btn" v-show="score == 0" @click="showTopicAsk = false">
            <img src="../../../assets/517/toast-btn.png" alt="">
            <div>好的</div>
          </div>
        </div>

      </div>
    </Popup>
    <!-- 答题 -->
    <Popup v-model="showTopic" @closed='topicClose'>
      <div class="topic">
        <img src="../../../assets/517/answer-title.png" alt="">

        <div class="popup-info">
          <div class="topic-list">
            <div class="topic-name">{{ topic.topicName }}({{ topic.topicType == 0?'单选':'多选' }})</div>
            <div class="answers">
              <div class="answer-info"
              v-for="(item,index) in answerList"
              :key="index"
              @click="answerCheck(index)"
              :class="{
                'active':item.selected
              }"
              >{{ item.answer }}</div>
            </div>
          </div>

          <div class="act-btn" @click="topicSure">
            <img src="../../../assets/517/toast-btn.png" alt="">
            <div>好的</div>
          </div>
        </div>
        <img src="../../../assets/517/bottom.png" alt="">
      </div>
    </Popup>

    <!-- 回答结束 -->
    <Popup class="toast" v-model="answered">
      <div class="topic-ask">

        <img src="../../../assets/517/toast.png" alt="">

        <div class="one-info">
          <div class="score-name" v-show="answerRight">恭喜</div>
          <div class="score-name" v-show="!answerRight">非常遗憾，答题错误</div>
          <div class="score-body" v-show="answerRight">答题正确，奖励翻倍</div>
          <div class="score-body" v-show="!answerRight">明天再接再厉！！！</div>

          <div class="act-btn" @click="answered = false">
            <img src="../../../assets/517/toast-btn.png" alt="">
            <div>好的</div>
          </div>
        </div>

      </div>
    </Popup>
  </div>
</template>

<script>
import { Popup, Toast, Dialog } from 'vant'
import storage from 'storejs'

import { mapMutations, mapActions } from 'vuex'
import share from '../../../utils/share'
import { changeTitle } from '../../../utils/func'
export default {
  components: {
    Popup
  },
  created () {
    changeTitle('你愿意加入“高血压健康防线”的“傲美”军团吗？')
    this.isRepresent = storage.get('userInfoAMY') ? 'Y' : 'N'
    this.hideLoad()
    // setInterval(() => {
    //   this.actIndex++
    //   if(this.actIndex == 9) {
    //     this.actIndex = 1
    //   }
    // },2000)
    this.getList()
    this.getTopic()
    this.check()
    this.init517()
    this.addActivityScore()
  },
  mounted () {
    // 倒计时初始化~
    this.timeInit()
    this.timeTimer = setInterval(() => {
      this.timeInit()
    }, 10000)
    share({
      title: '你愿意加入“高血压健康防线”的“傲美”军团吗?',
      desc: '加入每日抽奖，积分送不停',
      link: `${location.origin}${location.pathname}#/activity517`,
      imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg',
      shareEncryptKey: storage.get(process.env.VUE_APP_STORAGE_NAME) ? storage.get(process.env.VUE_APP_STORAGE_NAME).userId : '',
      type: '517'
    })
    try {
      var data = {
        PageName: '517活动首页',
        EventID: '1',
        ControlName: '',
        Description: '517活动首页加载',
        ActionType: '1'
      }
      this.baoSaveReport(data)
    } catch (error) {

    }
  },
  data () {
    return {
      showMyGoods: false, // 展示我的奖品
      showRules: false, // 显示活动规则
      showTopicAsk: false, // 显示答题询问,
      showTopic: false, // 显示答题
      answerRight: false, // 回答错误
      answered: false, // 回答结束
      loading: false,
      notStart: false, // 活动未开始
      day: '',
      hour: '',
      minite: '',
      timeTimer: '', // 倒计时定时器
      isRepresent: '', // 当前用户是否为代表
      end: true, // 活动结束
      goodsList: [], // 我的奖品列表
      topic: [], // 答题列表
      answerList: [], // 答案列表
      score: '', // 获得积分
      answer: '', // 用户答案
      actIndex: -1, // 当前选中的奖品坐标
      clickDown: true, // 点击抽奖
      bannerIndex: 1, // 当前展示banner坐标
      long: 0,
      index: -1, // 当前转动到哪个位置，起点位置
      count: 8, // 总共有多少个位置
      timer: 0, // 每次转动定时器
      speed: 200, // 初始转动速度
      times: 0, // 转动次数
      cycle: 100, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
      prize: -1 // 中奖位置,
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getLuckDrawList: 'content/getLuckDrawList',
      LuckDrawSave: 'content/LuckDrawSave',
      baoSaveReport: 'ubt/baoSaveReport',
      getTopicList: 'content/getTopicList',
      addActivityScored: 'content/addActivityScored',
      getSysTime: 'ubt/getSysTime'
    }),
    added () {
      if (!this.loading) {
        Toast('今天已参与抽奖，明天再来哟')
      }
    },
    async addActivityScore () {
      if (this.isRepresent == 'Y') {
        return
      }
      try {
        var res = await this.addActivityScored({})
        if (res) {
          setTimeout(() => {
            Toast('恭喜获得517活动专属积分')
          }, 2000)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async timeInit (t) {
      var res = await this.getSysTime()
      var now = new Date(res.data.replace(/-/gi, '/'))
      var end = new Date(process.env.VUE_APP_ACTIVITY_END.replace(/-/gi, '/'))
      var t = parseInt((end - now) / 1000)
      if (t < 0) {
        this.end = true
        clearInterval(this.timeTimer)
        return
      }
      this.day = parseInt(t / 60 / 60 / 24) >= 10 ? parseInt(t / 60 / 60 / 24) : '0' + parseInt(t / 60 / 60 / 24)
      this.hour = parseInt(t / 60 / 60) % 24 >= 10 ? parseInt(t / 60 / 60) % 24 : '0' + parseInt(t / 60 / 60) % 24
      this.minite = parseInt(t / 60) % 60 >= 10 ? parseInt(t / 60) % 60 : '0' + parseInt(t / 60) % 60
    },
    // 页面初始化（活动时间）
    async init517 () {
      var res = await this.getSysTime()
      var now = new Date(res.data.replace(/-/gi, '/'))
      var start = new Date(process.env.VUE_APP_ACTIVITY_START.replace(/-/gi, '/'))
      var end = new Date(process.env.VUE_APP_ACTIVITY_END.replace(/-/gi, '/'))
      if (now - start > 0 && now - end < 0) {
        this.end = false
        return true
      } else {
        if (now - start < 0) {
          this.notStart = true
        } else {
          this.notStart = false
        }
        if (now - end > 0) {
          this.end = true
        } else {
          this.end = false
        }
        return false
      }
    },
    async check () {
      var data = {
        type: '1',
        pageNum: 1,
        pageSize: 20,
        isNow: '1'
      }
      try {
        var res = await this.getLuckDrawList(data)
        if (res) {
          this.clickDown = res.data.length == 0
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 我的奖品
    showMyGood () {
      if (this.notStart) {
        Toast('活动未开始')
        return
      }
      // 判断用户是否登录
      if (!storage.get(process.env.VUE_APP_STORAGE_NAME) || !storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt) {
        Dialog({
          title: '提示',
          message: '该活动需要登录，才可以参与抽奖，同时可以获得额外的积分奖励',
          showCancelButton: true,
          cancelButtonText: '再看看',
          confirmButtonText: '去登录'
        }).then(() => {
          this.$router.push({
            path: '/login'
          })
        }).catch(res => {

        })
        return
      }

      if (this.isRepresent == 'Y') {
        Toast('仅医生可参与该活动')
        return
      }

      this.getList()

      this.showMyGoods = true
    },
    // 活动规则
    showRule () {
      // if(this.notStart) {
      //   Toast('活动未开始')
      //   return
      // }
      // // 判断用户是否登录
      // if(!storage.get(process.env.VUE_APP_STORAGE_NAME) || !storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt) {
      //   Dialog({
      //     title: '提示',
      //     message: '该活动需要登录，才可以参与抽奖，同时可以获得额外的积分奖励',
      //     showCancelButton:true,
      //     cancelButtonText:'再看看',
      //     confirmButtonText:'去登录'
      //   }).then(() => {
      //     this.$router.push({
      //       path:'/login'
      //     })
      //   }).catch(res => {

      //   });
      //   return
      // }

      // if(this.isRepresent == 'Y') {
      //   Toast('仅医生可参与该活动')
      //   return
      // }
      this.showRules = true
    },
    topicClose () {
      if (!this.answered) {
        this.scoreSave(this.prize)
      }
    },
    bindTopicAsk () {
      if (this.score == 0) {
        this.scoreSave(this.prize)
      } else if (!this.showTopic) {
        this.scoreSave(this.prize)
      }
    },
    // banner触摸开始
    bannerStart (e) {
      this.long = e.changedTouches[0].pageX
    },
    // banner点击
    bannerClick (index) {
      this.bannerIndex = index
    },
    // banner触摸结束
    bannerEnd (e) {
      if (this.long - e.changedTouches[0].pageX > 0 && Math.abs(this.long - e.changedTouches[0].pageX) > 100) {
        if (this.bannerIndex <= 0) {
          return
        }
        this.bannerIndex--
      }
      if (this.long - e.changedTouches[0].pageX < 0 && Math.abs(this.long - e.changedTouches[0].pageX) > 100) {
        if (this.bannerIndex >= 2) {
          return
        }
        this.bannerIndex++
      }
    },
    // 答题答案选择
    answerCheck (index) {
      // 单选
      if (this.topic.topicType == 0) {
        this.answerList.forEach(ele => {
          ele.selected = false
        })
        this.answerList[index].selected = !this.answerList[index].selected
      } else {
        // 多选
        this.answerList[index].selected = !this.answerList[index].selected
      }
    },
    // 答题
    topicSure () {
      var answer = ''
      this.answerList.forEach(ele => {
        if (ele.selected) {
          answer += ele.answer.slice(0, 1) + '||'
        }
      })
      answer = answer.slice(0, (answer.length - 2))
      this.answer = answer
      if (this.answer) {
        this.scoreSave(this.prize)
      } else {
        Toast('请选择您的答案')
      }
    },

    oneRoll () {
      this.actIndex++
      if (this.actIndex == 8) {
        this.actIndex = 0
      }
    },
    // 开始抽奖
    startLottery () {
      if (this.notStart) {
        Toast('活动未开始')
        return
      }
      if (this.end) {
        Dialog.alert({
          title: '提示',
          message: '当前活动已结束，感谢您的参与！'
        }).then(() => {
          // on close
        })
        return
      }
      if (!this.clickDown) {
        return
      }
      if (this.isRepresent == 'Y') {
        Toast('仅医生可参与该活动')
        return
      }
      // 判断用户是否登录
      if (!storage.get(process.env.VUE_APP_STORAGE_NAME) || !storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt) {
        Dialog({
          title: '提示',
          message: '该活动需要登录，才可以参与抽奖，同时可以获得额外的积分奖励',
          showCancelButton: true,
          cancelButtonText: '再看看',
          confirmButtonText: '去登录'
        }).then(() => {
          this.$router.push({
            path: '/login'
          })
        }).catch(res => {

        })
        return
      }

      this.loading = true
      var num1 = parseInt(Math.random() * 10) // 随机数1，标记当前是此次选中的是哪一件奖品
      this.prize = num1 <= 2 ? 0 : num1 - 2
      this.speed = 200
      this.clickDown = false
      this.startRoll()
    },
    // 随机角度计算 弃用
    startRoll () {
      this.times += 1 // 转动次数
      this.oneRoll() // 转动过程调用的每一次转动方法，这里是第一次调用初始化
      // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
      if (this.times > this.cycle + 10 && this.prize === this.actIndex) {
        clearTimeout(this.timer) // 清除转动定时器，停止转动
        // this.prize = -1
        this.times = 0
        this.clickDown = false
        // this.scoreSave(this.prize)
        setTimeout(() => {
          this.topicAsk()
        }, 1000)

        this.loading = false
        // this.showTopicAsk = true
      } else {
        if (this.times < this.cycle) {
          this.speed -= 10 // 加快转动速度
        } else if (this.times > this.cycle + 10 &&
        ((this.prize === 0 && this.actIndex === 7) || this.prize === this.actIndex + 1)) {
          this.speed += 110
        } else {
          this.speed += 20
        }

        if (this.speed < 40) {
          this.speed = 40
        }
        this.timer = setTimeout(this.startRoll, this.speed)
      }
    },
    // 答题询问
    topicAsk () {
      switch (this.prize) {
        case 0:
          this.score = 0
          break
        case 1:
          this.score = 50
          break
        case 2:
          this.score = 10
          break
        case 3:
          this.score = 50
          break
        case 4:
          this.score = 20
          break
        case 5:
          this.score = 100
          break
        case 6:
          this.score = 10
          break
        case 7:
          this.score = 20
          break
      }

      this.showTopicAsk = true
    },
    // 获取答题列表
    async getTopic () {
      var data = {
        dataTypeCode: '2019051622044600098'
      }
      try {
        var res = await this.getTopicList(data)
        var topic = res.data.list[0]
        var answerList = []
        var arr1 = topic.itemCodes.split('||')
        var arr2 = topic.itemNames.split('||')
        arr1.forEach((ele, index) => {
          answerList.push({
            answer: ele + '.' + arr2[index],
            selected: false
          })
        })
        this.answerList = answerList
        this.topic = topic
      } catch (error) {
        console.log(error)
      }
    },
    // 获取中奖纪录
    async getList () {
      var data = {
        type: '1',
        pageNum: 1,
        pageSize: 20,
        isNow: '0'
      }
      try {
        var res = await this.getLuckDrawList(data)
        if (res) {
          this.goodsList = res.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async scoreSave (actIndex) {
      var prizeType
      switch (actIndex) {
        case 0:
          prizeType = 0
          break
        case 1:
          prizeType = 1
          break
        case 2:
          prizeType = 2
          break
        case 3:
          prizeType = 1
          break
        case 4:
          prizeType = 4
          break
        case 5:
          prizeType = 3
          break
        case 6:
          prizeType = 2
          break
        case 7:
          prizeType = 4
          break
      }
      var topicList = [
        {
          answer: this.answer,
          topicName: this.topic.topicName,
          type: this.topic.type,
          topicCode: this.topic.topicCode
        }
      ]
      var data = {
        type: '1',
        prize: prizeType + '',
        topicList: prizeType != 0 && this.answer ? topicList : []
      }
      try {
        var res = await this.LuckDrawSave(data)
        if (res.data == 'Y') {
          this.answerRight = true
        }
        if (res.data == 'N') {
          this.answerRight = false
        }
        this.showTopic = false
        if (!this.answer) {
          this.answered = false
        } else {
          this.answered = true
        }
      } catch (error) {
        Toast(error)
      }
    }
  }
}
</script>
<style lang="less">
  .activity517 .van-popup {
    width: 3.11rem;
    background-color: transparent;
    &.toast {
      width: 3.4rem;
    }
  }
</style>
<style lang='less' scoped>
@import url('../../../style/activity517.less');
// .box {
//   width: 300px !important;
//   height: 300px;
//   margin: 50px auto;
//   background: url('../../../assets/images/test.jpg') no-repeat center center;
//   background-size: 100% 100%;
//   overflow: hidden;
//   transition: all 5s linear;
//   border-radius: 50%;
//   text-align: center;
//   line-height: 300px;
// }
.activity517 {
  min-height: 100%;
}
</style>
