export default {
  state: {
    // paryTime_countDown: Number(new Date("2018/9/24").getTime()) - new Date("2033/9/24").getTime(), // 活动有没有开始--倒计时
    paryTime_countDown: Number(new Date('2018/11/1').getTime()) - new Date().getTime(), // 活动有没有开始--倒计时
    paryTime_dh: Number(new Date('2018/11/8').getTime()) - new Date().getTime() // 活动有没有开始--兑换按钮

  },
  getters: {
    /**
     * 有没有到活动开始时间 --兑换
     *
     */
    isPary_dh (state) {
      const day = Math.floor(state.paryTime_dh / 86400000)
      console.log(day, 'dh-----')
      if (day < 0) {
        return 0
      } else if (day > 0) {
        return 1
      } else {
        return -1
      }
      // if(day >= 0){
      //     return 1
      // }else {
      // console.log(day, 'store <= 0000000 --day')
      //     return 0
      // }
    },
    /**
         * 有没有到活动开始时间 --倒计时
         *  0 活动未开始
         *  1 活动进行中
         *  -1 已结束
         */
    isPary_countDown (state) {
      const day = Math.floor(state.paryTime_countDown / 86400000)
      let c = new Date().getTime()
      // let s = new Date('2018/10/1').getTime()
      let s = new Date('2018/10/1').getTime() // 控制活动有没有开始
      console.log(day, 'day-isPary_countDown')
      if (c <= s) {
        return 0
      } else if (day < 0) {
        return -1
      } else {
        return 1
      }
      // if (day < 0 || c < s) {
      //     return 0
      // } else if (day > 0) {
      //     return 1
      // } else {
      //     return -1
      // }
    }
  },
  mutations: {
    set_paryTime_countDown (state, params) {
      state.paryTime_countDown = params
    }

  }
}
