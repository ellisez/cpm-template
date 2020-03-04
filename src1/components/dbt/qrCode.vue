<template>
  <div class="codeWrap">
    <div class="code">
      <p class="name">{{userInfo.userName}}</p>
      <div class="codeImg" style="width:1.45rem;height:1.45rem;margin:.15rem auto" id="qrCode"></div>
      <p class="textBottom">扫码加入</p>
    </div>
    <div class="explain">
      <div class="explainHeader">邀请说明</div>
      <div class="explainTxt">1、受邀用户必须为医务工作者</div>
      <div class="explainTxt">2、扫码后受邀人成功注册，算1人记入邀请名单</div>
    </div>
    <div class="InvitationBtn" @click="poste">生成邀请海报</div>
  </div>
</template>

<script>
import storage from 'storejs'
import QRCode from 'qrcode2'
import { changeTitle } from '../../utils/func'
import { mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {
      accountInfo: {},
      userInfo: {}
    }
  },
  mounted () {
    this.accountInfo = storage('amyxy')
    this.userInfo = storage('userInfoAMY')
    this.hideLoad()
    this.QCode()
  },
  created () {
    changeTitle('我的二维码')
  },
  methods: {
    ...mapMutations(['hideLoad']),
    poste () {
      this.$router.push({
        path: '/posterDBT',
        query: {
          userName: this.userInfo.userName
        }
      })
    },
    QCode () {
      let qrcode = new QRCode('qrCode', {
        width: 150,
        height: 150, // 高度
        text: `${location.origin}${location.pathname}/#/?inviteUid=${this.userInfo.cid}`
      })
      console.log(
        `${location.origin}${location.pathname}/#/?inviteUid=${this.userInfo.cid}`,
        'eeee'
      )
    }
  }
}
</script>

<style lang="less" scoped>
.codeWrap {
  background: #fff;
  text-align: left;
  height: 100%;
  padding: 0 0.3rem;
  padding-top: 0.4rem;
  .InvitationBtn {
    height: 0.3rem;
    width: 60%;
    line-height: 0.3rem;
    background: linear-gradient(
      131deg,
      rgba(120, 140, 255, 1) 0%,
      rgba(46, 80, 255, 1) 100%
    );
    box-shadow: 0px 1px 4px 0px rgba(124, 149, 254, 0.15);
    border-radius: 0.05rem;
    margin: auto;
    text-align: center;
    color: #fff;
    font-size: 0.14rem;
    margin-top: 0.4rem;
  }
  .explain {
    margin-top: 0.4rem;
    font-size: 0.14rem;
    color: #4a4a4a;
    .explainHeader {
      color: #2e50ff;
      line-height: 0.28rem;
    }
    .explainTxt {
      line-height: 0.2rem;
      font-size: 0.14rem;
      padding: 0.03rem 0;
    }
  }
  .code {
    height: 2.8rem;
    background: rgba(255, 255, 255, 1);
    margin: auto;
    box-shadow: 0px 0px 20px 0px rgba(47, 81, 255, 0.2);
    border-radius: 0.03rem;
    padding: 0.2rem;
    font-size: 0.14rem;
    // padding-top: 0.3rem;
    color: #4a4a4a;
    p {
      line-height: 0.24rem;
    }
    .name {
      text-align: center;
      font-size: 0.16rem;
    }
    .codeImg {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 180px;
    }
    .textBottom {
      text-align: center;
    }
  }
}
</style>
