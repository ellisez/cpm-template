<template>
  <div class="detailWrap">
    <div class="topWrap">
      <div class="attention" data-flex="main:justify cross:center">
        <div class="left">
          <div class="userName">
            <img src="http://studioimage.yxj.org.cn/1542016171629.png">
            <span>姓名：{{data.userName}}</span>
          </div>
        </div>
        <div class="right">
          <el-button
            class="myBtn"
            v-if="showCancel"
            type="primary"
            size="small"
            @click="inviteCancel"
            round
          >取消关联</el-button>
        </div>
      </div>
      <div class="docInfo">
        <div class="hospital" data-flex="main:justify cross:center">
          <p class="left">医院：{{data.hospitalName}}</p>
          <p class="right" v-if="data.sex == 1">性别：男</p>
          <p class="right" v-else-if="data.sex == 2">性别：女</p>
          <p class="right" v-else>性别：保密</p>
        </div>
        <div class="department" data-flex="main:justify cross:center">
          <p class="left">科室：{{data.departmentName}}</p>
          <!-- <p class="right">医院级别：三级甲等</p> -->
        </div>
      </div>
    </div>
    <div class="list">
      <div class="comTitle">互动事件</div>
      <div class="picture">
        <div class="tit">
          <img src="src1/assets/iconD/picture.png">
          <span>图文</span>
        </div>
        <div class="commonList">
          <div
            class="commonItem"
            v-for="(item,index) of article"
            :key="index"
            data-flex="main:justify cross:center"
            @click="articleDetail(item)"
          >
            <div class="commonL">
              <div class="contentTitle">{{item.title}}</div>
              <div class="time" data-flex="main:left cross:center">
                <span>{{item.createTime}}</span>
                <span class="label" v-if="item.labelName">{{item.labelName.split(',')[0]}}</span>
                <!--v-if="item.labelName"-->
              </div>
              <div class="status">
                <span>互动状态：</span>
                <span>推送成功</span>
                <span v-text="item.isRead!='0'?'已阅读':'未阅读'"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="nomore" v-if="article.length<=0">暂无相关信息</div>
      </div>
      <div class="video">
        <div class="tit">
          <img src="src1/assets/iconD/video.png">
          <span>音视频</span>
        </div>
        <div class="commonList">
          <div
            class="commonItem"
            v-for="(item,index) of video"
            :key="index"
            data-flex="main:justify cross:center"
            @click="videoDetail(item)"
          >
            <div class="commonL">
              <div class="contentTitle">{{item.title}}</div>
              <div class="time" data-flex="main:left cross:center">
                <span>{{item.createTime}}</span>
                <span class="label" v-if="item.labelName">{{item.labelName.split(',')[0]}}</span>
                <!--v-if="item.labelName"-->
              </div>
              <div class="status">
                <span>互动状态：</span>
                <span>推送成功</span>
                <span v-text="item.isRead!='0'?'已阅读':'未阅读'"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="nomore" v-if="video.length<=0">暂无相关信息</div>
      </div>
      <div class="meeting">
        <div class="tit">
          <img src="src1/assets/iconD/meeting.png">
          <span>会议</span>
        </div>
        <div class="commonList">
          <div
            class="commonItem"
            v-for="(item,index) of meeting"
            :key="index"
            data-flex="main:justify cross:center"
            @click="meetingDetail(item)"
          >
            <div class="commonL">
              <div class="contentTitle">{{item.title}}</div>
              <div class="time" data-flex="main:left cross:center">
                <span>{{item.createTime}}</span>
                <span class="label" v-if="item.labelName">{{item.labelName.split(',')[0]}}</span>
                <!--v-if="item.labelName"-->
              </div>
              <div class="status">
                <span>互动状态：</span>
                <span>推送成功</span>
                <span v-text="item.isRead!='0'?'已阅读':'未阅读'"></span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="meeting.length<=0" class="nomore">暂无相关信息</div>
      </div>
    </div>
    <!-- <share v-if="isShare" @close="closeShare" @select="select"></share> -->
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { MessageBox } from 'mint-ui'
import F2 from '@antv/f2'
import serviceApi from '../../api/serviceAPI'
import { Toast } from 'vant'
import { changeTitle } from '../../utils/func'
// import share from "./select/share";
export default {
  data () {
    return {
      isAttention: false,
      userId: '',
      // hobbyList: [],
      data: {},
      article: [],
      video: [],
      meeting: [],
      isShare: false,
      shareType: '',
      shareItem: {},
      showCancel: ''
    }
  },
  mounted () {
    this.showCancel = this.$route.query.isBind == 1
    this.hideLoad()
    this.doctorDetail()
  },

  methods: {
    ...mapMutations(['hideLoad']),
    // 获取医生信息
    async doctorDetail () {
      const data = {
        doctorId: this.userId
      }
      try {
        const res = await serviceApi.doctorDetail(data)
        this.data = res.data.info
        res.data.pushList.forEach(ele => {
          if (ele.type == 1) {
            this.article.push(ele)
          }
          if (ele.type == 2) {
            this.meeting.push(ele)
          }
          if (ele.type == 3 || ele.type == 7) {
            this.video.push(ele)
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    // 文章详情
    articleDetail (item) {
      this.$router.push({
        path: '/articleDetail',
        query: {
          code: item.code || item.toCode
        }
      })
    },

    // 会议详情
    meetingDetail (item) {
      this.$router.push({
        path: '/meetingDetail',
        query: {
          code: item.code || item.toCode
        }
      })
    },

    // 视频详情
    videoDetail (item) {
      console.log(item)
      if (item.type == 3) {
        this.$router.push({
          path: '/videoDetail',
          query: {
            code: item.code || item.toCode
          }
        })
      } else {
        this.$router.push({
          path: '/answerDetail',
          query: {
            code: item.code || item.toCode
          }
        })
      }
    },

    // 取消关联
    inviteCancel () {
      MessageBox.confirm(
        '是否确认取消关联?取消关联后，该医生的阅读数据将被删除?'
      ).then(action => {
        // console.log(action);
        if (action === 'confirm') {
          this.cancelSure()
        } else {
          return
          console.log(action)
        }
      })
    },

    // 确认取消绑定
    async cancelSure () {
      const data = {
        beInviteUid: this.data.userId
      }
      try {
        const res = await serviceApi.inviteCancel(data)
        this.showCancel = false
        Toast('取消成功')
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },

    closeShare () {
      this.isShare = false
    },

    select (type) {
      this.shareType = type
      this.$router.push({
        path: '/send',
        query: {
          code: this.shareItem.code,
          fieldName: this.shareItem.fieldName,
          shareEncryptKey: this.shareItem.shareEncryptKey,
          title: this.shareItem.title,
          type: this.shareItem.type,
          toCode: this.shareItem.sourceUrl.split('?')[1].split('=')[1],
          channel: this.shareType
        }
      })
    },

    // 去发送
    send (item) {
      this.shareItem = item
      this.isShare = true
    }
  },
  created () {
    changeTitle('代表与医生互动详情')
    this.userId = this.$route.query.userId
  },
  components: {}
}
</script>

<style lang="less" scoped>
.detailWrap {
  background: #fff;
}
.topWrap {
  height: 1.6rem;
  background: url("src1/assets/imagesD/bg_top.png") no-repeat center center;
  background-size: 100% 100%;
  color: #fff;
  padding: 0 0.16rem;
  text-align: left;

  .attention {
    // height: 0.5rem;
    padding: 0.1rem 0;
    padding-top: 0.2rem;
    margin-bottom: 0.1rem;
    .userName {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      img {
        display: block;
        width: 0.3rem;
        height: 0.3rem;
        float: left;
        margin-right: 0.1rem;
        border-radius: 50%;
      }
      span {
        font-size: 0.16rem;
      }
    }
  }
  .docInfo {
    .hospital {
      font-size: 0.14rem;
      margin-bottom: 0.06rem;
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .left {
        width: 55%;
      }
      .right {
        width: 40%;
      }
    }
    .department {
      font-size: 0.14rem;
      margin-bottom: 0.06rem;
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .left {
        width: 55%;
      }
      .right {
        width: 40%;
      }
    }
  }
}

.hobby,
.list {
  text-align: left;
  padding: 0 0.26rem;
}
.hobby {
  text-align: left;
  .btnBox {
    // padding: 0 0.37rem;
    padding: 0.2rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .btnItem {
      width: 0.87rem;
      height: 0.35rem;
      line-height: 0.35rem;
      text-align: center;
      font-size: 0.14rem;
      color: #4a4a4a;
      box-shadow: 0px 0px 15px 0px rgba(54, 93, 255, 0.2);
      border-radius: 0.04rem;
      margin-bottom: 0.1rem;
    }
  }
}
.list {
  .commonList {
    .commonItem {
      width: 100%;
      border-bottom: 1px solid rgba(153, 153, 153, 0.1);
      overflow: hidden;
      font-size: 0.14rem;
      padding-bottom: 0.15rem;
      .commonL {
        .contentTitle {
          color: #333;
          line-height: 0.2rem;
          margin-top: 0.13rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .time {
          width: 100%;
          font-size: 10px;
          color: #9b9b9b;
          margin-top: 0.09rem;
          margin-bottom: 0.09rem;
          position: relative;
        }
        .label {
          margin-left: 0.2rem;
          text-align: center;
          font-size: 0.1rem;
          padding: 0 0.06rem;
          line-height: 0.22rem;
          height: 0.22rem;
          color: #9b9b9b;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 0.11rem;
        }
        .status {
          span {
            margin-right: 0.1rem;
            color: #9b9b9b;
          }
        }
      }
      .commonR {
        width: 0.2rem;
        height: 0.2rem;
      }
    }
  }
  padding: 0 0.27rem;
  padding-bottom: 0.3rem;
  .picture,
  .video,
  .meeting {
    overflow: hidden;
    margin-bottom: 0.26rem;
  }
  .title {
    padding: 0.2rem 0 0.15rem 0;
    font-size: 0.18rem;
    font-weight: 700;
  }
  .tit {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #666;
    padding: 0.06rem 0;
    font-size: 0.16rem;
    line-height: 0.27rem;
    vertical-align: middle;
    border-bottom: 1px solid rgba(153, 153, 153, 0.2);
    img {
      margin-right: 0.1rem;
      display: block;
      width: 0.24rem;
      height: 0.19rem;
    }
  }
}
.comTitle {
  padding: 0.2rem 0;
  font-size: 0.18rem;
  font-weight: 700;
  padding-bottom: 0.1rem;
}
.w26 {
  padding: 0.2rem 0.26rem;
}
/deep/ .el-button.is-round {
  background: #777fff;
  border-color: #777fff;
  color: #fff;
}
/deep/ .el-checkbox__inner {
  width: 24px;
  height: 24px;
}
/deep/ .el-checkbox__inner::after {
  top: 4px;
  left: 8px;
  height: 10px;
  width: 5px;
  border-color: #5f68f1;
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #fff;
  border-color: #fff;
}
.myBtn {
  background: #ccc !important;
  color: #fff !important;
}
.nomore {
  text-align: center;
  line-height: 0.8rem;
  color: #9b9b9b;
}
</style>
