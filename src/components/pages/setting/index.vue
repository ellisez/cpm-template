<template>
  <div class="box">
    <div class="item">
      <div class="title">
        <span class="star">＊</span>姓名
      </div>
      <div class="input">
        <input type="text" v-model="user.userName" placeholder="请输入姓名">
      </div>
    </div>

    <div class="item" @click="setHospital">
      <div class="title">
        <span class="star">＊</span>医院
      </div>
      <div class="input check">
        <div>{{ user.hospitalName || '请选择医院' }}</div>
      </div>
    </div>

    <div class="item" @click="setDepartment">
      <div class="title">
        <span class="star">＊</span>科室
      </div>
      <div class="input check">
        <div>{{ user.departmentName || '请选择科室' }}</div>
      </div>
    </div>

    <div class="item" @click="setPosition">
      <div class="title">
        <span class="star">＊</span>职称
      </div>
      <div class="input check">
        <div>{{ user.positionName || '请选择职称' }}</div>
      </div>
    </div>

    <div class="item">
      <div class="title">
        <span class="star hide">＊</span>邮箱
      </div>
      <div class="input">
        <input type="text" v-model="user.email" placeholder="请输入邮箱">
      </div>
    </div>

    <div class="item" @click="toRenzheng">
      <div class="title">
        <span class="star hide">＊</span>实名认证
        <span
          class="score"
        >{{ user.realnameAuthStatus == 'A'?'（认证可获得30积分）':user.realnameAuthStatus == 'C'?'（已获得30积分）':'' }}</span>
      </div>
      <div class="input" v-if="Object.keys(user).length > 0">
        <div
          class="status"
          :class="{
          'un-auth':user.realnameAuthStatus == 'A' ||user.realnameAuthStatus == 'E',
          'authed':user.realnameAuthStatus == 'C',
          'auth-failed':user.realnameAuthStatus == 'D',
          'authing':user.realnameAuthStatus == 'B',
           }"
        >{{ user.realnameAuthStatus == "A" || user.realnameAuthStatus == ""?'未认证':user.realnameAuthStatus == "B"?'审核中':user.realnameAuthStatus == "C"?'已认证':user.realnameAuthStatus == "D"?'已驳回':user.realnameAuthStatus == "E"?'待提交': ''}}</div>
      </div>
    </div>

    <div class="btn" @click="submit">完成</div>

    <!-- 省选择器 -->
    <Popup v-model="showHos" position="right">
      <div class="popup-info">
        <div data-v-a8e9405e class="search-wp">
          <input data-v-a8e9405e v-model="searchTxt" type="text" placeholder="搜索关键字" class="search">
          <div class="search-btn" @click="hosSearch">搜索</div>
        </div>

        <div data-v-a8e9405e class="provinces">
          <div
            data-v-a8e9405e
            data-flex="main:justify cross:center"
            class="lists"
            v-for="(item,index) in hosList"
            :key="index"
            @click="hosSelect(item)"
          >
            <div data-v-a8e9405e class="left">{{ item.name }}</div>
            <div data-v-a8e9405e class="right">
              <i data-v-a8e9405e class="icon icon-link"></i>
            </div>
          </div>
        </div>
      </div>
    </Popup>

    <!-- 市选择器 -->
    <Popup v-model="showCity" position="right">
      <div class="popup-info">
        <div data-v-a8e9405e class="search-wp">
          <input data-v-a8e9405e v-model="searchTxt" type="text" placeholder="搜索关键字" class="search">
          <div class="search-btn" @click="hosSearch">搜索</div>
        </div>

        <div data-v-a8e9405e class="provinces">
          <div
            data-v-a8e9405e
            data-flex="main:justify cross:center"
            class="lists"
            v-for="(item,index) in cityList"
            :key="index"
            @click="hosSelect(item)"
          >
            <div data-v-a8e9405e class="left">{{ item.name }}</div>
            <div data-v-a8e9405e class="right">
              <i data-v-a8e9405e class="icon icon-link"></i>
            </div>
          </div>
        </div>
      </div>
    </Popup>

    <!-- 区选择器 -->
    <Popup v-model="showDotty" position="right">
      <div class="popup-info">
        <div data-v-a8e9405e class="search-wp">
          <input data-v-a8e9405e v-model="searchTxt" type="text" placeholder="搜索关键字" class="search">
          <div class="search-btn" @click="hosSearch">搜索</div>
        </div>

        <div data-v-a8e9405e class="provinces">
          <div
            data-v-a8e9405e
            data-flex="main:justify cross:center"
            class="lists"
            v-for="(item,index) in dottyList"
            :key="index"
            @click="hosSelect(item)"
          >
            <div data-v-a8e9405e class="left">{{ item.name }}</div>
            <div data-v-a8e9405e class="right">
              <i data-v-a8e9405e class="icon icon-link"></i>
            </div>
          </div>
        </div>
      </div>
    </Popup>

    <!-- 医院选择器 -->
    <Popup v-model="showHosList" position="right">
      <div class="popup-info">
        <div data-v-a8e9405e class="search-wp">
          <input data-v-a8e9405e v-model="searchTxt" type="text" placeholder="搜索关键字" class="search">
          <div class="search-btn" @click="hosSearch">搜索</div>
        </div>

        <div data-v-a8e9405e class="provinces">
          <div data-v-a8e9405e data-flex="main:justify cross:center" class="lists" @click="hosEdit">
            <div data-v-a8e9405e class="left">其他(手动输入)</div>
            <div data-v-a8e9405e class="right">
              <i data-v-a8e9405e class="icon icon-link"></i>
            </div>
          </div>

          <div
            data-v-a8e9405e
            data-flex="main:justify cross:center"
            class="lists"
            v-for="(item,index) in hospitalList"
            :key="index"
            @click="hosSelect(item)"
          >
            <div data-v-a8e9405e class="left">{{ item.name }}</div>
            <div data-v-a8e9405e class="right">
              <i data-v-a8e9405e class="icon icon-link"></i>
            </div>
          </div>
        </div>
      </div>
    </Popup>

    <!-- 医院手动输入 -->
    <Popup v-model="showEdit" position="right">
      <div class="popup-info">
        <div class="search-wp edit">
          <input v-model="editTxt" type="text" placeholder="请输入医院名称" class="search">
        </div>
        <div class="sure" @click="sure">确定</div>
      </div>
    </Popup>

    <!-- 科室，职称选择器 -->
    <popup v-model="showpicker" position="bottom">
      <Picker
        :columns="pickerData"
        :value-key="valueKey"
        show-toolbar
        @confirm="comfirmSelect"
        @cancel="cancel"
      />
    </popup>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import storage from 'storejs'
