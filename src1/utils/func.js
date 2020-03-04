export const checkSystem = function () {
  var u = navigator.userAgent
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  if (isIOS) {
    return 'IPH'
  } else if (isAndroid) {
    return 'ADR'
  } else {
    return 'PC'
  }
}

export function changeTitle (title) {
  const u = navigator.userAgent
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  const isWechat = /MicroMessenger/i.test(navigator.userAgent)
  // 0是隐藏，1是显示

  document.title = title
  document.getElementsByTagName('title')[0].innerText = title

  if (isWechat) return
  if (isAndroid) {
    if (window.WebViewJavascriptBridge) {
      window.WebViewJavascriptBridge.callHandler(
        'setTitle',
        { title },
        (responseData) => {
          console.log(responseData)
          //  window.alert('success')
        }
      )
    } else {
      document.addEventListener(
        'WebViewJavascriptBridgeReady'
        , () => {
          window.WebViewJavascriptBridge.callHandler(
            'setTitle',
            { title },
            (responseData) => {
              console.log(responseData)
              // window.alert('success')
            }
          )
        },
        false
      )
    }
  } else if (isIOS) {
    // 检测是已创建script
    //  var hasBuildScript=document.getElementById('IOS_setTitle')
    //   if (hasBuildScript) {
    //       document.body.removeChild(hasBuildScript)
    //       var script = document.createElement('script');
    //           script.id = 'IOS_setTitle';
    //           script.innerHTML='try {window.webkit.messageHandlers.setTitle.postMessage({title: "'+title+'"});}catch(e){console.log(e)}'

    //           document.body.appendChild(script)
    //   }else{

    //      var script = document.createElement('script');
    //          script.id = 'IOS_setTitle';
    //          script.innerHTML='try{window.webkit.messageHandlers.setTitle.postMessage({title: "'+title+'"});}catch(e){console.log(e)}'

    //          document.body.appendChild(script)
    //   }
    if (location.href.indexOf('appencrypt') !== -1) {
      location.href = `title://a.com?title=${title}`
    }
  } else {
    console.log('pc')
  }
}

export const getUrlParam = function (name) {
  var parmsStr = window.location.search.substring(1)
  var parmsArr = parmsStr.split('&')
  var parms = {}
  for (var i = 0; i < parmsArr.length; i++) {
    parms[parmsArr[i].split('=')[0]] = parmsArr[i].split('=')[1]
  }
  return parms[name]
}

export const throttle = function (method, delay, duration) {
  var timer = null; var begin = new Date()
  return function () {
    var context = this; var args = arguments; var current = new Date()
    clearTimeout(timer)
    if (current - begin >= duration) {
      method.apply(context, args)
      begin = current
    } else {
      timer = setTimeout(function () {
        method.apply(context, args)
      }, delay)
    }
  }
}
