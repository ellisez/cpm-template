import axios from 'axios'
import { baseUrl } from '../interfaceUrl'
import { getUrlParam } from './func'
import encode from './encode' // AES
import createUuid from './uuid' // uuid
// import api from './api'

export const checkUser = function () {
  const cookie = getCookie('user')
  if (!cookie) {
    return false
  } else {
    return true
  }
}

export const getQuery = function (shareUrl, name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = shareUrl.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

// export const getJsTicket = function (encrypt) {

//   return axios.post('/mpapi', {
//     guid: 'web',
//     platform: 'web',
//     version: '1.2.2',
//     time: parseInt(+new Date() / 1000),
//     encrypt,
//     reqs: [{
//       head: { cmd: 'jsapi_signature', srv: 'wxaccess_wxauth' },
//       body: { appId: process.env.VUE_APP_APPID, url: location.href.split('#')[0] },
//     }],
//   });
// }
export const getJsTicket = function (encrypt) {
  // body...
  let platform = getUrlParam('platform')
  // let deCodeEncrypt =	encrypt ? JSON.parse(encode.decodeFuc(encrypt)):{sessionKey:'',uid:''}
  // console.log(deCodeEncrypt, 'deCodeEncrypt')
  const data = {
    'body': {
      'encrypt': encrypt,
      appid: process.env.VUE_APP_APPID,
      url: location.href.split('#')[0]
    },
    'brand': platform || 'web',
    'guid': createUuid(),
    'model': platform || 'web',
    'platform': platform || 'web',
    'sysVersion': '7.1.1',
    'time': parseInt(+new Date() / 1000),
    'uid': '',
    'version': '1.2.2',
    'isJailBreak': false,
    'isSimulator': false,
    'session': ''
  }
  return axios({
    method: 'post',
    url: 'https://api.yishengzhan.cn/gw/wechat/getJsticket',
    data: encode.encodeFunc(data)
    // data: data
  })
}

// export const checkHrUser = function (cookie,openid) {
// 	return axios({
// 		method:'post',
// 		url:'/api',
// 		data:{
// 			guid:'web',
// 			platform:'web',
// 			version:'1.2.2',
// 			time: parseInt(+new Date()/1000),
// 			encrypt: cookie,
// 			reqs:[{
// 				head:{cmd:'valify_usr_identity',srv:'ent_hr'},
// 				body:{openid}
// 			}]
// 		}
// 	})
// 	.then(res=>{
// 		return res.data
// 	})
// }

// export const getOpenId = function (code) {
// 	return axios({
// 		method:'post',
// 		url:'/api',
// 		data:{
// 			guid:'web',
// 			platform:'web',
// 			version:'1.2.2',
// 			time: parseInt(+new Date()/1000),
// 			encrypt: '',
// 			reqs:[{
// 				head:{cmd:'oauth_openid',srv:'wxaccess_wxauth'},
// 				body:{appId:window.appId,code}
// 			}]
// 		}
// 	})
// 	.then(res=>{
// 		return res.data
// 	})
// }

export const getUser = function (areaCode, platFrom, userId) {
  return axios({
    method: 'post',
    url: baseUrl + '/accounts/login',
    data: {
      areaCode: areaCode,
      platFrom: platFrom,
      userId: userId
    }
  })
    .then(res => {
      return res.data
    })
}
