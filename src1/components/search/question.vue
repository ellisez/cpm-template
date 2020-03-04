<template>
  <div class="search-box">
    <!-- 输入框 -->
    <div class="input-box">
      <input class="input" v-model="searchTxt" type="text" placeholder="请输入搜索关键字">
      <div class="search-btn" @click="search">搜索</div>
    </div>
    <!-- 筛选条件 -->
    <div>
      <div class="tab" v-show="historyList.length > 0 && showHistory">历史搜索</div>

      <div class="labels" v-show="historyList.length > 0 && showHistory">
        <div
          class="item history"
          v-for="(item,index) in historyList"
          :key="index"
          @click="hisSelect(item)"
        >{{item}}</div>
      </div>
    </div>

    <div class="list">
      <question
        v-for="(item,index) in list"
        :key="index"
        source="15"
        :value="item"
        :player="player"
        :voiceUrl="voiceUrl"
        @setUrl="setUrl"
      />
    </div>

    <!-- 底部提示 -->
    <div class="no-more">
      <div class="none" v-show="isLastPage && list.length > 0">我是有底线的~</div>
      <div class="nothing" v-show="loaded && list.length == 0">
        <img src="src1/assets/images/nothing.png" alt>
        <div class="txt-info">暂无内容</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import storage from 'storejs'
import { Toast } from 'vant'
import question from '../lists/question'
import { changeTitle } from '../../utils/func'
export default {
  components: {
    question
  },
  created () {
    changeTitle('搜索')
    this.historyList = storage.get('amyHis') || []

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
  },
  mounted () {
    this.hideLoad()
  },
  data () {
    return {
      list: [],
      historyList: [],
      searchTxt: '',
      pageNum: 1,
      pageSize: 10,
      isLastPage: false,
      loading: false,
      loaded: false,
      showHistory: true,
      voiceUrl: {},
      player: {},
      report_listen_timer: ''
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      queryYnAskList: 'content/queryYnAskList',
      reportUserTime: 'content/reportUserTime'
    }),
    setUrl (url) {
      this.voiceUrl = url
    },
    hisSelect (item) {
      this.searchTxt = item
      this.pageNum = 1
      this.isLastPage = false
      this.list = []
      this.loaded = false
      this.getList()
    },
    labelSelect (label) {
      this.pageNum = 1
      this.isLastPage = false
      this.loading = false
      this.list = []
      this.loaded = false
      this.getList()
    },
    load () {
      // 下拉到页面底部   加载更多列表
      window.onscroll = () => {
        const scrollTop =
          window.pageYOffset || // 用于FF
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0 // 获取页面滚动出去高度
        const clientHeigth = document.documentElement.clientHeight // 获取浏览器窗口的高度
        const scrollHeight = document.documentElement.scrollHeight // 获取页面高度
        if (scrollTop + clientHeigth + 10 >= scrollHeight) {
          // 当页面页面滚动出去的 高度 + 获取浏览器窗口的高度 > 页面高度
          // 加载列表下一页的内容
          console.log('触底了')
          this.getList()
        }
      }
    },
    async getList () {
      console.log(this.loading)
      if (this.isLastPage || this.loading) {
        return
      }
      var data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        question: this.searchTxt,
        modelCode: this.$route.query.modelCode,
        screenType: this.$route.query.screenType || ' '
      }
      try {
        this.loading = true
        console.log(1)
        var res = await this.queryYnAskList(data)
        console.log(2)
        this.list = this.list.concat(res.data.list)
        this.pageNum = res.data.nextPage
        this.isLastPage = res.data.isLastPage
        this.loading = false
        this.loaded = true
        this.showHistory = false
        this.load()
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },
    search () {
      if (!this.searchTxt) {
        Toast('请输入搜索关键字')
        return
      }
      var history = storage.get('amyHis') || []
      if (history.indexOf(this.searchTxt) == -1) {
        // 当前搜索关键字在搜索历史中
        history.unshift(this.searchTxt)
      } else {
        // 当前搜索关键字不在搜索历史中
        var index = history.indexOf(this.searchTxt)
        var list = [this.searchTxt]
        history.forEach(ele => {
          if (ele != this.searchTxt) {
            console.log(ele)
            console.log(this.searchTxt)
            list.push(ele)
          }
        })
        history = list
      }
      storage.set('amyHis', history)
      this.pageNum = 1
      this.isLastPage = false
      this.list = []
      this.getList()
    }
  },
  watch: {
    searchTxt () {
      console.log(211)
      if (!this.searchTxt) {
        this.isLastPage = false
        this.loaded = false
        this.list = []
        this.pageNum = 1
        this.historyList = storage.get('amyHis')
        this.showHistory = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url("src1/stylesearch.less");
</style>
<style>
</style>
