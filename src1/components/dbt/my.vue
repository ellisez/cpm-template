<template>
  <div class="myWrap">
    <div class="userBox">
      <div class="nameHead" data-flex="main:right cross:top"></div>
    </div>
    <div class="msgBox">
      <div class="itemBox" data-flex="main:justify cross:center">
        <div class="img">
          <img src="src1/assets/iconD/header.png" />
        </div>
        <div class="info">
          <p class="name">{{userInfo.userName}}</p>
          <p>{{userInfo.regional}} - {{userInfo.cityName}}</p>
        </div>
        <div class="btn" @click="show">
          <span>负责医院</span>
        </div>
      </div>
    </div>

    <div class="listBox">
      <div class="item" @click="newMsg" data-flex="main:left cross:center">
        <div>
          <img src="src1/assets/iconD/message.png" />
        </div>
        <p>
          消息通知
          <span v-if="showCircle" class="red"></span>
        </p>
      </div>
      <div @click="qrCode" class="item" data-flex="main:left cross:center">
        <div>
          <img src="src1/assets/iconD/qrcode.png" />
        </div>
        <p>我的二维码</p>
      </div>
      <div @click="myCustomer" class="item" data-flex="main:left cross:center">
        <div>
          <img src="src1/assets/iconD/my_customer.png" />
        </div>
        <p>我的客户</p>
      </div>
      <div
        v-if="userInfo.isRdm === '1'"
        @click="meetingApplay"
        class="item"
        data-flex="main:left cross:center"
      >
        <div>
          <img src="src1/assets/iconD/my_meeting.png" />
        </div>
        <p>青年演说家申请</p>
      </div>
      <!-- <div class="item" @click="newMission" data-flex="main:left cross:center">
        <div>
          <img src="../../assets/iconD/my_task.png">
        </div>
        <p>任务通知</p>
      </div>-->
      <!-- <div class="item" data-flex="main:left cross:center">
        <div>
          <img src="../../assets/iconD/my_feedback.png">
        </div>
        <p>帮助与反馈</p>
      </div>-->
      <div class="item" @click="helpList" data-flex="main:left cross:center">
        <div>
          <img src="src1/assets/iconD/my_help.png" />
        </div>
        <p>帮助文档</p>
      </div>
      <!-- <div class="item" data-flex="main:left cross:center">
        <div>
          <img src="../../assets/iconD/my_zsk.png">
        </div>
        <p>知识库</p>
      </div>-->
    </div>
    <hospitalList :list="myList" @close="close" v-if="showBox"></hospitalList>
  </div>
</template>

