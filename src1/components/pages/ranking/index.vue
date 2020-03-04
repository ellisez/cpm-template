<template>
  <div class="box king_wrap">
    <div class="tab">
      <div class="month" @click="tabSelect(0)" :class="{'active':tabIndex == 0}">月榜</div>
      <div class="total" @click="tabSelect(1)" :class="{'active':tabIndex == 1}">总榜</div>
    </div>

    <div class="status-title">
      <div class="sort">排名</div>
      <div class="info">正确率/答题速度</div>
    </div>

    <div class="lists">
      <div class="item" v-for="(item,index) in list" :key="index">
        <div
          class="serial"
          :class="{
          'first':index == 0,
          'second':index == 1,
          'third':index == 2
        }"
        >{{index>2?index + 1:''}}</div>
        <div class="img">
          <img src="src1/assets/images/pic_mrtx.png" alt>
        </div>
        <div class="user">
          <div class="name" v-if="item.userName">{{ item.userName.slice(0,1) + '医生' }}</div>
          <div class="addr">{{ item.hospitalName }}</div>
        </div>
        <div class="time-box">
          <div class="time">{{ item.accuracy }}</div>
          <div class="info">{{ item.duration | capitalize }}分钟</div>
        </div>
      </div>

      <div class="height100"></div>
    </div>

      <div class="item mine" v-show="mine.userId">
        <div class="serial" >
        {{mine.index}}
        </div>
        <div class="img">
          <img src="src1/assets/images/pic_mrtx.png" alt="">
        </div>
        <div class="user">
          <div class="name">我</div>
          <div class="addr">{{ mine.hospitalName }}</div>
        </div>
        <div class="time-box">
          <div class="time">{{ mine.accuracy }}</div>
          <div class="info">{{ mine.duration | capitalize }}分钟</div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { changeTitle } from '../../../utils/func'
import storage from 'storejs'
import share from '../../../utils/share'
export default {
  created () {
    this.getList()
    window.pageYOffset = 0
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '排行榜',
        EventID: '1',
        ControlName: '',
        Description: ''
      })
    } catch (error) {
      console.log(error)
    }
  },
  mounted () {
    changeTitle('排行榜')
    this.hideLoad()
    share({
      title: '心时讯汇编',
      desc: '闯关答题解文献跃然榜首是达人',
      link: `${location.origin}${location.pathname}#/newsletter`,
      imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg'
    })
  },
  data () {
    return {
      tabIndex: 0,
      list: [],
      pageNum: 1,
      pageSize: 100,
      isLastPage: false,
      loading: false,
      loaded: false,
      mine: {}
    }
  },
  filters: {
    capitalize (value) {
      var minite = parseInt(value / 1000 / 60)
      var second =
        parseInt(((parseInt(value / 1000) % 60) / 60) * 100) > 10
          ? parseInt(((parseInt(value / 1000) % 60) / 60) * 100) + ''
          : '0' + parseInt(((parseInt(value / 1000) % 60) / 60) * 100)

      return minite + '.' + (second.slice(0, 1) != 0 ? second.slice(0, 1) : '')
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getRanking: 'content/getRanking',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
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
    // 类别选择
    tabSelect (index) {
      this.pageNum = 1
      this.mine = {}
      this.isLastPage = false
      this.list = []
      this.tabIndex = index
      this.getList()
    },
    // 获取列表信息
    async getList () {
      if (this.isLastPage || this.loading) {
        return
      }
      var data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        type: this.tabIndex
      }
      try {
        this.loading = true
        var res = await this.getRanking(data)
        var userid = storage.get(process.env.VUE_APP_STORAGE_NAME).userId
        if (res.data.list.length > 0 && res.data.list[res.data.list.length - 1].userId == userid) {
          if (this.pageNum == 1) {
            this.mine = res.data.list[res.data.list.length - 1]
          }

          res.data.list.forEach((ele, index) => {
            if (res.data.list.length - 1 != index) {
              this.list.push(ele)
            }
          })
        } else {
          res.data.list.forEach((ele, index) => {
            this.list.push(ele)
          })
        }
        this.list.forEach((ele, index) => {
          if (ele.userId == userid) {
            this.mine.index = index + 1
          }
        })
        if (!this.mine.index) {
          this.mine.index = '100+'
        }
        this.isLastPage = res.data.isLastPage
        this.pageNum = res.data.nextPage
        this.loading = false
        this.loaded = false
        this.load()
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.king_wrap{
  background: #fff;
  overflow: hidden;
}
@import url("src1/styleking.less");
</style>
