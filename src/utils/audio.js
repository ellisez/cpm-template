import Vue from 'vue'
import { baseUrl } from '../interfaceUrl'
import storage from 'storejs'
import { Toast } from 'mint-ui'

export default function audioPlay () {
  var audio = $('#audioTag').get(0)
  var a1 = document.getElementById('a1')
  let iW = 0
  let read_timer = null
  // 播放暂停控制
  $('#playPause').click(function () {
    // 改变暂停/播放icon
    if (audio.paused) {
      audio.play()
      $('.icon-btn').removeClass('icon-play').addClass('icon-pause')
      addPv($(audio).data('code'))
      clearTimeout(read_timer)
      read_timer = setTimeout(() => {
        jifenRules($(audio).data('code'))
      }, 3000)
    } else {
      audio.pause()
      $('.icon-btn').removeClass('icon-pause').addClass('icon-play')
    }
    /* iW = $('.pgs').width() / audio.duration
            */

    /* $('.img1').css('left', 1)
        $('.p1').css('width', 1) */
  })

  audio.addEventListener('timeupdate', function () {
    iW = $('.pgs').width() / audio.duration
    // $('.pgs-play-img').css('transform', 'translateX(' +  iW * audio.currentTime + 'px)')
    $('.pgs-play-img').css('left', iW * audio.currentTime)
    $('.pgs-play').css('width', iW * audio.currentTime)
    $('#audioTime').text(transTime(audio.duration - audio.currentTime))
  }, false)

  /* a1.addEventListener('timeupdate', function () {
        iW = $('.pgs1').width() / a1.duration
        //$('.audio-more').text(this.duration)
        $('.img1').css('left', iW * a1.currentTime)
        $('.p1').css('width', iW * a1.currentTime)
        //$('.audio-more').text(iW + ' - ' + a1.currentTime)
    }, false) */
  /* setInterval(function () {
        $('.img1').css('left', Number(iW * a1.currentTime))
        $('.p1').css('width', parseInt(iW * a1.currentTime))

    },30) */

  // 监听播放完成事件
  audio.addEventListener('ended', audioEnded, false)

  // 读取视频长度,设置页面时长显示-loadedmetadata:指定视频/音频（audio/video）的元数据加载后触发
  // audio.duration 获取音频的时长，单位为秒
  /* $('#audioTag').on("loadedmetadata",function () {
        //alert(audio.duration)
        $('#audioTime').text(transTime(this.duration));
    }); */

  // var pgsWidth = $('.pgs img').width()*0.907; //0.907是 进度条这个div和整个进度条图片宽度的比例
  // 点击进度条跳到指定点播放
  /* $('.pgs img').click(function (e) {

        var rate = (e.offsetX - ($(this).width()-pgsWidth)/2)/pgsWidth;
        audio.currentTime = audio.duration * rate;
        updateProgress();
    }); */
}

// 转换音频时长显示
function transTime (time) {
  var duration = parseInt(time)
  var minute = parseInt(duration / 60)
  var sec = duration % 60 + ''
  var isM0 = ':'
  if (minute == 0) {
    minute = '00'
  } else if (minute < 10) {
    minute = '0' + minute
  }
  if (sec.length == 1) {
    sec = '0' + sec
  }
  return minute + isM0 + sec
}

// 更新进度条
function updateProgress () {
  var audio = document.getElementsByTagName('audio')[0]
  var value = Math.round((Math.floor(audio.currentTime) / Math.floor(audio.duration)) * 100, 0)
  $('.pgs-play').css('width', value * 0.907 + '%')
  $('.pgs-play-img').css('left', value * 0.907 + '%')
  $('.played-time').html(transTime(audio.currentTime))
}
// 播放完成
function audioEnded () {
  var audio = document.getElementsByTagName('audio')[0]
  audio.currentTime = 0
  audio.pause()
  $('.play-pause>span').removeClass('icon-pause').addClass('icon-play')
}

function jifenRules (code) {
  var encrypt = storage.get('snf').encrypt

  let data = {
    encrypt: encrypt,
    code: code,
    type: 3
  }
  Vue.http.post(baseUrl + '/common/up/reported', JSON.stringify(data),
    { emulateJSON: true,
      headers: { 'Content-Type': 'application/json;charset=UTF-8', 'encrypt': encrypt }
    }).then((res) => {
    if (res.body.code == 0) {
      Toast(res.body.msg)
    } else {
      if (res.body.data.isFlag == true) {
        Toast('积分+' + res.body.data.score)
        // this.resultShow = true
        // this.msg = `恭喜您获得<span style="color: #d93639;font-size:0.2rem;"> ${res.body.data.score} </span>积分!`
      }
    }
  })
}

function addPv (code) {
  var encrypt = storage.get('snf').encrypt

  let data = {
    encrypt: encrypt,
    code: code
  }

  Vue.http.post(baseUrl + '/query/every/listen/add', JSON.stringify(data), {
    emulateJSON: true,
    headers: { 'Content-Type': 'application/json;charset=UTF-8', 'encrypt': encrypt }
  }).then((res) => {
    if (res.body.code == 0) {
      Toast(res.body.msg)
    }
  })
}
