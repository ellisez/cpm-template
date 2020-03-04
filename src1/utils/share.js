import axios from 'axios'
import storage from 'storejs'
import store from '../store'
import { Toast } from 'vant'
import { baseUrl } from '../interfaceUrl'
import service from '../core/serviceAPI'
import { getUrlParam } from './func'
import encode from './encode' // AES
import createUuid from './uuid' // uuid

export default function share (info) {
  function getJsTiket (encrypt) {
    let platform = getUrlParam('platform')
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
    })
  }

  const userInfo = store.getters['user/userInfo']
  const platform = store.getters.platform
  const encrypt = userInfo.encrypt
  if (platform === 'WX') {
    getJsTiket(encrypt)
      .then((res) => {
        var data = JSON.parse(encode.decodeFuc(res.data.data))
        const signParams = Object.assign({}, data.body, {
          debug: false,
          jsApiList: [
            'onMenuShareAppMessage',
            'onMenuShareTimeline',
            'hideOptionMenu',
            'updateTimelineShareData',
            'updateAppMessageShareData',
            'startRecord', // 开始录音
            'stopRecord', // 停止录音
            'onVoiceRecordEnd', // 监听录音自动停止接口
            'playVoice', // 播放录音
            'pauseVoice', // 暂停云隐接口
            'stopVoice', // 停止播放
            'onVoicePlayEnd', //
            'uploadVoice', // 上传语音
            'downloadVoice' // 下载语音
          ]
        })
        signParams.appId = process.env.VUE_APP_APPID
        wx.config(signParams)
        wx.ready(() => {
          const params = {
            title: info.title,
            desc: info.desc,
            link: info.link,
            imgUrl: info.imgUrl,
            success (res) {
              console.log(res)
            }
          }
          wx.onMenuShareAppMessage(params)
          wx.onMenuShareTimeline(params)
        })
      })
  } else {
    const u = navigator.userAgent
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

    const GetQueryString = function (name) {
      const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) return (r[2])
      return null
    }

    if (isAndroid) {
      if (window.WebViewJavascriptBridge) {
        window.WebViewJavascriptBridge.callHandler(
          'setShareInfo', {
            title: info.title,
            brief: info.desc,
            shareUrl: info.link,
            shareImg: info.imgUrl
          },
          (responseData) => {
            console.log(responseData)
            // window.alert('success');
          }
        )
      } else {
        document.addEventListener(
          'WebViewJavascriptBridgeReady',
          () => {
            window.WebViewJavascriptBridge.callHandler(
              'setShareInfo', {
                title: info.title,
                brief: info.desc,
                shareUrl: info.link,
                shareImg: info.imgUrl
              },
              (responseData) => {
                console.log(responseData)
                // window.alert('success');
              }
            )
          },
          false
        )
      }
    } else if (isIOS) {
      // 检测是已创建script
      // var url = window.location.href;
      // var repStr = GetQueryString('uid')
      // var str = url.replace(repStr,'')
      // var _str = str.replace('#!','#')

      // var hasBuildScript=document.getElementById('IOS_shareInfo')
      //      if (hasBuildScript) {
      //         document.body.removeChild(hasBuildScript)
      //         var script = document.createElement('script');
      //             script.id = 'IOS_shareInfo';
      //             script.innerHTML='try{window.webkit.messageHandlers.getShareInfoOC.postMessage({title:"'+info.title+'",brief:"'+info.brief+'",shareUrl:"'+info.shareUrl+'"});}catch(e){}'
      //             document.body.appendChild(script)
      //         }else{
      //            var script = document.createElement('script');
      //                script.id = 'IOS_shareInfo';
      //                script.innerHTML='try{window.webkit.messageHandlers.getShareInfoOC.postMessage({title:"'+info.title+'",brief:"'+info.brief+'",shareUrl:"'+info.shareUrl+'"});}catch(e){}'
      //            document.body.appendChild(script)
      //         }
      location.href = `share://a.com?url=${info.link}&=&title=${info.title}&=&brief=${info.desc}&=&image=${info.imgUrl}`
    } else {
      console.log('pc')
    }
  }
}
