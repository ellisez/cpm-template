import serviseAPI from '../core/serviceAPI'

const mixin819 = {
  data () {
    return {
      is_activity: 0 // 是否在活动时间 819 , 0 活动未开始 1 活动中 2 已结束
    }
  },
  methods: {
    /**
     * 是否在活动时间内
     * @return 状态 0 1 2
     */
    async init819Activity () {
      try {
        let t = process.env.VUE_APP_ACTIVITY_START_819
        let nowDateRes = await serviseAPI.getSysTime() // 获取服务器时间
        let nowDate = new Date(nowDateRes.data.replace(/-/gi, '/'))
        let start = new Date(t.replace(/-/gi, '/'))
        console.log(process.env.VUE_APP_ACTIVITY_START_819, 'now-start')
        console.log(nowDate, 'nowDate')

        let end = new Date(process.env.VUE_APP_ACTIVITY_END_819.replace(/-/gi, '/'))
        if (nowDate - start > 0 && nowDate - end < 0) {
          this.is_activity = 1 // 已开始
        } else {
          if (nowDate - start > 0) {
            this.is_activity = 1 // 开始
          } else {
            this.is_activity = 0 // 未开始
          }
          if (nowDate - end > 0) {
            this.is_activity = 2 // 已结束
          }
        }
        return Promise.resolve(this.is_activity)
      } catch (e) {
        return Promise.reject(e)
      }
    }
  }
}
export default mixin819
