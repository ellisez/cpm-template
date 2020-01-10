export default function hideShareBtn (flag) {
	       var u = navigator.userAgent
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)// ios终端
  // true:隐藏 false:显示

  if (isAndroid) {
    if (window.WebViewJavascriptBridge) {
      window.WebViewJavascriptBridge.callHandler(
        'hideShareBtn',
        { 'isHide': flag },
        function (responseData) {
          console.log(responseData)
        }
      )
    } else {
      document.addEventListener(
        'WebViewJavascriptBridgeReady'
        , function () {
          window.WebViewJavascriptBridge.callHandler(
            'hideShareBtn',
            { 'isHide': flag },
            function (responseData) {
              console.log(responseData)
            }
          )
        },
        false
      )
    }
  } else if (isIOS) {
    // 检测是已创建script
    var hasBuildScript = document.getElementById('IOS_shareBtn')

    if (hasBuildScript) {
      document.body.removeChild(hasBuildScript)
      var script = document.createElement('script')
      script.id = 'IOS_shareBtn'
      script.innerHTML = 'try{window.webkit.messageHandlers.hideShareBtnOC.postMessage({isHide: ' + flag + '});}catch(e){}'

      document.body.appendChild(script)
    } else {
      var script = document.createElement('script')
      script.id = 'IOS_shareBtn'
      script.innerHTML = 'try{window.webkit.messageHandlers.hideShareBtnOC.postMessage({isHide: ' + flag + '});}catch(e){}'

      document.body.appendChild(script)
    }
  } else {
          	console.log('pc')
  }
}
// 分享显示隐藏
