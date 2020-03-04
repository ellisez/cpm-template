// 百家讲坛集
<template>
<!-- 搜索 -->
  <div class="box">
    <div class='search'>
      <div class='input' @click="toSearch">
        输入关键字搜索
      </div>
    </div>

    <countdown video v-if="zbInfo.code" :value='zbInfo' />

    <div class="tab" v-show="newList.length > 0">
      <div class="name">超级访谈</div>
      <router-link to='/informationlists?modelCode=AMYXY-BJJTJ&columnCode=AMYXY-BJJTJ-CJFT' class="more">更多</router-link>
    </div>

    <div class="lists">
      <template v-for="(item,index) in newList">
        <videoList v-if="item.broadcastStatus == 'D' || !item.broadcastStatus" :key="index" :value='item'/>
      </template>
    </div>

    <div class="li10"></div>

    <div class="tab" v-show="oldList.length > 0">
      <div class="name">往期精选</div>
      <router-link to='/informationlists?modelCode=AMYXY-BJJTJ&columnCode=AMYXY-BJJTJ-WQHG' class="more">更多</router-link>
    </div>

    <div class="lists">
      <videoList v-for="(item,index) in oldList" :key="index" :value='item'/>
    </div>
    <div class="height70"></div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import countdown from '../../common/countdown'
import videoList from '../../lists/video-list'
import { changeTitle } from '../../../utils/func'
import share from '../../../utils/share'
export default {
  components: {
    countdown, videoList
  },
  created () {
    changeTitle('百家讲坛集')
    this.getNewList()
    this.getOldList()
  },
  mounted () {
    this.hideLoad()
    share({
      title: '百家讲坛集',
      desc: '大咖超访聚焦热点 同台探讨',
      link: `${location.origin}${location.pathname}#/information`,
      imgUrl: 'https://imageysz.yxj.org.cn/1554191431121.jpg'
    })
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '百家讲坛集',
        EventID: '1',
        ControlName: '',
        Description: '百家讲坛集'
      })
    } catch (error) {
      console.log(error)
    }
  },
  data () {
    return {
      zbInfo: {},
      newList: [],
      oldList: []
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
          PageName: '百家讲坛集',
          EventID: '2',
          ControlName: '关键字搜索',
          Description: '关键字搜索-百家讲坛集'
        })
      } catch (error) {
        console.log(error)
      }
      this.$router.push({
        path: '/searchVideo',
        query: {
          modelCode: 'AMYXY-BJJTJ'
        }
      })
    },
    async getNewList () {
      var data = {
        pageNum: 1,
        pageSize: 3,
        modelCode: 'AMYXY-BJJTJ',
        columnCode: 'AMYXY-BJJTJ-CJFT'
      }
      try {
        var res = await this.getArticleList(data)
        this.newList = res.data.list
        if (this.newList.length == 0) {
          return
        }
        if (!res.data.list[0].broadcastStatus || res.data.list[0].broadcastStatus == 'D') {
          // 没有未开始或者已开始的直播
          console.log(23)
          if (this.newList.length == 1) {
            this.newList = [res.data.list[0]]
          } else {
            this.newList = [res.data.list[0], res.data.list[1]]
          }
        } else {
          if (this.newList.length == 1) {
            this.newList = []
            this.zbInfo = res.data.list[0]
          } else if (this.newList.length == 2) {
            this.newList = [res.data.list[1]]
            this.zbInfo = res.data.list[0]
          } else {
            this.newList = [res.data.list[1], res.data.list[2]]
            this.zbInfo = res.data.list[0]
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getOldList () {
      var data = {
        pageNum: 1,
        pageSize: 4,
        modelCode: 'AMYXY-BJJTJ',
        columnCode: 'AMYXY-BJJTJ-WQHG'
      }
      try {
        var res = await this.getArticleList(data)
        this.oldList = res.data.list
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import url('src1/styleormation.less');
</style>
