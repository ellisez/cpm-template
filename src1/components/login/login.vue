<template>
  <div class="box">
    <div class="wrap">
      <img class="logo" src="src1/assets/images/logo.png" alt />
      <!-- <div class="title">欢迎登录</div> -->
      <div class="inputs-wrpa">
        <div class="input username">
          <input type="text" maxlength="11" v-model="mobile" placeholder="请输入手机号" />
        </div>

        <div class="input pwd">
          <input type="text" maxlength="6" v-model="vcode" placeholder="短信验证码" />
          <div class="dcode" @click="getVcode">{{ vcodeText }}</div>
        </div>

        <div class="agree" data-flex="cross:center main:left">
          <p :class="{ checked: checkStatus }" @click="checked"></p>
          <span>
            已阅读并同意
            <span class="light" @click="show">《知情同意书》</span>
          </span>
        </div>
        <button class="btns" @click="loginVcode">登录</button>
      </div>
    </div>
    <Popup v-model="showAgree" position="right">
      <div class="tip-box" @click.stop="popupClick">
        <div class="tips" @click.stop>
          <div class="title">知情同意书</div>
          <div class="info">
            <p>尊敬的 先生/女士：</p>
            <p>
              感谢您对傲美云学院信息化平台的关注。在您浏览傲美云学院信息化平台的内容之前，请仔细阅读并决定是否接受以下内容。
              <br />接受个性化信息
              <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您理解并同意，傲美云学院将通过电子化沟通渠道向您提供心血管相关疾病诊疗信息，包括但不限于会议活动通知、研究进展、医学科学文献、在线课堂等等。基于您提供的不同的个人信息种类，傲美云学院项目组与您之间的电子化沟通渠道可能包含电子邮件、微信账号平台、手机短信息等。
              <br />禁止未经授权的扩散和传播
              <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您理解并同意，您所接收的信息系傲美云学院信息平台经合理许可后提供，并受到傲美云学院信息平台内部保密政策和中华人民共和国或其他相关地区法律的保护，在未得到傲美云学院信息平台明确的书面许可之前，您不得对所接收信息的内容进行复制、仿制或再次传播，您亦不得通过电子媒介或复印件拷贝、截屏、展示、下载、传播、改写、仿制、再版或转发您所接收的任何信息，或者在这些信息的基础上创作它们的派生作品。
              <br />仅供医学药学专业人士参考的特殊规定
              <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本网站所载信息只为医学药学专业人员所提供。您理解并同意，傲美云学院信息平台会做积极的努力提供最新的信息，但对其准确性、时效性和完整性不做任何形式的保证，也不承担任何责任。如果您是医学药学卫生专业人士，那么您进一步理解并同意，您是作为医学药学领域独立的专业人士接受傲美云学院信息化平台提供的所有信息，并将对该等信息做出独立的医学判断；您的处方、推荐、采购和/或其他专业行为和/或决定将不会因傲美云学院向您提供上述信息而受到任何不正当的影响。
              <br />个人信息的收集和使用
              <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个人信息系指任何能够单独或者与其他信息结合识别有关人士身份的信息以及有关人士使用傲美云学院信息化平台的时间、地点等信息，例如使用人姓名、工作单位、电话号码、微信号码、电子邮箱地址，以及登陆信息化平台的时间或地点等。为使您能够登陆和使用傲美云学院信息化平台并向您提供个性化的信息，我们需要您提供您的个人信息。我们将仅为前述目的而收集和使用您的个人信息。
              <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们将为您通过傲美云学院信息化平台提供给我们的个人资料保密，但我们可能将您的资料披露给：
              <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.为傲美云学院提供有关信息化平台运作服务或意见的任何人员、代理、顾问、审计员、承包商或服务人员；
              <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.任何与傲美云学院信息化平台有业务往来的关联机构；
              <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.任何对我们负有保密责任的机构或人员；
              <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.根据中国或其它国家的法律法规，我们必须向其披露您的个人资料的机构或人员。
            </p>
          </div>
          <div class="back" @click.stop="back">同意</div>
        </div>
      </div>
    </Popup>
  </div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import jsrsasign from 'jsrsasign'
