// 学术同期声
<template>
  <div class="speak">
    <div class="search">
      <div class="input" @click="toSearch">输入关键字搜索</div>
    </div>

    <div class="add-enter">
      欢迎提问，提问有奖励哦！
      <div class="add-btn" @click="addQuestion">提问</div>
    </div>

    <div class="tab" v-show="waitList.length > 0">
      <div class="name">待解答</div>
      <router-link class="more" to="/answerList?screenType=0">更多</router-link>
    </div>

    <div class="lists">
      <question
        v-for="(item,index) in waitList"
        :key="index"
        :value="item"
        :player="player"
        :voiceUrl="voiceUrl"
        @setUrl="setUrl"
      />
    </div>

    <div class="gray10"></div>

    <div class="tab" v-show="overlist.length > 0">
      <div class="name">已解答</div>
      <router-link class="more" to="/answerList?screenType=1">更多</router-link>
    </div>
    <div class="lists">
      <question
        v-for="(item,index) in overlist"
        :key="index"
        :value="item"
        :player="player"
        :voiceUrl="voiceUrl"
        @setUrl="setUrl"
      />
    </div>

    <div class="height70"></div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import storage from 'storejs'
import question from '../../lists/question'
import { changeTitle } from '../../../utils/func'
import share from '../../../utils/share'
export default {
  components: {
    question
  },
  created () {
    changeTitle('学术同期声')
    this.player = new Audio()
    this.player.addEventListener('play', () => {
      console.log('录音播放', this.player)

      if (this.report_listen_timer) {
        clearInterval(this.report_listen_timer)
      }
      // 设置定时器上报时长
      this.report_listen_timer = setInterval(() => {
        let data = {
          type: this.voiceUrl.type,
          code: this.voiceUrl.code,
          logType: '2',
          viewId: ''
        }
        this.reportUserTime(data).then(res => {
          console.log(res)
        })
      }, 5000)
      // this.playing = false
    })
    this.player.addEventListener('pause', () => {
      console.log('录音暂停', this.player)
      // 录音暂停清除上报时长定时器
      clearInterval(this.report_listen_timer)
      // this.playing = false
    })
    this.player.addEventListener('timeupdate', () => {
      // console.log('录音播放中',this.player.src)
      // this.playing = false
    })
    this.player.addEventListener('ended', () => {
      console.log('录音播放结束', this.player.src)
      clearInterval(this.report_listen_timer)
      this.voiceUrl = {}
      // this.playing = false
    })
    this.getwaitList()
    this.getOverList()
  },
  mounted () {
    this.hideLoad()
    share({
      title: '学术同期声',
      desc: '有问题发语音答疑解惑专家行',
      link: `${location.origin}${location.pathname}#/academicsync`,
      imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg'
    })

    // 埋点
    this.baoSaveReport({
      PageName: '学术同期声',
      EventID: '1',
      ControlName: '',
      Description: '/academicsync'
    })
  },
  data () {
    return {
      overlist: [],
      waitList: [],
      voiceUrl: {},
      player: {},
      report_listen_timer: ''
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      queryYnAskList: 'content/queryYnAskList',
      reportUserTime: 'content/reportUserTime',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    toSearch () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '学术同期声-搜索',
          EventID: '2',
          ControlName: '关键字搜索',
          Description: '进入搜索'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/searchQuestion',
        query: {
          modelCode: 'AMYXY-XSTQS',
          screenType: ''
        }
      })
    },
    setUrl (url) {
      this.voiceUrl = url
    },
    // 获取待解答列表
    async getwaitList () {
      var data = {
        screenType: 0,
        pageNum: 1,
        pageSize: 2
      }
      try {
        var res = await this.queryYnAskList(data)
        this.waitList = res.data.list
      } catch (err) {
        console.log(err)
      }
    },
    // 获取已解答列表
    async getOverList () {
      var data = {
        screenType: 1,
        pageNum: 1,
        pageSize: 2
      }
      try {
        var res = await this.queryYnAskList(data)
        this.overlist = res.data.list
      } catch (error) {
        console.log(error)
      }
    },
    // 添加提问
    addQuestion () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '学术同期声',
          EventID: '2',
          ControlName: '添加提问',
          Description: '点击提问'
        })
      } catch (error) {
        console.log(error)
      }
      var encrypt = storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt
      if (!encrypt) {
        storage.set('amyfrom', location.href)
        MessageBox.confirm('您还没登录是否去登陆?').then(action => {
          this.$router.push({
            path: '/login'
          })
        })
        return
      }

      try {
        // 埋点
        this.baoSaveReport({
          PageName: '学术同期声',
          EventID: '2',
          ControlName: '添加提问',
          Description: '进入提问'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push('/question')
    }
  },
  beforeDestroy () {
    this.player.pause()
    this.voiceUrl = ''
  },
  watch: {
    $route () {
      this.player.pause()
      this.voiceUrl = ''
    }
  }
}
</script>

<style lang='less' scoped>
@import url("../../../style/academicsync.less");
</style>
