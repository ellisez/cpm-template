<template>
  <div class="msgWrap">
    <div class="list">
      <Loadmore
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        :bottomPullText="bottomText"
        :auto-fill="false"
        ref="loadmore"
      >
        <div
          class="item"
          :class="{'readed':item.status==1}"
          v-for="(item,index) in list"
          :key="index"
          data-flex="main:left cross:center"
        >
          <div class="left">
            <img src="src1/assets/iconD/header.png">
          </div>
          <div class="right">
            <div class="title" data-flex="main:justify cross:center">
              <div class="name">{{item.name}}</div>
              <div class="time">{{item.createTime}}</div>
            </div>
            <div class="message">
              <p>{{item.message}}</p>
            </div>
          </div>
        </div>
      </Loadmore>
    </div>
    <p class="noContent" style="width:100%;height:100%;" v-if="noContent"></p>
  </div>
</template>
<script>
import storage from 'storejs'
import { mapMutations, mapActions } from 'vuex'
import { Loadmore } from 'mint-ui'
import serviceApi from '../../api/serviceAPI'
import { changeTitle } from '../../utils/func'
export default {
  data () {
    return {
      pageNum: 1,
      pageSize: 10,
      bottomText: '上拉加载更多...',
      allLoaded: false,
      noContent: false,
      list: []
    }
  },
  mounted () {
    this.hideLoad()
    this.getNews()
  },
  methods: {
    ...mapMutations(['hideLoad']),
    // 获取列表
    async getNews () {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        type: '1'
      }
      try {
        const res = await serviceApi.getNews(data)
        res.data.list.forEach(element => {
          this.list.push(element)
        })
        this.allLoaded = res.data.isLastPage
        storage.set('msgNum', Number(res.data.total))
        if (!this.list || this.list.length <= 0) {
          this.noContent = true
        }
      } catch (error) {
        this.noContent = true
        console.log(error)
      }
    },
    // 修改信息状态
    async messageModify () {
      const data = { type: 1 }
      try {
        const res = await serviceApi.messageModify(data)
        cosnole.log(res)
      } catch (error) {
        console.log(error)
      }
    },
    // 加载更多
    loadBottom () {
      if (!this.allLoaded) {
        this.pageNum = this.pageNum + 1
        this.getNews()
      }
    }
  },
  created () {
    changeTitle('消息通知')
  },
  beforeDestroy () {
    this.messageModify()
  },
  components: {
    Loadmore
  }
}
</script>

<style lang="less" scoped>
.msgWrap {
  background: #fff;
}
.list {
  // padding: 0 0.26rem;
  text-align: left;
  overflow: scroll;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  .item {
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    border-bottom: 1px solid #f2f2f2;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    .left {
      width: 15%;
      img {
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 50%;
      }
    }
    .right {
      width: 85%;
      .title {
        .name {
          font-size: 0.14rem;
          color: #000;
          line-height: 0.2rem;
          margin-bottom: 0.03rem;
        }
        .time {
          font-size: 0.12rem;
          color: #4a4a4a;
        }
      }
      .message {
        p {
          font-size: 0.12rem;
          color: #4a4a4a;
          line-height: 0.2rem;
        }
      }
    }
  }

  .readed {
    color: rgba(155, 155, 155, 1);
    .right {
      width: 85%;
      .title {
        .name {
          font-size: 0.14rem;
          color: rgba(155, 155, 155, 1);
          line-height: 0.2rem;
          margin-bottom: 0.03rem;
        }
        .time {
          font-size: 0.12rem;
          color: rgba(155, 155, 155, 1);
        }
      }
      .message {
        p {
          font-size: 0.12rem;
          color: rgba(155, 155, 155, 1);
          line-height: 0.2rem;
        }
      }
    }
  }
}

.noContent {
  position: fixed;
  left: 0;
  top: 0;
  background: url("src1/assets/imagesD/position.d53faac.png") no-repeat center;
  background-size: 1.5rem auto;
}
</style>