import { Popup, Toast } from 'vant'
import { baseUrl } from '../../interfaceUrl'
import storage from 'storejs'
import { changeTitle } from '../../utils/func'
import serviceApi from '../../api/serviceAPI'
export default {
  components: {
    Popup
  },
  data () {
    return {
      checkStatus: false,
      showAgree: false,
      mobile: '',
      disabled: false,
      vcodeText: '获取验证码',
      countdown: 60,
      vcode: ''
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),
    ...mapActions({
      getVcodeAction: 'user/getVcode', // 请求获取二维码
      authorize: 'user/authorize' // 用户验证
    }),
    checked () {
      this.checkStatus = !this.checkStatus
    },
    // 显示知情同意书
    show () {
      setTimeout(() => {
        this.showAgree = true
      }, 500)
    },
    // 隐藏知情同意书  并勾选
    back () {
      this.showAgree = false
      this.checkStatus = true
    },
    popupClick () {
      this.showAgree = false
    },
    // 设置验证码倒计时
    settime () {
      const self = this
      if (self.countdown === 0) {
        this.disabled = false
        this.vcodeText = '获取验证码'
        self.countdown = 60
        return
      }
      this.disabled = true
      this.vcodeText = `${self.countdown}秒后获取`
      self.countdown--

      setTimeout(() => {
        self.settime()
      }, 1000)
    },
    getCode () {
      // 此处操作与后端约定参数
      var key =
        'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCW44OW/ttxULACQkJSp3Rz/wyr5GCrkQ+QJjUWNVXd+dhi0xDaQZszbCyd0gNzEo14bAkFIsClkmQ/rmoUz/oLaS7EZt9CIDF0v35RRVGrC5/gGOL6WJvfbVVCULVMsgbCMO/NYa6baGfDs0aauvZd+NcmyJpFaCOTF1UckexOfQRd8IJoPtn675tE5yB08gXchmNa+GVqvSvekN5UyvhUIMN/I4m/V4SL8Dqfl/6Ynp1RlIrmIoPJPtD8RH51LmABnkrOxiV+PA5c0EvuMGVnrgxI7oq0/csxY9vkIU67ZK7ZwDFNjV/uvwXiYQM6DmFSgruR7Hmu0C3qnPNw7zrhAgMBAAECggEAbtpvjrtmVPXGmaI8P6Uu9RloIdEDBIjqOikXz10X3KD1zITsWKzibQEINlpYlm4G6XXVmqRRjFLku7RT0z6IoWGBLmG1nEsyimc1UlfvDA7aQjWGbA41VgxpGvNYfyQ7uudhBi7BrQMjWK+ZK4w3/AoZZzDxxhQgLqxxpy+9wFsLbAO+JAnKNcj3n4YZ0bCQq8kOvmwtJqS3DM6TJLNbJApH+RKZy80SWy1ZwuVuWWfyLMJhCgNTVySdTFhv9AiU7quw35BvTEWhLwGrsCij2ItgJHmA4zwnPjzNE1szQwLUCaVj9lBGTGvl3+ZAvCWW3VregW2wjrzz+GR5SIPNkQKBgQDqBLZU7060AmFNuiA9fkBhmNSk9FP3Pc4Hg7JDwKg9K185I+/TnO+oJ6XYDYnJHrMuCLBSb/Lg6GKYvIGMCOTOuYlsn5t/53y+43VXB/k4aueuA67TMd2Rfrmf6i3WMJEUbAs3ATs/uTAPXnwxv2+ARQMa/Eki4fWnjRzPedQTuwKBgQClD9YvuluqiP1VmZdjdu0COTismkPQLwIq6ymjASmEL20xRODhKuXGnLyb8xrFgffLIuzzuOE8cJEUEUhAbj28zKPf7qIdJwXZDUHjjmukrRFFBsbYTZxUsfvy22NIZs8kXmL18Jd6Cl+LfzbYOrhMoXL5RP1a3C38hZEPiv8MEwKBgQCKrpw3HVJwzvBHFcRBbO5OaDmsP7b60D+mqF8eU6/gADIANNHNgDVuW4Cm1u8OpwjcgP2s/PbcXhsAFMZY7HRcJgvQuY13cQG2Rimll+4ThxchQsF6GxUJQiZTJH5hboqrpZPH1wz7qI1Yrk+/U4mKZFuAxH27FFl2H+Qw+Cu8PQKBgADLvsCkKWT9HBuZjf1QyXvFQtyyMbmDQINsdtruWoDkqaYfKuZrCoiWoOIvneVt5v/3vyS9s3hTIp/yJWMKJQoQAopF4Eo7se+F/NdYDHTS0M6AZd0NIr/Vy90z6ZqjxEPsoJWG/3P7MNK/XkhUoCbecGt7Ra12elJJYpWsmeY5AoGAQSS3Cd29nyoBMDZNO5oOU2QvJxqLwSmAXOZ3wl5vDOe0gvMYo563lGrm1gvOqjzS6RlD+F1XXHTFn/LIW57f/iEmnP0TbB3M/VK1oe6yhcQFa8T5ghi9kB5/AFGrTgqMtWJ/3Pv14RVngXPLw5EvUdScVgNwT+uax8cEldEfgDI='

      // 创建RSAKey对象
      var rsa = new jsrsasign.RSAKey()
      // 因为后端提供的是pck#8的密钥对，所以这里使用 KEYUTIL.getKey来解析密钥
      var k = `-----BEGIN PRIVATE KEY-----
${key}
-----END PRIVATE KEY-----`
      // 将密钥转码
      rsa = jsrsasign.KEYUTIL.getKey(k)
      // 创建Signature对象，设置签名编码算法PKCS8
      var sig = new jsrsasign.KJUR.crypto.Signature({ alg: 'SHA256withRSA' })
      // 初始化
      sig.init(rsa)
      // 传入待加密字符串
      sig.updateString(this.mobile)
      // 生成密文
      var sign = jsrsasign.hextob64(sig.sign())
      console.log(sign)
      // 对加密后内容进行URI编码
      sign = encodeURIComponent(sign)
      // 把参数与密文拼接好，返回
      var params = sign
      console.log(params)
      return params
    },
    // 获取验证码
    getVcode () {
      var data = this.getCode()
      console.log(data)
      // 参数校验
      if (this.disabled) {
        return
      }
      if (!this.mobile) {
        Toast('请填写手机号')
        return
      } else if (!/^1[3|4|5|7|8|6|9][0-9]{9}$/.test(this.mobile)) {
        Toast('请填写正确手机号')
        return
      }
      console.log('开始获取验证码')
      try {
        var data1 = {
          mobile: this.mobile,
          sign: data + ''
        }
        console.log(data1)
        this.getVcodeAction(data1)
        console.log(1111)
        // 发送成功
        // 开始倒计时
        this.settime()
        Toast('验证码已发送')
      } catch (error) {
        // 发送失败
        Toast(error)
      }
    },

    // 以验证码方式登录
    async loginVcode () {
      if (!this.checkStatus) {
        Toast('请勾选我已同意“知情同意书”')
        return
      }
      // 参数校验
      const mobile = this.mobile
      const vcode = this.vcode
      if (!this.mobile) {
        Toast('请填写手机号')
        return
      } else if (!/^1[3|4|5|7|8|6|9][0-9]{9}$/.test(this.mobile)) {
        Toast('请填写正确手机号')
        return
      }
      if (vcode === '') {
        Toast('请填写短信验证码')
        return
      }

      console.log('以验证的方式登录')

      // this.getType();
      try {
        await this.authorize({ mobile, msgCode: vcode })
        // const representInfo = await serviceApi.checkType({
        //   mobile: this.mobile
        // });
        // if (representInfo.data) {
        //   const myUser = {
        //     userName: representInfo.data.userName,
        //     mobile: representInfo.data.mobile
        //   };
        //   storage.set("userInfoAMY", myUser);
        // storage.set("msgIndex", 0);
        // storage.set("msgNum", 0);
        // storage.set("amyCircle", true);
        // storage.set("msgCircle", true);
        // } else {
        //   storage.set("userInfoAMY", "");
        // }
        // 发送成功
        if (
          storage.get(process.env.VUE_APP_STORAGE_NAME).userType === 'A' &&
          !storage.get('userInfoAMY')
        ) {
          this.$router.replace({
            path: '/setting',
            replace: true
          })
          return
        }
        if (storage.get(`${process.env.VUE_APP_STORAGE_NAME}from`)) {
          this.$router.replace(storage.get(`${process.env.VUE_APP_STORAGE_NAME}from`))
          storage.set(`${process.env.VUE_APP_STORAGE_NAME}from`, '')
        } else {
          this.$router.replace({
            path: '/',
            replace: true
          })
        }
      } catch (error) {
        // 发送失败
        Toast(error)
      }
    },
    async getType () {
      const data = {
        mobile: this.mobile
      }
      try {
        const res = await serviceApi.checkType(data)
        if (res.data) {
          const myUser = {
            userName: res.data.userName,
            mobile: res.data.mobile
          }
          storage.set('userInfoAMY', myUser)
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 兼容vant popup 在ios里可以滚动问题
    stopBodyScroll (isFixed) {
      if (isFixed) {
        document.body.style.position = 'fixed'
        this.top = window.scrollY // 并没有起到作用，但是最好是加上当
        document.body.style.top = -this.top + 'px' // 同上
      } else {
        document.body.style.position = ''
        document.body.style.top = '' // 并没有起到作用，但是最好是加上当
        window.scrollTo(0, this.top) // 同上
      }
    }

    // 解決ios背景被頂起問題
    // viewAll: function(){
    //   console.log('获取焦点');
    //   const that = this;
    //   this.inputTimer = setInterval( () => {
    //       that.$refs.replyInput.scrollIntoView(false);
    //       that.$refs.yanInput.scrollIntoView(false);
    //   },500);
    // },
    // viewDefault: function(){
    //   console.log('失去焦点');
    //     clearInterval(this.inputTimer);
    // }
  },

  watch: {
    // 兼容vant popup 在ios里可以滚动问题
    showAgree: function (newV, oldV) {
      console.log('我被调用')
      console.log(newV)
      this.stopBodyScroll(newV)
    }
  },
  //   async getType() {
  //     const data = {
  //       mobile: this.mobile
  //     };
  //     try {
  //       const res = await serviceApi.checkType(data);
  //       if (res.data) {
  //         const myUser = {
  //           userName: res.data.userName,
  //           mobile: res.data.mobile
  //         };
  //         storage.set("userInfoAMY", myUser);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  computed: {
    ...mapGetters(['user', 'isWechat'])
  },
  mounted () {
    this.hideLoad()
    changeTitle('登录')
  }
}
</script>
<style lang="less" scoped>
@import "src1/stylelogin.less";
.van-popup--right {
  width: 100%;
  height: 100%;
  background-color: transparent;
  position: fixed;
  overflow: hidden;
}
</style>