<script>
import storage from 'storejs'
import { changeTitle } from '../../utils/func'
import serviceApi from '../../api/serviceAPI'
import hospitalList from './select/myHospital'
import { mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {
      userInfo: {},
      showBox: false,
      myList: [],
      showCircle: storage('msgCircle')
    }
  },
  created () {
    changeTitle('个人中心')
    this.hideLoad()
  },
  mounted () {
    this.getNews()
    this.getInfo()
    this.searchHospital()
  },
  methods: {
    ...mapActions({
      getUserInfo: 'user/getUserInfo'
    }),
    ...mapMutations(['hideLoad']),

    // 获取个人信息
    async getInfo () {
      const data = {
        mobile: storage('userInfoAMY').mobile
      }
      try {
        const res = await serviceApi.checkType(data)
        this.userInfo = res.data
        const oldUser = storage('userInfoAMY')
        oldUser.userName = res.data.userName
        oldUser.mobile = res.data.mobile
        storage.set('userInfoAMY', oldUser)
      } catch (error) {
        console.log(error)
      }
    },

    // 获取列表
    async getNews () {
      const data = {
        pageNum: 1,
        pageSize: 10,
        type: '1'
      }
      try {
        const res = await serviceApi.getNews(data)
        if (storage('msgNum') < Number(res.data.total)) {
          storage.set('msgCircle', true)
        } else {
          storage.set('msgCircle', false)
        }
        this.showCircle = storage('msgCircle')
      } catch (error) {
        console.log(error)
      }
    },

    // 获取 负责医院列表
    async searchHospital () {
      const data = {
        title: '',
        provinceName: '',
        cityName: ''
      }
      console.log(data)
      try {
        const res = await serviceApi.searchHospital(data)
        this.myList = res.data.list
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },

    // 弹出框
    show () {
      if (this.myList.length < 1) {
        return
      }
      this.showBox = true
    },

    meetingApplay () {
      this.$router.push('/meetingApplayDBT')
    },
    myCustomer () {
      this.$router.push('/myCustomerDBT')
    },
    newMsg () {
      this.$router.push('/newMsgDBT')
      storage.set('msgCircle', false)
    },
    qrCode () {
      this.$router.push('/qrCodeDBT')
    },
    close () {
      this.showBox = false
    },
    helpList () {
      this.$router.push('/helpListDBT')
    }
  },
  components: {
    hospitalList
  }
}
</script>
<style lang="less" scoped>
.myWrap {
  text-align: left;
  background: #fff;
  .msgBox {
    padding: 0 0.12rem;
    margin-top: -0.8rem;
    .itemBox {
      padding: 0.25rem;
      width: 100%;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0px 0px 20px 0px rgba(125, 149, 255, 0.3);
      .img {
        width: 20%;
      }
      .info {
        width: 60%;
        margin-left: 0.2rem;
        p {
          font-size: 0.14rem;
          color: rgba(74, 74, 74, 1);
          line-height: 0.22rem;
        }
        .name {
          font-size: 0.16rem;
          color: rgba(74, 74, 74, 1);
          line-height: 0.24rem;
          font-weight: 500;
        }
      }
      .btn {
        width: 20%;
        span {
          display: block;
          width: 0.75rem;
          height: 0.3rem;
          border-radius: 0.06rem;
          border: 1px solid rgba(71, 49, 221, 1);
          line-height: 0.3rem;
          text-align: center;
          font-size: 0.14rem;
          color: rgba(71, 49, 221, 1);
        }
      }
    }
  }
  .listBox {
    padding-top: 0.2rem;
    .item {
      height: 0.58rem;
      line-height: 0.66rem;
      overflow: hidden;
      background: url("src1/assets/iconD/my_more.png") no-repeat 95% center;
      background-size: 0.06rem 0.1rem;
      font-size: 0.12rem;
      color: rgba(74, 74, 74, 1);
      padding: 0.22rem 0.18rem;
      div {
        width: 0.24rem;
        height: 0.24rem;
        margin-right: 0.22rem;
      }
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
  .middel {
    padding: 0.3rem 0.54rem 0.2rem;
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 0.22rem;
        height: 0.22rem;
      }
      span {
        margin-left: 0.12rem;
        font-size: 0.1rem;
        line-height: 0.14rem;
        color: rgba(74, 74, 74, 1);
      }
    }
    .left {
      width: 50%;
    }
    .right {
      width: 50%;
    }
  }
  .userBox {
    height: 1.28rem;
    background: url("src1/assets/imagesD/my_top.png") no-repeat center center;
    background-size: 100% 100%;
    color: #fff;
    overflow: hidden;
    div {
      padding-top: 0.1rem;
      padding-right: 0.1rem;
    }
    img {
      width: 0.25rem;
      height: 0.25rem;
    }
  }
  .nameHead {
    font-size: 16px;
    margin-bottom: 0.2rem;
    div {
      display: block;
      margin-right: 17px;
      border-radius: 50%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        display: block;
        margin-right: 0.1rem;
      }
      em {
        font-style: normal;
        display: block;
      }
    }
    span {
      width: 75px;
      height: 40px;
      float: right;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 1);
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 40px;
      text-align: center;
    }
  }
  .red {
    position: absolute;
    width: 0.06rem;
    height: 0.06rem;
    line-height: 0.2rem;
    background: red;
    border-radius: 50%;
    color: #fff;
    right: -25%;
    top: 0;
    bottom: 0;
    margin: auto 0;
    text-align: center;
  }
}
</style>
