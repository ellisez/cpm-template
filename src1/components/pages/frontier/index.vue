<template>
  <div class="box">

    <div class='search'>
      <div class='input' @click="toSearch">
        输入关键字搜索
      </div>
    </div>
    <list-item v-for="(item,index) in list" :key="index" :value='item' read praise label/>

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
import listItem from '../../lists/list-item'
import { changeTitle } from '../../../utils/func'
import share from '../../../utils/share'
export default {
  components: {
    listItem
  },
  created () {
    this.modelCode = this.$route.query.modelCode || 'AMYXY-HYZX'
    this.getList()
    if (this.modelCode == 'AMYXY-HYZX') {
      changeTitle('行业资讯')
    } else if (this.modelCode == 'AMYXY-WXJD') {
      changeTitle('文献解读')
    }
  },
  mounted () {
    this.hideLoad()
    share({
      title: this.modelCode == 'AMYXY-HYZX' ? '行业资讯' : '文献解读',
      desc: '学术最前沿核心全知道',
      link: `${location.origin}${location.pathname}#/frontier?modelCode=${this.$route.query.modelCode}`,
      imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg'
    })
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '列表页(文献解读/行业资讯)',
        EventID: '1',
        ControlName: '',
        Description: this.modelCode == 'AMYXY-HYZX' ? '行业资讯' : '文献解读'
      })
    } catch (error) {
      console.log(error)
    }
  },
  data () {
    return {
      list: [],
      modelCode: '',
      pageNum: 1,
      pageSize: 10,
      loading: false,
      isLastPage: false,
      loaded: false
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getArticleList: 'content/getArticleList',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    toSearch () {
      try {
        // 埋点
        this.baoSaveReport({
          PageName: '列表页(文献解读/行业资讯)',
          EventID: '2',
          ControlName: '关键字搜索',
          Description: this.modelCode == 'AMYXY-HYZX' ? '行业资讯' : '文献解读'
        })
      } catch (error) {
        console.log(error)
      }
      var data = {
        modelCode: this.$route.query.modelCode || '',
        columnCode: this.$route.query.columnCode || ''
      }
      this.$router.push({
        path: '/searchArticle',
        query: data
      })
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
        pageSize: this.pageSize
      }
      try {
        this.loading = true
        var res = await this.getArticleList(data)
        this.list = this.list.concat(res.data.list)
        this.load()
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
