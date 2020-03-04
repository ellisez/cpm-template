<template>
  <div class="box">

    <div class='search information-search'>
      <div class='input' @click="toSearch">
        输入关键字搜索
      </div>
      <div class="tab" @click="showChange">

      </div>
    <div class="list" v-if="showList">
      <div class="title">
        <img src="src1/assets/icons/top.png" alt="">
      </div>
      <div class="listBox">
        <div
          class="item"
          @click="itemSelect(item)"
          v-for="(item,index) in tabList"
          :key="index"
        >{{item.positionName}}</div>
      </div>
      <div class="bottom">
        <img src="src1/assets/icons/bottom.png" alt="">
      </div>
    </div>
    </div>
    <countdown video v-if="zbInfo.code" :value='zbInfo' />
    <div class="lists">
      <list-item v-for="(item,index) in list" :key="index" :value='item'/>
    </div>

    <!-- 底部提示 -->
    <div class="no-more">
      <div class="none" v-show="isLastPage && list.length > 0">我是有底线的~</div>
      <div class="nothing" v-show="loaded && list.length == 0">
        <img src="src1/assets/images/nothing.png" alt="">
        <div class="txt-info">暂无内容</div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import listItem from '../../lists/video-list'
import countdown from '../../common/countdown'
import { changeTitle } from '../../../utils/func'
import share from '../../../utils/share'
export default {
  components: {
    listItem, countdown
  },
  created () {
    this.hideLoad()
    this.modelCode = this.$route.query.modelCode
    this.columnCode = this.$route.query.columnCode
    this.getList()
    if (this.columnCode == 'AMYXY-BJJTJ-CJFT') {
      changeTitle('超级访谈')
    } else if (this.columnCode == 'AMYXY-BJJTJ-WQHG') {
      changeTitle('往期精选')
    }
  },
  mounted () {
    share({
      title: this.columnCode == 'AMYXY-BJJTJ-CJFT' ? '超级访谈' : '往期精选',
      desc: '大咖超访聚焦热点 同台探讨',
      link: `${location.origin}${location.pathname}#/informationLists?modelCode=${this.modelCode}&columnCode=${this.columnCode}`,
      imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg'
    })
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '百家讲坛集-列表页',
        EventID: '1',
        ControlName: '',
        Description: this.columnCode == 'AMYXY-BJJTJ-CJFT' ? '超级访谈' : '往期精选'
      })
    } catch (error) {
      console.log(error)
    }
  },
  data () {
    return {
      list: [],
      zbInfo: {},
      modelCode: '',
      pageNum: 1,
      pageSize: 10,
      loading: false,
      isLastPage: false,
      loaded: false,
      tabList: [
        {
          positionName: '超级访谈',
          columnCode: 'AMYXY-BJJTJ-CJFT'
        },
        {
          positionName: '往期精选',
          columnCode: 'AMYXY-BJJTJ-WQHG'
        }
      ],
      showList: false
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getArticleList: 'content/getArticleList',
      baoSaveReport: 'ubt/baoSaveReport'
    }),

    showChange () {
      this.showList = !this.showList
    },
    toSearch () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '百家讲坛集-列表页',
          EventID: '2',
          ControlName: '关键字搜索',
          Description: this.columnCode == 'AMYXY-BJJTJ-CJFT' ? '超级访谈' : '往期精选'
        })
      } catch (error) {
        console.log(error)
      }
      var data = {
        modelCode: this.$route.query.modelCode || '',
        columnCode: this.$route.query.columnCode || ''
      }
      this.$router.push({
        path: '/searchVideo',
        query: data
      })
    },
    itemSelect (item) {
      console.log(item.modelCode)
      if (this.columnCode != item.columnCode) {
        this.columnCode = item.columnCode
        this.pageNum = 1
        this.list = []
        this.zbInfo = {}
        this.isLastPage = false
        this.loading = false
        this.loaded = false
        this.getList()
        this.showList = false
        if (this.columnCode == 'AMYXY-BJJTJ-CJFT') {
          changeTitle('超级访谈')
        } else if (this.columnCode == 'AMYXY-BJJTJ-WQHG') {
          changeTitle('往期精选')
        }
        share({
          title: this.columnCode == 'AMYXY-BJJTJ-CJFT' ? '超级访谈' : '往期精选',
          desc: '大咖超访聚焦热点 同台探讨',
          link: `${location.origin}${location.pathname}#/informationLists?modelCode=${this.modelCode}&columnCode=${this.columnCode}`,
          imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg'
        })
      } else {
        this.showList = false
      }
    },
    load () {
    // 下拉到页面底部   加载更多列表
      window.onscroll = () => {
        const scrollTop = window.pageYOffset || // 用于FF
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0 // 获取页面滚动出去高度
        const clientHeigth = document.documentElement.clientHeight // 获取浏览器窗口的高度
        const scrollHeight = document.documentElement.scrollHeight // 获取页面高度
        if (scrollTop + clientHeigth + 10 >= scrollHeight) { // 当页面页面滚动出去的 高度 + 获取浏览器窗口的高度 > 页面高度
          // 加载列表下一页的内容
          console.log('触底了')
          this.getList()
        }
      }
    },
    async getList () {
      if (this.loading || this.isLastPage) {
        return
      }
      var data = {
        modelCode: this.modelCode,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        columnCode: this.columnCode
      }
      try {
        this.loading = true
        var res = await this.getArticleList(data)
        this.list = this.list.concat(res.data.list)
        this.load()
        if (this.pageNum == 1 && this.list[0]) {
          if (!(this.list[0].broadcastStatus == 'D' || !this.list[0].broadcastStatus)) {
            // 已开播或者未开播
            this.zbInfo = this.list[0]
            this.list.shift()
          }
        }
        this.loaded = true
        this.isLastPage = res.data.isLastPage
        this.loading = false
        this.pageNum = res.data.nextPage
      } catch (err) {
        console.log(err)
        this.loading = false
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import 'src1/stylentier.less';
.lists {
    padding: 12px 12px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
}
.no-more {
  text-align: center;
  font-size: 12px;
  color: #9b9b9b;
  .none {
    line-height: 50px;
  }
  .nothing {
    width: 70%;
    margin: 20px auto;
  }
}
</style>
