<template>
  <div class="index" style="height:100%;overflow:auto;padding-bottom:0.7rem;">
    <div class="fullscreen" @click.stop="isToggle819=false" v-if="isToggle819"></div>
    <indexDBT v-if="isRepresent === 'Y' " />
    <div v-show="isRepresent === 'N'">
      <!-- banner -->
      <div class="swiper-wrap" v-if="banners.length != 0">
        <Swipe :autoplay="4000" indicator-color="white">
          <Swipe-item v-for="(item,index) in banners" :key="index">
            <div class="swiper">
              <a @click="linkAddressGo(item.linkAddressUrl,item.id)">
                <img :src="item.thumbnailUrl" />
              </a>
            </div>
          </Swipe-item>
        </Swipe>
        <div class="personal" :class="{'news':fleg}">
          <router-link to="/self">
            <p></p>个人中心
          </router-link>
        </div>
      </div>
      <!-- 灰色间隔条 -->
      <!-- <div class="gray5"></div> -->

      <!-- 语音播放器 -->
      <div class="audio-box" v-if="voiseInfo" @click.stop="toVioce">
        <div class="left">
          <div class="img" @click.stop="palyVoise">
            <img :class="{'voise-bg':playing}" src="src1/assets/images/pic_mrtx.png" alt />
            <div class="mask"></div>
            <div class="play-btn" :class="{'pause':playing}"></div>
          </div>
        </div>

        <div class="right">
          <div class="title">{{ voiseInfo.question }}</div>
          <div class="nums">
            <div class="icon">MP3</div>
            <div class="listen" v-if="voiseInfo">{{ voiseInfo.academicAnswer[0].readNum }}人播放</div>
            <div class="time" v-if="voiseInfo">00:{{ voiseInfo.academicAnswer[0].voiceDuration }}</div>
          </div>
        </div>

        <div class="more" @click.stop="toList" to>更多</div>
      </div>

      <!-- 动态 -->
      <div class="dynamic" v-show="dynamicList.length > 0">
        <div class="item-box" ref="dynamic">
          <div
            class="item"
            v-for="(item,index) in dynamicList"
            :key="index"
            v-show="dynamicList.length > 0"
          >
            {{ item.title }}
            <div class="detail-btn" @click="toNotise(item)">详情</div>
          </div>

          <div class="item" v-if="dynamicList[0]">
            {{ dynamicList[0].title }}
            <div class="detail-btn" @click="toNotise(dynamicList[0])">详情</div>
          </div>
        </div>
      </div>

      <listItem v-if="zbList[0]" :value="zbList[0]" source="11" time livestatus column />
      <div v-for="(item,index) in list" :key="index">
        <div v-if="item.modelCode == 'AMYXY-HYZX'">
          <div class="tab">
            <div class="name">行业资讯</div>
            <router-link class="more" to="/frontier?modelCode=AMYXY-HYZX">更多</router-link>
          </div>
          <div class="lists">
            <listItem
              v-for="(item1,index1) in item.list"
              :key="index1"
              :value="item1"
              source="11"
              praise
              read
              label
            />
          </div>
        </div>

        <div v-if="item.modelCode == 'AMYXY-WXJD' && false">
          <div class="tab">
            <div class="name">文献解读</div>
            <router-link class="more" to="/frontier?modelCode=AMYXY-WXJD">更多</router-link>
          </div>
          <div class="lists">
            <listItem
              v-for="(item1,index1) in item.list"
              :key="index1"
              :value="item1"
              source="11"
              praise
              read
              label
            />
          </div>
        </div>

        <div v-if="item.modelCode == 'AMYXY-QNYSJ'">
          <div class="tab">
            <div class="name">青年演说家</div>
            <router-link class="more" to="/youngspeakers">更多</router-link>
          </div>
          <div class="lists">
            <listItem
              v-for="(item1,index1) in item.list"
              :key="index1"
              :value="item1"
              source="11"
              praise
              read
              label
            />
          </div>
        </div>

        <div v-if="item.modelCode == 'AMYXY-BJJTJ'">
          <div class="tab">
            <div class="name">百家讲坛集</div>
            <router-link class="more" to="/information">更多</router-link>
          </div>
          <div class="lists bjjt">
            <videoList
              v-for="(item1,index1) in item.list"
              source="11"
              :key="index1"
              :value="item1"
            />
          </div>
        </div>
      </div>
      <!-- 819活动入口 -->
      <div class="activityEntry" @click.stop="toggle819" v-show="this.is_activity === 1">
        <div class="activityEntry_wrap">
          <div class="activityEntry_cicle">
            <span></span>
          </div>
        </div>
      </div>
      <!-- 展开 的内容 -->
      <div class="activityEntry" @click.stop="toActivity('anniu')" v-if="isToggle819">
        <div :class="['activityEntry_wrap',isToggle819?'activityEntryNLXF':'']">
          <div class="activityEntry_cicle">
            <span></span>
          </div>
          <div class="activityEntry_txt" v-show="isToggle819">医者风采大赏</div>
        </div>
      </div>
      <!-- 819 弹框 dialogShow_info819 -->

      <y-dialog
        v-model="dialogShow_info819_ysd"
        @closed="hideDialogInfo"
        v-if="isRepresent !== 'Y'"
      >
        <div class="first819tk">
          <img src="src1/assets/819/indexTk_bg_ysd.png" alt class="bg_819" />
          <div class="first819tk_footer" @click.stop="toActivity('banner')">
            <span>活动详情</span>
          </div>
        </div>
      </y-dialog>
    </div>
    <!-- 签到 -->
    <div class="sign" @click="addSign" v-show="canSign">
      <img src="src1/assets/images/sign.png" alt />
    </div>

    <!-- 517活动 弹窗 -->
    <!-- <Popup v-model="show517">
      <div class="activity" @click.stop="to517">
        <img src="../../assets/517/517index.png" alt="" @click.stop="to517">

        <div class="act-btn" @click.stop="to517">
          <img src="../../assets/517/toast-btn.png" alt="" @click.stop="to517">
          <div @click.stop="to517">查看详情</div>
        </div>
      </div>
    </Popup>-->
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { Swipe, SwipeItem, Toast, Popup } from 'vant'
import storage from 'storejs'
import listItem from '../lists/list-item'
import videoList from '../lists/video-list'
import indexDBT from '../dbt/index'
import { changeTitle } from '../../utils/func'
import share from '../../utils/share'
import dbtService from '../../api/serviceAPI'
// import yDialog from "@/components/common/dialog";
import mixin819 from '../../utils/mixin819'
export default {
  mixins: [mixin819],

  components: {
    listItem,
    Swipe,
    SwipeItem,
    videoList,
    indexDBT,
    yDialog: Popup
    // yDialog
  },
  data () {
    return {
      isToggle819: false, // 819 伸缩兰是否展开
      dialogShow_info819_ysd: false, // 819 弹框
      banners: [], // 轮播图列表
      list: [],
      zbList: [],
      zb: [],
      hyzxList: [], // 行业资讯列表
      wxjdList: [], // 文献解读列表
      cjysjList: [], // 超级演说家列表
      bjjtList: [], // 百家讲坛集列表
      dynamic: '', // 存放动态box的dom对象
      dynamicTop: '', // 当前dynamic的dox对象top值
      dynamicList: [], // 新动态数据列表
      canAdd: true, // 控制当前新动态是否需要驱动
      dynamicTimer: '', // 新动态定时器
      voiseInfo: '',
      playing: false,
      audio: '',
      seconds: '',
      report_listen_timer: '', // 录音收听上报时长
      canSign: false,
      isRepresent: '',
      inviteUid: '',
      fleg: false,
      canReport: true,
      show517: false
    }
  },
  mounted () {
    console.log()
    this.hideLoad()
    if (this.isRepresent === 'N') {
      this.getNotise()
      // 在相应时间展示
      this.init517().then(res => {
        this.show517 = res
        console.log(this.show517)
      })
    }

    this.init819Activity() // 初始化819时间
    // 819 弹框 限制 每天弹一次
    this.init819Dialog().then(res => {
      console.log(res, '819')
      if (res) {
        // 初始化819
        this.init819Activity()
          .then(res => {
            console.log(res, '819')
            setTimeout(() => {
              this.$nextTick(() => {
                this.dialogShow_info819_ysd = this.is_activity === 1
              })
            }, 300)
          })
          .catch(e => {
            console.log('初始化819shibai')
          })
      }
    })

    // if (this.$route.query && this.$route.query.inviteUid) {
    //   this.inviteUid = this.$route.query.inviteUid;
    //   this.inviteSave();
    // }
    share({
      title: '傲美云学院',
      desc: '智能学院在手，心血管医学知识一网打尽 ！',
      link: `${location.origin}${location.pathname}#/`,
      imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg'
    })
    try {
      this.baoSaveReport({
        PageName: '首页',
        EventID: '1',
        ControlName: '',
        Description: '首页访问'
      })
    } catch (error) {
      console.log(error)
    }
  },
  created () {
    this.isRepresent = storage.get('userInfoAMY') ? 'Y' : 'N'
    if (this.isRepresent === 'N') {
      this.getBanner()
      this.getList()
      this.getZbList()
      // this.gethyzxList()
      // this.getwxjdList()
      // this.getcjysjList()
      this.getVoise()
      // this.getbjjtList()
      this.checkSign()
      this.getNewsMsg()
    }
    changeTitle('首页')
    this.temporaryRepair()
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getBannerList: 'content/getBannerList',
      getCommonList: 'content/getCommonList',
      getLiveList: 'content/getLiveList',
      reportSourceUrl: 'content/reportSourceUrl',
      research: 'content/research',
      sign: 'user/sign',
      queryYnAskList: 'content/queryYnAskList',
      reportUserTime: 'content/reportUserTime',
      isCanSign: 'user/isCanSign',
      getNotiseList: 'content/getNotiseList',
      getAmyHomeList: 'content/getAmyHomeList',
      getNews: 'content/getNews',
      baoSaveReport: 'ubt/baoSaveReport',
      reportReadNum: 'content/reportReadNum',
      getSysTime: 'ubt/getSysTime'
    }),
    /**
     * 键盘回弹问题
     */
    temporaryRepair () {
      console.log('我懂了')
      var currentPosition, timer
      var speed = 1 // 页面滚动距离
      timer = setInterval(function () {
        currentPosition =
          document.documentElement.scrollTop || document.body.scrollTop
        currentPosition -= speed
        window.scrollTo(0, currentPosition) // 页面向上滚动
        currentPosition += speed // speed变量
        window.scrollTo(0, currentPosition) // 页面向下滚动
        clearInterval(timer)
      }, 1)
    },
    /**
     * 展开819
     */
    toggle819 () {
      this.isToggle819 = true
    },
    /**
     * 隐藏819弹框
     */
    hideDialogInfo () {
      this.dialogShow_info819_ysd = false
    },
    /**
     * 去819活动
     */
    toActivity (type) {
      this.$router.push({
        path: '/activity819ysd'
      })
      var data = {
        PageName: '医生端活动入口-' + type,
        ControlName: '医生端活动入口-' + type,
        ActionType: 2,
        ActionObj: '2',
        ActionName: '医生端活动入口-点击-' + type,
        Description: '医生端活动入口-' + type
      }
      try {
        this.baoSaveReport(data)
      } catch (error) {
        console.log(error)
      }
    },
    async init517 () {
      var res = await this.getSysTime()
      var now = new Date(res.data.replace(/-/gi, '/'))
      var date = now.getDate()
      var month = now.getMonth() + 1
      console.log(month + '-' + date)
      var last = storage.get('517') || ''
      this.setDate()
      if (month + '-' + date != last) {
        return true
      } else {
        return false
      }
    },
    async init819Dialog () {
      var res = await this.getSysTime()
      var now = new Date(res.data.replace(/-/gi, '/'))
      var date = now.getDate()
      var month = now.getMonth() + 1
      console.log(month + '-' + date)
      var last = storage.get('819') || ''
      this.setDate819()
      if (month + '-' + date != last) {
        return true
      } else {
        return false
      }
    },
    to517 () {
      this.setDate()
      this.$router.push({
        path: 'activity517'
      })
    },
    async setDate () {
      try {
        var res = await this.getSysTime()
        var now = new Date(res.data.replace(/-/gi, '/'))
        var date = now.getDate()
        var month = now.getMonth() + 1
        storage.set('517', month + '-' + date)
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 819
     */
    async setDate819 () {
      try {
        var res = await this.getSysTime()
        var now = new Date(res.data.replace(/-/gi, '/'))
        var date = now.getDate()
        var month = now.getMonth() + 1
        storage.set('819', month + '-' + date)
      } catch (error) {
        console.log(error)
      }
    },
    // 上报收听次数
    add () {
      var pageCode = '8'
      var code = this.voiseInfo.academicAnswer[0].code
      var data = {
        pageCode,
        code
      }
      this.reportReadNum(data)
    },
    // 跳转到学术同期声
    toList () {
      try {
        this.baoSaveReport({
          PageName: '首页',
          EventID: '2',
          ControlName: '学术同期声-更多',
          Description: 'path: "/academicsync"'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/academicsync'
      })
    },
    // 查询是否有新消息
    getNewsMsg () {
      this.getNews({}).then(res => {
        console.log(res)
        this.fleg = !res.data.flag
      })
    },
    // 获取首页list
    async getList () {
      var res = await this.getAmyHomeList()
      this.list = res.data.list
      console.log(res)
    },
    // 获取学术同期声第一条语音
    palyVoise () {
      try {
        this.baoSaveReport({
          PageName: '首页',
          EventID: '2',
          ControlName: '播放语音',
          Description: '首页学术同期声录音'
        })
      } catch (error) {
        console.log(error)
      }
      if (this.playing) {
        this.playing = false
        this.audio.pause()
      } else {
        this.playing = true
        this.audio.play()

        if (this.canReport) {
          this.add()
          this.canReport = false
          setTimeout(() => {
            this.canReport = true
          }, 10000)
        }
      }
    },

    // //录入邀请人记录
    // async inviteSave() {
    //   const data = {
    //     inviteUid: this.inviteUid,
    //     beInviteUid: storage(process.env.VUE_APP_STORAGE_NAME).userId
    //   };
    //   console.log(data);
    //   try {
    //     const res = await dbtService.inviteSave(data);
    //     console.log(res);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    // 学术同期声详情
    toVioce () {
      try {
        this.baoSaveReport({
          PageName: '首页',
          EventID: '2',
          ControlName: '学术同期声-详情',
          Description: '/answerDetail' + this.voiseInfo.code
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/answerDetail',
        query: {
          code: this.voiseInfo.code
        }
      })
    },
    // 广播详情
    toNotise (item) {
      try {
        this.baoSaveReport({
          PageName: '首页',
          EventID: '2',
          ControlName: '广播详情',
          Description: item.linkAddressUrl
        })
      } catch (error) {
        console.log(error)
      }
      location.href = item.linkAddressUrl
    },
    // 获取直播数据
    async getZbList () {
      var data = {
        pageNum: 1,
        pageSize: 1
      }

      try {
        var res = await this.getCommonList(data)
        console.log(res)
        if (
          res.data.list[0].broadcastStatus == 'D' ||
          !res.data.list[0].broadcastStatus
        ) {
          // return;
        } else {
          this.zb = res.data.list
        }
        console.log(12456)
        this.getZbList1()
      } catch (error) {
        console.log(error)
      }
    },
    // 获取直播数据2
    async getZbList1 () {
      var data = {
        pageNum: 1,
        pageSize: 1
      }
      try {
        var res = await this.getLiveList(data)
        console.log(res)
        if (
          res.data.list[0].broadcastStatus == 'D' ||
          !res.data.list[0].broadcastStatus
        ) {
          this.zbList = this.zb
          return
        } else {
          if (this.zb[0]) {
            var oldTime = new Date(
              this.zb[0].broadcastStartTime.replace(/-/gi, '/')
            )
            var newTime = new Date(
              res.data.list[0].broadcastStartTime.replace(/-/gi, '/')
            )
            if (newTime - oldTime < 0) {
              this.zbList = res.data.list
            } else {
              this.zbList = this.zb
            }
          } else {
            this.zbList = res.data.list
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取广播列表s
    async getNotise () {
      try {
        var res = await this.getNotiseList()
        this.dynamicList = res.data
        this.dynamicInit()
      } catch (error) {
        console.log(error)
      }
    },
    async getVoise () {
      var data = {
        modelCode: 'AMYXY-XSTQS',
        pageNum: 1,
        pageSize: 1,
        screenType: 1
      }
      try {
        var res = await this.queryYnAskList(data)
        if (res.data.list != '') {
          this.voiseInfo = res.data.list[0]
          var list = []
          if (this.voiseInfo && this.voiseInfo.academicAnswer) {
            var now = this.voiseInfo.academicAnswer[0]
          }

          this.voiseInfo.academicAnswer.forEach(ele => {
            if (
              new Date(
                ele.createTime.replace(/-/gi, '/') -
                  new Date(now.createTime.replace(/-/gi, '/') > 0)
              )
            ) {
              now = ele
            }
          })
          this.voiseInfo.academicAnswer = [now]
          // 播放器初始化
          this.voiseInit()
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 录音播放器初始化
    voiseInit () {
      this.audio = new Audio()
      this.audio.src = this.voiseInfo.academicAnswer[0].answerUrl
      this.audio.load()
      var t = 0
      var duration = Math.ceil(this.voiseInfo.academicAnswer[0].voiceDuration)
      this.seconds = '00'
      this.audio.addEventListener('play', () => {
        if (this.report_listen_timer) {
          clearInterval(this.report_listen_timer)
        }
        this.report_listen_timer = setInterval(() => {
          let data = {
            type: this.voiseInfo.academicAnswer[0].type,
            code: this.voiseInfo.academicAnswer[0].code,
            logType: '2',
            viewId: ''
          }
          this.reportUserTime(data).then(res => {
            console.log(res)
          })
        }, 5000)
        this.playing = true
      })
      this.audio.addEventListener('pause', () => {
        clearInterval(this.report_listen_timer)
        this.playing = false
      })
      this.audio.addEventListener('timeupdate', e => {
        var time = parseInt(this.audio.currentTime)
        // console.dir(this.audio)
        this.seconds = time < 10 ? '0' + time : time
      })
    },
    // 动态效果初始化
    dynamicInit () {
      console.dir(this.$refs.dynamic)
      this.dynamic = this.$refs.dynamic

      this.dynamic.addEventListener('touchstart', () => {
        // 用户点击当前动态消息时  消息动态效果取消5秒
        this.dynamic.style.transition = 'none'
        this.canAdd = false
        if (this.dynamicTimer) {
          clearTimeout(this.dynamicTimer)
        }
        this.dynamicTimer = setTimeout(() => {
          this.dynamic.style.transition = 'top .2s linear'
          this.canAdd = true
        }, 5000)
      })

      this.dynamicTop = 0
      var count = this.dynamicList.length // 动态获取数据条数

      setInterval(() => {
        // 新动态2秒间隔跳动
        this.dynamic.style.transition = 'top .2s linear'
        if (this.canAdd) {
          // 判断当前是否需要跳转到下一条
          this.dynamicTop += 1
        }
        this.dynamic.style.top = '-' + this.dynamicTop * 30 + 'px'
      }, 2000)

      this.dynamic.addEventListener('transitionend', () => {
        // 动态效果到达最后阶段时   直接跳到第一个   以达到连贯的效果
        if (this.dynamicTop >= count) {
          this.dynamic.style.transition = 'none'
          this.dynamicTop = 0
          this.dynamic.style.top = '0px'
        }
      })
    },

    async addSign () {
      try {
        this.baoSaveReport({
          PageName: '首页',
          EventID: '2',
          ControlName: '签到',
          Description: '首页签到'
        })
      } catch (error) {
        console.log(error)
      }
      var data = {}
      // console.log(111)
      try {
        var res = await this.sign(data)
        if (res.data.score > 0) {
          Toast('签到成功\n积分+' + res.data.score)
        }
        this.canSign = false
      } catch (error) {
        Toast(error)
      }
    },
    // 检查是否签到
    async checkSign () {
      // try {
      var res1 = await this.isCanSign()
      this.canSign = res1.data.flag == 0

      // console.log(this.isCanSign())
      // } catch (error) {
      //   console.log(error)
      // }
    },
    // 获取banner列表
    async getBanner () {
      try {
        //  // 819 活动 医生端
        // let a819 = {
        //   areaCode: "",
        //   areaName: "",
        //   bannerCode: "201908160164300013",
        //   columnCode: "",
        //   id: 230,
        //   isSeniorShow: "A",
        //   linkAddressUrl: "https://merch.yishengzhan.cn/amyxy/#/activity819ysd",
        //   modelCode: "",
        //   thumbnailUrl: "https://imageysz.yxj.org.cn/201908160163300012"
        // };
        var res = await this.getBannerList({})
        this.banners = res.data
        // this.banners.unshift(a819);
      } catch (error) {
        console.log(error)
      }
    },
    // 轮播图跳转
    async linkAddressGo (url, sourceId) {
      try {
        this.baoSaveReport({
          PageName: '首页',
          EventID: '2',
          ControlName: 'banner点击',
          Description: url
        })
      } catch (error) {
        console.log(error)
      }

      let linkAddressUrl = url.split('?')[0]
      let outLinkPath = linkAddressUrl.split('#/')[1]
      let outLinkType
      switch (outLinkPath) {
        case 'articleDetail':
          outLinkType = 1
          break
        case 'meetingDetail':
          outLinkType = 2
          break
        case 'videoDetail':
          outLinkType = 3
          break
        case 'survey':
          outLinkType = 4
          break
        default:
          outLinkType = 6
          break
      }

      var encrypt = storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt || ''
      let data = {
        url: url,
        type: outLinkType
      }
      try {
        // banner跳转上报
        var res = await this.reportSourceUrl(data)
      } catch (error) {
        Toast(error)
        return
      }

      if (linkAddressUrl.indexOf('/#/survey') >= 0) {
        var paramsStr = url.split('?')[1]
        var params = []
        params = paramsStr.split('&')
        var param = []
        var paramObj = new Object()

        for (var i = 0; i < params.length; i++) {
          param = params[i].split('=')
          paramObj[param[0]] = param[1]
        }
        var userId = storage.get('amy').userId || ''
        var encrypt = storage.get('amy').encrypt || ''
        let data = {
          userId: userId,
          code: paramObj.code
        }
        try {
          var res1 = await this.research(data)
          let isFlag = res.body.data.isFlag
          if (isFlag == 1) {
            Toast('您已参与该调研')
          } else {
            location.href = url + '&refCode=' + sourceId + "&sourceType='A'"
          }
        } catch (error) {
          Toast(error)
        }
      } else {
        this.source = '10'
        if (url.indexOf('?') >= 0) {
          location.href = url + '&source=' + this.source
        } else {
          location.href = url + '?source=' + this.source
        }
      }
    }
  },
  watch: {
    $route () {},
    playing () {
      console.log(123)
    }
  },
  beforeDestroy () {
    if (this.isRepresent === 'N' && this.audio) {
      this.audio.pause()
    }
  },
  destroyed () {}
}
</script>
<style lang="less">
.mint-swipe-indicator.is-active {
  background-color: #5d84bc;
  opacity: 0.8;
}
.mint-swipe-indicator {
  background-color: #000;
  opacity: 0.3;
}
</style>
<style lang="less" scoped>
@import "src1/styleindex.less";
.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 333;
}
.activityEntry {
  position: fixed;
  right: 0;
  top: 50%;
  z-index: 666;
}
.activityEntryNLXF {
  width: 1.44rem !important;
}
.activityEntry_wrap {
  width: 0.5rem;
  height: 0.4rem;
  transition: 0.1s all ease;
  background: rgba(216, 216, 216, 1);
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  align-items: center;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
}
.activityEntry_cicle {
  width: 0.33rem;
  height: 0.33rem;
  border-radius: 50%;
  //   background: #39b9d4;
  background: url(src1/assets/819/activityEntry_cicle-red.png) no-repeat
    no-repeat;
  background-size: 100% 100%;
  font-size: 0.12rem;
  color: #fff;
}
.activityEntry_txt {
  flex: 1;
  color: #fff;
  margin-left: 0.1rem;
}
.first819tk {
  width: 2.7rem;
  height: 3.74rem;
  display: flex;
  justify-content: center;
  .bg_819 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  //   background: url(../../assets/819/indexTk_bg_ysd.png) no-repeat no-repeat;
  //   background-size: 100% 100%;
  //   position: absolute;
  //   z-index: 7777;
  //   left: 50%;
  //   transform: translate(-50%, 0);
  //   top: 20%;
  //   padding-top: 2.4rem;
  &_desc {
    color: #fff;
    font-size: 0.13rem;
  }
  &_footer {
    width: 1.2rem;
    height: 0.28rem;
    color: #333;
    line-height: 0.28rem;
    text-align: center;
    background: #fff;
    // background: red;
    margin-top: 2.4rem;
    border-radius: 0.14rem;
    font-size: 0.12rem;
  }
}
.act-btn {
  width: 2rem;
  margin: 30px auto;
  margin-top: 0.9rem;
  font-size: 0.2rem;
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translateX(-50%);
  div {
    width: 100%;
    text-align: center;
    line-height: 0.5rem;
    color: #fff;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
<style>
.van-swipe__indicators {
  bottom: 0.17rem;
}
.activity {
  width: 3.11rem;
}
</style>
<style lang="less">
.index .van-popup {
  background-color: transparent;
  &.toast {
    width: 3.4rem;
  }
}
</style>
