import axios from 'axios'
import { getUrlParam } from './func'
import encode from './encode' // AES
import createUuid from './uuid' // uuid
/**
 * ???
 */

/**
 *
 * @param {*String} encrypt  必传
 *
 */
export const _getArticleList = function (encrypt) {
  // body...
  console.log(encrypt, 'encryptencryptencryptencrypt')
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
  console.log(data, 'data')
  return axios({
    method: 'post',
    url: 'https://api.yishengzhan.cn/gw/wechat/getJsticket',
    data: encode.encodeFunc(data)
    // data: data
  })
}
