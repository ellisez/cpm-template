import { baseUrl } from '../interfaceUrl'
import Vue from 'vue'
import storage from 'storejs'
import VueResource from 'vue-resource'

const LeijiUrl = baseUrl + '/diligent/sign/num' // 累计打卡记录查询
const SingCheckUrl = baseUrl + '/accounts/sign/check' // 今天是否打卡
const WenzhangUrl = baseUrl + '/diligent/article/read/num' // 阅读文章总数查询
const ShipinUrl = baseUrl + '/diligent/video/read/num' // 阅读视频总数查询
const DarenUrl = baseUrl + '/diligent/rank/list' // 达人榜
const checkUrl = baseUrl + '/lottery/user/isAlready/exist/order' // 查询是否兑换过礼物
const payUrl = baseUrl + '/diligent/user/activity/diligent/pay' // 勤勉将兑换奖品

Vue.use(VueResource)

function getTimeQMY (t) {
  var date = new Date(t)
  var Y = date.getFullYear() + ''
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + ''
  var D = date.getDate() + ''
  var h = date.getHours() + ''
  var m = date.getMinutes() + ''
  var s = date.getSeconds()
  return Y + M + D + h + m + s
}
// let encrypt = storage.get("amy").encrypt;
// let  = storage.get("amy")&&storage.get("amy").hasOwnProperty('userId') && storage.get("amy").userId;
let { userId, companyCode } = storage.get('amy') && storage.get('amy').hasOwnProperty('userId') && storage.get('amy').userId
/**
 * 累计打卡记录查询
 * @param {userId}
 * @param {companyCode	}
 * @param {beginTime} [活动开始时间]
 * @param {endTime} [活动结束时间]
 */

export const getLeijiSignNum = function (params) {
  console.log(userId, 'user')
  // params.userId = userId
  // params.companyCode = companyCode
  const data = {
    userId: storage.get('amy') && storage.get('amy').hasOwnProperty('userId') && storage.get('amy').userId,
    companyCode: storage.get('amy').companyCode
  }
  let p = Object.assign(data, params)
  return Vue.http
    .post(LeijiUrl, JSON.stringify(p), {
      emulateJSON: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        encrypt: storage.get('amy').encrypt
      }
    })
    .then(res => {
      return res
    })
}

/**
 * 今天是否打卡
 *
 * @param {companyCode	}
 * @returns 是否签到 0：未签到 1：已签到
 */

export const checkSingToday = function () {
  console.log(userId, 'user')
  let params = {
    // userId: storage.get("amy")&&storage.get("amy").hasOwnProperty('userId') && storage.get("amy").userId,
    companyCode: storage.get('amy').companyCode
  }
  return Vue.http
    .post(SingCheckUrl, JSON.stringify(params), {
      emulateJSON: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        encrypt: storage.get('amy').encrypt
      }
    })
    .then(res => {
      return res
    })
}

/**
 * 阅读文章总数查询
 * @param {userId}
 * @param {modelCode}
 * @param {beginTime} [活动开始时间]
 * @param {endTime} [活动结束时间]
 */

export const getWenzhangNum = function (params) {
  // params.userId = userId
  // params.modelCode = 'AMYXY-BJJTJ'
  const data = {
    userId: storage.get('amy') && storage.get('amy').hasOwnProperty('userId') && storage.get('amy').userId,
    modelCode: 'AMYXY-XSXHB'
  }
  let p = Object.assign(data, params)
  return Vue.http
    .post(WenzhangUrl, JSON.stringify(p), {
      emulateJSON: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        encrypt: storage.get('amy').encrypt
      }
    })
    .then(res => {
      return res
    })
}

/**
 * 阅读视频总数查询
 * @param {userId}
 * @param {modelCode}
 * @param {beginTime} [活动开始时间]
 * @param {endTime} [活动结束时间]
 */

export const getShipinNum = function (params) {
  const data = {
    userId: storage.get('amy') && storage.get('amy').hasOwnProperty('userId') && storage.get('amy').userId,
    modelCode: 'AMYXY-BJJTJ'
  }
  let p = Object.assign(data, params)
  return Vue.http
    .post(ShipinUrl, JSON.stringify(p), {
      emulateJSON: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        encrypt: storage.get('amy').encrypt
      }
    })
    .then(res => {
      return res
    })
}

/**
 * 达人榜
 * @param {companyCode}
 * @param {articleModelCode} [文章模块code（AMYXY-BJJTJ）]
 * @param {videoModelCode	} [视频模块code（AMYXY-XSXHB）]
 * @param {beginTime} [活动开始时间]
 * @param {endTime} [活动结束时间]
 */

export const getDaRen = function (params) {
  const data = {
    articleModelCode: 'AMYXY-XSXHB',
    videoModelCode: 'AMYXY-BJJTJ',
    companyCode: storage.get('amy').companyCode
  }
  let p = Object.assign(data, params)
  // params.articleModelCode = 'AMYXY-XSXHB'
  // params.videoModelCode = 'AMYXY-XSXHB'
  // params.companyCode = companyCode
  return Vue.http
    .post(DarenUrl, JSON.stringify(p), {
      emulateJSON: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        encrypt: storage.get('amy').encrypt
      }
    })
    .then(res => {
      return res
    })
}

/**
 * 查询是否兑换过礼物
 * @param {userId}
 * @param {companyCode	}
 * @param {orderType} [订单类型（2：月饼 3：勤勉月奖品）]
 * @returns true：未兑换过；false：兑换过 code 订单code
 */

export const checkPary = function () {
  const data = {
    userId: storage.get('amy') && storage.get('amy').hasOwnProperty('userId') && storage.get('amy').userId,
    orderType: '3',
    companyCode: storage.get('amy').companyCode
  }
  // params.articleModelCode = 'AMYXY-XSXHB'
  // params.videoModelCode = 'AMYXY-XSXHB'
  // params.companyCode = companyCode
  return Vue.http
    .post(checkUrl, JSON.stringify(data), {
      emulateJSON: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        encrypt: storage.get('amy').encrypt
      }
    })
    .then(res => {
      return res
    })
}

/**
 * 勤勉将兑换奖品
 */

export const getPay = function (params) {
  const data = {
    userId: storage.get('amy') && storage.get('amy').hasOwnProperty('userId') && storage.get('amy') && storage.get('amy').hasOwnProperty('userId') && storage.get('amy').userId,
    orderType: '3',
    commodityCode: getTimeQMY(new Date().getTime()),
    companyCode: storage.get('amy').companyCode,
    companyName: '第一三共',
    commodityName: '勤勉月礼品',
    orderType: '3'
  }
  return Vue.http
    .post(payUrl, JSON.stringify(data), {
      emulateJSON: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        encrypt: storage.get('amy').encrypt
      }
    })
    .then(res => {
      return res
    })
}