import { Toast, Popup, Picker, Dialog } from 'vant'
import { changeTitle } from '../../../utils/func'
export default {
  components: {
    Popup,
    Picker
  },
  mounted () {
    this.hideLoad()
  },
  created () {
    this.getInfo()
    this.loadAreaList()
    this.getHosList()
    try {
      // 埋点
      this.baoSaveReport({
        PageName: '完善个人信息',
        EventID: '1',
        ControlName: '',
        Description: ''
      })
    } catch (error) {
      console.log(error)
    }
  },
  activated () {
    console.log('activated')
    console.log(this.user.realnameAuthStatus)
    changeTitle('完善个人信息')
    // debugger;

    this.getUserInfo().then(res => {
      console.log(res, 'rwwwwes')
      this.user.realnameAuthStatus = res.data.realnameAuthStatus
      if (storage.get('amy')) {
        console.log('有Amy')
        var amy = storage.get('amy')
        console.log(this.user.realnameAuthStatus)
        if (amy.upImgOver) {
          console.log(123123)
          this.user.healthCarePersonalUrl = amy.healthCarePersonalUrl
          this.user.badgePhotoUrl = amy.badgePhotoUrl
          this.user.healthCarePhotoUrl = amy.healthCarePhotoUrl
          this.user.idCardUrl = amy.idCardUrl
          this.user.realnameAuthStatus = 'E'
        } else {
          this.user
        }
      }
    })

    // this.user.realnameAuthStatus = "B";
  },
  data () {
    return {
      user: {},
      type: '',
      hosIndex: 0,
      showHos: false,
      showCity: false,
      showDotty: false,
      showHosList: false,
      showEdit: false,
      showpicker: false,
      pickerData: [],
      searchTxt: '',
      editTxt: '',
      valueKey: '',
      userName: '',
      mData: [],
      hosList: [],
      cityList: [],
      dottyList: [],
      hospitalList: []
    }
  },
  methods: {
    ...mapMutations(['hideLoad']),

    ...mapActions({
      getCitys: 'setting/getCitys', // 获取城市
      getUserInfo: 'user/getUserInfo', // 获取用户信息
      saveUserBaseInfo: 'user/saveUserBaseInfo', // 保存用户信息
      getHospitalList: 'content/getHospitalList',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    // userNameInput(){
    //   if(this.user.realnameAuthStatus == 'C') {
    //     Toast('已认证不可修改姓名！')
    //   }
    // },
    cancel () {
      this.showpicker = false
    },
    // 去认证
    toRenzheng () {
      if (
        this.user.realnameAuthStatus == 'B' ||
        this.user.realnameAuthStatus == 'C'
      ) {
        return
      }
      console.log(123)
      this.$router.push({
        path: '/upauthimg',
        query: {
          from: 'self'
        }
      })
    },
    // 确认输入医院
    sure () {
      this.user.hospitalName = this.editTxt
      this.showHos = false
      this.showCity = false
      this.showDotty = false
      this.showHosList = false
      this.showEdit = false
    },
    // 显示医院输入
    hosEdit () {
      this.showEdit = true
    },
    // 医院关键字搜索
    async hosSearch () {
      if (!this.searchTxt) {
        Toast('请输入搜索关键字')
        return
      }
      var data = {
        name: this.searchTxt,
        id: 0
      }
      try {
        var res = await this.getHospitalList(data)
        this.hospitalList = res.data
        this.showHosList = true
      } catch (error) {
        console.log(error)
      }
    },
    // 医院层级选择
    async hosSelect (item) {
      console.log('123456', item)
      if (item.level == 4) {
        this.user.hospitalName = item.name
        this.showHos = false
        this.showCity = false
        this.showDotty = false
        this.showHosList = false
      } else {
        var data = {
          name: '',
          id: item.id
        }

        var res = await this.getHospitalList(data)
        console.log(res)
        if (item.level == 1) {
          this.cityList = res.data
          this.user.province = item.name
          this.showCity = true
        } else if (item.level == 2) {
          this.dottyList = res.data
          this.user.cityName = item.name
          this.user.cityCode = item.id
          this.showDotty = true
        } else if (item.level == 3) {
          this.hospitalList = res.data
          this.user.countyName = item.name
          this.showHosList = true
        }
      }
    },
    // 获取省列表
    async getHosList () {
      var data = {}
      try {
        var res = await this.getHospitalList(data)
        console.log(res)
        this.hosList = res.data
      } catch (error) {
        console.log(error)
      }
    },
    // 获取科室   职称列表
    async loadAreaList () {
      const self = this
      try {
        const citys = await this.getCitys()
        console.log('城市信息', citys)
        self.mData = citys.data
        console.log(self.mData)
      } catch (error) {
        Toast(error || error.message)
      }
    },
    // 医院选择
    setHospital () {
      this.showHos = true
    },
    // 科室选择
    setDepartment () {
      this.valueKey = 'departmentName'
      this.pickerData = this.mData.department
      this.showpicker = true
    },
    // 科室选择
    setPosition () {
      this.valueKey = 'positionName'
      this.pickerData = this.mData.position
      this.showpicker = true
    },
    comfirmSelect (e) {
      console.log(e)
      if (this.valueKey == 'departmentName') {
        this.user.departmentName = e.departmentName
        this.user.departmentCode = e.departmentCode
      } else {
        this.user.positionCode = e.positionCode
        this.user.positionName = e.positionName
      }
      this.showpicker = false
    },
    // 获取用户信息
    async getInfo () {
      console.log(789789)
      try {
        const myStorage = storage.get(process.env.VUE_APP_STORAGE_NAME)
        const userInfo = await this.getUserInfo()
        console.log(userInfo)
        this.user = userInfo.data
        if (this.user.realnameAuthStatus == 'C') {
          this.userName = this.user.userName
        }
        if (storage.get('amy')) {
          var amy = storage.get('amy')
          if (amy.upImgOver) {
            this.user.healthCarePersonalUrl = amy.healthCarePersonalUrl
            this.user.badgePhotoUrl = amy.badgePhotoUrl
            this.user.healthCarePhotoUrl = amy.healthCarePhotoUrl
            this.user.idCardUrl = amy.idCardUrl
            this.user.realnameAuthStatus = 'E'
          }
        }
        this.type = userInfo.data.userType
        myStorage.userType = this.type
        myStorage.User = this.user
        myStorage.User.getInfoFirst = true
        storage.set(process.env.VUE_APP_STORAGE_NAME, myStorage) // 获取用户数据并更新缓存中的用户类型
      } catch (error) {
        console.log(error)
      }
    },
    // 保存用户信息
    async saveUser (data) {
      try {
        await this.saveUserBaseInfo(data)
        if (data.realnameAuthStatus == 'E') {
          var amy = storage.get(process.env.VUE_APP_STORAGE_NAME)
          amy.realnameAuthStatus = 'B'
          storage.set(process.env.VUE_APP_STORAGE_NAME, amy)
        }
        Toast('设置成功！')
        var amy = storage.get('amy')
        storage.remove('upImgOver') // 删除状态
        storage.remove('amy')
        if (this.$route.query.from) {
          // 判断来源是否为个人页
          this.$router.back()
        } else if (storage.get(`${process.env.VUE_APP_STORAGE_NAME}from`)) {
          this.$router.push(storage.get(`${process.env.VUE_APP_STORAGE_NAME}from`))
          storage.set(`${process.env.VUE_APP_STORAGE_NAME}from`, '')
        } else {
          this.$router.push({
            path: '/'
          })
        }
      } catch (error) {
        Toast(error || error.message)
      }
    },
    submit () {
      const {
        userName,
        nickName,
        departmentName,
        hospitalName,
        dutiesName,
        positionName,
        email,
        cityName,
        province,
        countyName,
        healthCarePhotoUrl,
        healthCarePersonalUrl,
        badgePhotoUrl,
        idCardUrl
      } = this.user

      if (nickName.length > 10) {
        Toast('昵称长度不超过10个字符')
        return
      }
      if (!userName) {
        Toast('请输入姓名')
        return
      }
      if (userName.length > 10) {
        Toast('姓名长度不超过10个字符')
        return
      }
      if (!hospitalName) {
        Toast('请选择医院')
        return
      }
      if (!departmentName) {
        Toast('请选择科室')
        return
      }
      if (!positionName) {
        Toast('请选择职称')
        return
      }
      if (
        email &&
        !/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(
          email
        )
      ) {
        Toast('请输入正确邮箱地址')
        return
      }
      if (this.userName) {
        if (this.userName != this.user.userName) {
          Dialog.confirm({
            title: '提示',
            message: '修改姓名需要重新提交认证信息，确认修改吗？',
            confirmButtonText: '取消修改',
            cancelButtonText: '继续修改',
            showCancelButton: true
          })
            .then(() => {
              // on confirm
              this.user.userName = this.userName
              this.saveUser(this.user)
            })
            .catch(() => {
              // on cancel
              this.saveUser(this.user)
            })
        } else {
          this.saveUser(this.user)
        }
      } else {
        this.saveUser(this.user)
      }
    }
  },
  watch: {
    searchTxt (nw, od) {
      if (od && !nw) {
        this.showHos = true
        this.showCity = false
        this.showHosList = false
        this.showDotty = false
      }
    },
    user: {
      handler: () => {
        // debugger;
        console.log('user改变了', this.user)
      },
      deep: true
    }
  },
  beforeRouteLeave (to, from, next) {
    var amy = storage.get('amy')
    storage.remove('upImgOver') // 删除状态
    if (to.name == 'upauthimg') {
      console.log(to.name)
      from.meta.keepAlive = true
    } else {
      console.log('no keepalive')
      from.meta.keepAlive = false
    }
    next()
  },
  beforeRouteEnter (to, from, next) {
    if (from.name == 'upauthimg') {
      console.log(from.name)
      to.meta.keepAlive = true
    } else if (from.name == 'self') {
      to.meta.keepAlive = false
    } else if (from.name == 'newsletter') {
      to.meta.keepAlive = false
    } else {
      to.meta.keepAlive = true
    }
    next()
  }
}
</script>

<style lang='less' scoped>
@import "../../../style/setting.less";
.van-popup--right {
  width: 100%;
  height: 100%;
  //  background-color: transparent;
  position: absolute;
  margin-top: -1px;
}
input:disabled {
  background-color: #fff;
}
</style>
