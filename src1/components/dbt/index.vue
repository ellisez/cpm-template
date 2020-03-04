<template>
  <div class="indexWrap" @click.stop="isToggle819=false">
    <!-- <div class="fullscreen" @click.stop="isToggle819=false" v-if="isToggle819"></div> -->
    <div class="topSearch" @click="search">
      <p class="searchBar">
        <i class="serchIcon"></i>
        <span>搜索医院、医生</span>
      </p>
    </div>
    <div class="index_wrap">
      <div class="my" @click="my">
        个人中心
        <span v-if="showCircle"></span>
      </div>
      <swipe v-if="banners.length != 0" class="swiper_index" :showIndicators="false" :auto="4000">
        <swipe-item v-for="(item, index) in banners" :key="index">
          <a @click="linkAddressGo(item.linkAddressUrl,item.id)">
            <img :src="item.thumbnailUrl" />
          </a>
        </swipe-item>
      </swipe>
    </div>
    <div class="banner">
      <mt-swipe :auto="3000">
        <mt-swipe-item>1</mt-swipe-item>
        <mt-swipe-item>2</mt-swipe-item>
        <mt-swipe-item>3</mt-swipe-item>
      </mt-swipe>
    </div>

    <!-- 推荐之星 -->
    <div class="month">
      <div class="title" data-flex="main:justify cross:center">
        <h3 class="tuiH3">
          推荐之星
          <i class="tuiHelp" @click.stop="torecommendRule"></i>
        </h3>
        <div class="tabWrap" data-flex="main:justify cross:center">
          <div
            v-for="(item,index) in starTab"
            :key="index"
            @click="changeStrtChart(index)"
            :class="['tab_item',isActiveStar === index? 'active':'']"
          >{{item}}</div>
          <!-- <div class="tab_item">总榜</div> -->
        </div>
      </div>
      <div class="starBox">
        <div style="width:100%">
          <canvas id="star" :width="canvasWidth-10" height="150"></canvas>
        </div>
        <div class="starMe star">
          <canvas id="star2" :width="canvasWidth-10" height="120" ref="star2"></canvas>
        </div>
      </div>
    </div>
    <div class="month">
      <div class="title" data-flex="main:justify cross:center">
        <h3>邀请动态</h3>
        <span @click="myCustomer">
          目标医生数
          <em style="font-style:normal;color:#5F68F1;
">{{targetCount}}人</em>
        </span>
      </div>
      <div style="width:100%;height:260px">
        <canvas id="month" :width="canvasWidth" height="260"></canvas>
      </div>
    </div>
    <div class="customer">
      <div class="title" data-flex="main:justify cross:center">
        <h3>目标客户分析</h3>
      </div>
      <canvas id="customer" :width="canvasWidth" height="260"></canvas>
    </div>
    <!-- @click.stop="" -->

    <!-- 819活动入口 -->
    <div class="activityEntry" @click.stop="toggle819" v-show="this.is_activity === 1">
      <div class="activityEntry_wrap">
        <div class="activityEntry_cicle">
          <span></span>
        </div>
      </div>
    </div>
    <!-- 展开 的内容 -->
    <div class="activityEntry" @click.stop="toActivity('anniu')" v-if="isToggle819">
      <div :class="['activityEntry_wrap',isToggle819?'activityEntryNLXF':'']">
        <div class="activityEntry_cicle">
          <span></span>
        </div>
        <div class="activityEntry_txt" v-show="isToggle819">纳凉先锋活动</div>
      </div>
    </div>
    <!-- 819 弹框 -->
    <y-dialog
      :showModel="dialogShow_info819"
      @hideDialog="hideDialogInfo"
      v-if="$parent.isRepresent === 'Y'"
    >
      <div class="first819tk">
        <img src="src1/assets/819/indexTk_bg.png" alt class="bg_819" />

        <div class="first819tk_desc">
          <p>完成任务，赢取丰富奖励</p>
          <p>活动时间：2019.08.16-2019.08.31</p>
        </div>
        <div class="first819tk_footer" @click.stop="toActivity('banner')">
          <span>活动详情</span>
        </div>
      </div>
    </y-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { Toast, Swipe, SwipeItem } from 'mint-ui'
// import { Popup } from "vant";

import F2 from '@antv/f2'
import G2 from '@antv/g2'
import storage from 'storejs'
import serviceApi from '../../api/serviceAPI'
import { setTimeout } from 'timers'
import { clone, values } from 'lodash' // 推荐之星要用
import { constants } from 'fs'
import index from '../../store'
import yDialog from '@/components/common/dialog'
import mixin819 from '../../utils/mixin819'

export default {
  mixins: [mixin819],
  data () {
    return {
      isToggle819: false, // 819 伸缩兰是否展开
      dialogShow_info819: false, // 819 弹框
      canvasWidth: document.documentElement.clientWidth,
      configTuiStar: [], // 推荐之星 图例 配置
      star2Chart: null, // 我 图表
      isActiveStar: 0, // 默认选中月榜
      starTab: ['月榜', '总榜'],
      banners: [],
      monthList: [],
      customerList: [],
      targetCount: '',
      showCircle: ''
    }
  },
  created () {
    this.getNews()
  },
  computed: {},
  mounted () {
    this.getBanner()
    this.getInvite()
    this.customerData()
    this.changeStrtChart(this.isActiveStar) // 推荐之星初始化

    this.init819Activity() // 初始化819时间
    // 819 弹框 限制 每天弹一次
    this.init819Dialog().then(res => {
      console.log(res, '819')
      if (res) {
        // 初始化819
        this.init819Activity()
          .then(res => {
            console.log(res, '819')
            setTimeout(() => {
              this.$nextTick(() => {
                this.dialogShow_info819 = this.is_activity === 1
              })
            }, 300)
            // this.dialogShow_info819 = Boolean(this.is_activity === 1);
            console.log(this.dialogShow_info819, 'this.dialogShow_info819')
          })
          .catch(e => {
            console.log('初始化819shibai')
          })
      }
    })
  },
  methods: {
    ...mapActions({
      getBannerList: 'content/getBannerList',
      reportSourceUrl: 'content/reportSourceUrl',
      getRecommendStar: 'content/getRecommendStar',
      getSysTime: 'ubt/getSysTime',
      baoSaveReport: 'ubt/baoSaveReport'
    }),
    async init819Dialog () {
      var res = await this.getSysTime()
      var now = new Date(res.data.replace(/-/gi, '/'))
      var date = now.getDate()
      var month = now.getMonth() + 1
      console.log(month + '-' + date)
      var last = storage.get('819') || ''
      this.setDate819()
      if (month + '-' + date != last) {
        return true
      } else {
        return false
      }
    },
    /**
     * 819
     */
    async setDate819 () {
      try {
        var res = await this.getSysTime()
        var now = new Date(res.data.replace(/-/gi, '/'))
        var date = now.getDate()
        var month = now.getMonth() + 1
        storage.set('819', month + '-' + date)
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 展开819
     */
    toggle819 () {
      this.isToggle819 = true
    },
    /**
     * 隐藏819弹框
     */
    hideDialogInfo () {
      this.dialogShow_info819 = false
    },
    /**
     * 去819活动
     */
    toActivity (type) {
      this.$router.push({
        path: '/activity819'
      })
      var data = {
        PageName: '代表端活动入口-' + type,
        ControlName: '代表端活动入口' + type,
        ActionType: 2,
        ActionObj: '2',
        ActionName: '代表端活动入口-点击' + type,
        Description: '代表端活动入口' + type
      }
      try {
        this.baoSaveReport(data)
      } catch (error) {
        console.log(error)
      }
    },
    // 获取banner列表
    async getBanner () {
      try {
        // 819 活动
        // let a819 = {
        //   areaCode: "",
        //   areaName: "",
        //   bannerCode: "819",
        //   columnCode: "",
        //   id: 267,
        //   isSeniorShow: "A",
        //   linkAddressUrl: "https://merch.yishengzhan.cn/amyxy/#/activity819",
        //   modelCode: "",
        //   thumbnailUrl: "https://imageysz.yxj.org.cn/1565889237393.jpg"
        // };
        var res = await this.getBannerList({})
        this.banners = res.data
        // this.banners.unshift(a819);
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 推荐执行规则 去
     */
    torecommendRule () {
      this.$router.push({
        path: '/recommendRule'
      })
    },
    // 获取列表
    async getNews () {
      const data = {
        pageNum: 1,
        pageSize: 10,
        type: '1'
      }
      try {
        const res = await serviceApi.getNews(data)
        if (storage('msgNum') < Number(res.data.total)) {
          storage.set('msgCircle', true)
        } else {
          storage.set('msgCircle', false)
        }
        this.showCircle = storage('msgCircle')
      } catch (error) {
        console.log(error)
      }
    },

    // 目标客户折线图绘制
    checkCustomer () {
      let max = 10
      let xList = []
      this.customerList.forEach((ele, index) => {
        if (ele.pushNum > max) {
          max = ele.pushNum
        }
        if (ele.readNum > max) {
          max = ele.readNum
        }
        ele.nowDate = ele.nowDate.substring(5)
        xList.unshift(ele)
      })
      var legendItems = [
        {
          name: '推送次数',
          marker: function marker (x, y, r, ctx) {
            ctx.lineWidth = 1
            ctx.strokeStyle = ctx.fillStyle
            ctx.moveTo(x - r - 3, y)
            ctx.lineTo(x + r + 3, y)
            ctx.stroke()
            ctx.arc(x, y, r, 0, Math.PI * 2, false)
            ctx.fill()
          },
          fill: '#C19CFF',
          checked: true
        },
        {
          name: '阅读次数',

          marker: 'square',
          fill: '#9CA9FF',
          checked: true
        }
      ]
      var chart = new F2.Chart({
        id: 'customer',
        pixelRatio: window.devicePixelRatio
      })
      chart.source(xList, {
        readNum: {
          min: 0,
          max: max
        },
        pushNum: {
          min: 0,
          max: max
        }
      })
      chart.axis('nowDate', {
        label: function label (text, index, total) {
          const cfg = {
            rotate: -Math.PI / 4.5,
            textAlign: 'end',
            textBaseline: 'middle'
          }
          cfg.text = text
          return cfg
        }
      })
      chart.legend({
        custom: true,
        position: 'bottom',
        align: 'center',
        itemGap: 50,
        wordSpace: 20, // 图例与文字间的间距
        itemWidth: 100, // 图例项按照实际宽度渲染
        items: legendItems
      })
      chart.tooltip({
        showCrosshairs: true,
        showItemMarker: false,
        onShow: function onShow (ev) {
          var items = ev.items
          items[0].name = null
          items[1].name = null
          items[0].value = '阅读：' + items[0].value
          items[1].value = '推送：' + items[1].value
        }
      })
      chart.axis('pushNum', false)
      chart
        .interval()
        .position('nowDate*readNum')
        .color('#9CA9FF')
      chart
        .line()
        .shape('smooth')
        .position('nowDate*pushNum')
        .color('#C19CFF')
      chart.render()
    },

    // 跳转搜索
    search () {
      this.$router.push('/searchDBT')
    },

    // 跳转个人中心
    my () {
      this.$router.push('/myDBT')
      // storage.set("amyCircle", false);
    },

    // 我的客户
    myCustomer () {
      this.$router.push('/myCustomerDBT')
    },

    // 获取当月进度
    async getInvite () {
      try {
        const res = await serviceApi.getInvite({})
        this.targetCount = res.data.targetCount
        this.monthList = res.data.listData
        this.checkInvite()
      } catch (error) {
        console.log(error)
      }
    },

    // 目标医生
    async customerData () {
      try {
        const res = await serviceApi.customerData({})
        this.customerList = res.data.listData
        this.checkCustomer()
      } catch (error) {
        console.log(error)
      }
    },

    // 月度计划折线图绘制
    checkInvite () {
      let xList = []
      let max = 10
      this.monthList.forEach((ele, index) => {
        if (ele.count > max) {
          max = ele.count
        }
        xList.unshift({
          count: ele.count,
          nowDate: ele.nowDate.substring(5)
        })
      })
      var chart = new F2.Chart({
        id: 'month',
        pixelRatio: window.devicePixelRatio
      })

      chart.source(xList, {
        count: {
          min: 0,
          max: max
        }
      })
      chart.tooltip({
        showCrosshairs: true,
        showItemMarker: false,
        onShow: function onShow (ev) {
          var items = ev.items
          items[0].name = null
          items[0].value = '邀请医生：' + items[0].value + '人'
        }
      })
      chart.axis('nowDate', {
        label: function label (text, index, total) {
          const cfg = {
            rotate: -Math.PI / 4.5,
            textAlign: 'end',
            textBaseline: 'middle'
          }
          cfg.text = text
          return cfg
        }
      })
      chart
        .line()
        .shape('smooth')
        .position('nowDate*count')
        .color('l(90) 0:#1890FF 1:#f7f7f7')
      chart
        .area()
        .position('nowDate*count')
        .color('l(90) 0:#1890FF 1:#f7f7f7')
        .shape('smooth')
      chart.render()
    },
    /**
     * 点击总榜月榜 切换
     */
    changeStrtChart (index) {
      this.isActiveStar = index
      let iconTuiStarDoms = document.querySelectorAll('.iconTuiStar') // icon
      for (let i = 0; i < iconTuiStarDoms.length; i++) {
        iconTuiStarDoms[i].innerHTML = ''
      }
      // 月榜1 总榜2
      let params = {
        type: index + 1
      }
      this.getTuiData(params)
    },
    /**
     * 获取推荐之星数据
     */
    async getTuiData (params) {
      try {
        const res = await this.getRecommendStar(params)
        let result = await this.formatterTui1(res)
        // let result = await this.formatterTui1(this.mock2);
        // console.log(result, "result");
        // // 调用
        this.initStar(result.chartDataOther, result.max)
        this.initStarMe(result.chartDataMe, result.max, result.chartDataOther)
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 整理推荐之星 格式1
     */
    async formatterTui1 (p) {
      let m = {
        doctorCount: 0,
        doctorQuestionCount: 0,
        liveCount: 0,
        ranking: '',
        scoreCount: 0,
        totalCount: 0,
        userId: '',
        userName: storage.get('userInfoAMY').userName || '',
        userShareCount: 0
      }
      if (p.data.length === 3) {
        // 没有返回自己的数据
        p.data.push(m)
      }
      let convertArr = [] //
      // 整理成需要的 格式
      for (let i = 0; i < p.data.length; i++) {
        var data = [
          p.data[i].doctorCount,
          p.data[i].userShareCount,
          p.data[i].scoreCount,
          p.data[i].liveCount,
          p.data[i].doctorQuestionCount
        ]
        // var data = [1, 2, 3, 4, 5];
        convertArr.push({
          type:
            p.data[i].ranking === 1
              ? '冠军'
              : p.data[i].ranking === 2
                ? '亚军'
                : p.data[i].ranking === 3
                  ? '季军'
                  : p.data[i].ranking,
          name: p.data[i].userName || '',
          count: p.data[i].totalCount,
          data: data
        })
      }
      let chartOther = convertArr.splice(0, convertArr.length - 1) // 冠军亚军等图表数据data
      chartOther.reverse()
      let chartDataMe = await this.formatterTui(convertArr) // 我的图表数据
      let chartDataOther = await this.formatterTui(chartOther) // 冠军亚军等图表数据data
      let max = Math.max(...chartDataOther.countTui) // 最大值
      return {
        chartDataMe: chartDataMe,
        chartDataOther: chartDataOther,
        max: max
      }
    },
    /**
     * 整理推荐之星 格式2
     */
    async formatterTui (data) {
      let len = data.length
      this.configTuiStar = [
        '绑定医生参数',
        '推送内容参数',
        '医生积分参数',
        '直播报名参数',
        '医生提问参数'
      ]
      let res = []
      let nameArrTui = []
      let countTui = [] // 总数
      let tp = 0 // 临时计算总数
      for (let i = 0; i < data.length; i++) {
        nameArrTui.push(data[i].type)
        countTui.push(data[i].count)
        for (let j = 0; j < data[i].data.length; j++) {
          tp += data[i].data[j]
          //   if (j === 4) {
          //     countTui.push(count);
          //     tp = 0;
          //   }
          res.push({
            type: this.configTuiStar[j],
            value: data[i].data[j],
            name: data[i].name
          })
        }
      }
      let obj = {
        data: res,
        countTui: countTui,
        nameArrTui: nameArrTui
      }
      return obj
    },
    /**
     * 推荐之星 初始化ME
     * @param {data} 我的数据
     * @param {max} 最大值
     * @param {otherData} 冠军等图表数据，
     */
    initStarMe (data, max, otherData) {
      const isChampion =
        otherData.countTui.sort(function (n1, n2) {
          return n2 - n1
        })[0] === data.countTui[0] // 本身是不是冠军
      //   console.log(indexIcon, "IndexIcon");
      let formatter = function (val) {
        return val
      }

      let count = data.countTui
      var Shape = F2.Shape
      var Util = F2.Util
      var G = F2.G
      Shape.registerShape('interval', 'text', {
        draw: function draw (cfg, container) {
          var points = this.parsePoints(cfg.points)
          var style = {
            fill: cfg.color,
            z: true // 需要闭合
          }
          var shapes = []
          var intervalWidth = points[1].x - points[0].x
          var interval = container.addShape('rect', {
            attrs: Util.mix(
              {
                x: points[0].x,
                y: points[0].y,
                width: intervalWidth,
                height: points[3].y - points[0].y
              },
              style
            )
          }) // 绘制柱形
          shapes.push(interval)
          var origin = cfg.origin._origin // 获取对应的原始数据
          var textOffsetX = 4

          var text = new G.Shape.Text({
            attrs: {
              x: points[0].x + textOffsetX,
              y: (points[0].y + points[3].y) / 2 + 22,
              text: formatter(origin.value),
              fill: '#ccc',
              textAlign: 'start',
              textBaseline: 'middle',
              fontSize: 10
            }
          })
          //    count  渲染总数
          var textCount = new G.Shape.Text({
            attrs: {
              x: document.documentElement.clientWidth - 50,
              y: (points[0].y + points[3].y) / 2,
              text: count[cfg.origin.index],
              fill: '#666',
              textAlign: 'start',
              textBaseline: 'middle',
              fontSize: 10
            }
          })
          var textWidth = text.getBBox().width
          container.add(textCount)
          shapes.push(textCount)
          return shapes
        }
      })
      var colors = {
        绑定医生参数: '#6666FF',
        推送内容参数: '#6699FF',
        医生积分参数: '#66CCFF',
        直播报名参数: '#66FFFF',
        医生提问参数: '#EEEEEE'
      }
      var chart = new F2.Chart({
        id: 'star2',
        pixelRatio: window.devicePixelRatio,
        padding: [0, 30, 70, 70]
      })
      this.star2Chart = chart // 赋值给我的图表
      chart.source(data.data, {
        value: {
          min: 0,
          max: isChampion ? max + 1 : max + 22,
          nice: false,
          formatter: function (val) {
            return val
          }
        }
      })
      //   chart.tooltip = function(o) {
      //     console.log(o, "cfg");
      //     return (o.width = 100);
      //   };
      chart.tooltip({
        custom: true,
        valueStyle: {
          fontSize: 24,
          fill: '#fff',
          textAlign: 'start',
          textBaseline: 'middle'
        }, // tooltip value 项的文本样式配置
        onChange: function onChange (obj) {
          var legend = chart.get('legendController').legends.bottom[0]
          var tooltipItems = obj.items
          var legendItems = legend.items
          var map = {}
          legendItems.map(function (item) {
            map[item.name] = clone(item)
          })
          tooltipItems.map(function (item) {
            var name = item.name
            var value = item.value
            if (map[name]) {
              map[name].value = value
            }
          })
          legend.setItems(values(map))
        }
        // onHide: function onHide() {
        //   var legend = chart.get("legendController").legends.bottom[0];
        //   legend.setItems(chart.getLegendItems().country);
        // }
      })
      chart.coord({
        transposed: true
      })
      var legendItems = [
        {
          name: '绑定医生参数',
          fill: '#f2637b',
          checked: true,
          marker: 'square'
        },
        {
          name: '推送内容参数',
          marker: 'square',
          fill: '#36cbcb',
          checked: true
        },
        {
          name: '医生积分参数',
          marker: 'square',
          fill: '#4ecb73',
          checked: true
        },
        {
          name: '医生提问参数',
          marker: 'square',
          fill: '#3aa1ff',
          checked: true
        },
        {
          name: '直播报名参数',
          marker: 'square',
          fill: '#fbd437',
          checked: true
        }
      ]
      chart.legend({
        position: 'bottom',
        itemGap: 55,
        align: 'center',
        offsetX: -15,
        nameStyle: {
          fontSize: 10, // 文本大小
          fill: '#808080'
        }, // 图例项 key 值文本样式
        valueStyle: {
          fill: '#333',
          fontSize: 10 // 文本大小
        },
        itemWidth: 60, // 设置文本的宽度
        clickable: false, // 关闭点击操作
        items: legendItems
      })

      chart.axis('value', false)
      // 定位图标
      let icons = [
        'https://imageysz.yxj.org.cn/1558924953131.png',
        'https://imageysz.yxj.org.cn/1558925001000.png',
        'https://imageysz.yxj.org.cn/1558925023893.png'
      ]
      //   nameArrTui: ["15"]
      //   icons.reverse();
      let arrIcon = [0]
      // 我在前三名里面
      var modelImg = ''
      console.log(icons[data.nameArrTui[0] + 0], ' icons[indexIcon]')
      console.log(data.nameArrTui[0] + 0, 'data.nameArrTui[0]')
      let num = data.nameArrTui[0] > 99 ? '99+' : data.nameArrTui[0]
      if (icons[data.nameArrTui[0] + 0]) {
        modelImg =
          '<img src="' +
          icons[data.nameArrTui[0] + 0] +
          '" style="width: 21px;height: 21px;" />'
      } else {
        modelImg =
          '<div style="right:3px;width: 24px;font-size:10px;height: 25px;background:url(https://imageysz.yxj.org.cn/1559281338305.png) no-repeat no-repeat;background-size:100% 100%;line-height:27px;color:#fff">' +
          num +
          '</div>'
      }
      arrIcon.map(function (obj, i) {
        chart.guide().html({
          position: [obj, -15],
          html:
            '<div style="width: 80px;height: 24px;text-align: center;left:10px" class="iconTuiStar">' +
            modelImg +
            '</div>' +
            '</div></div>'
        })
      })

      // 定位图标 end
      chart.axis('name', {
        label: function label (text, index, total) {
          const cfg = {
            // rotate: -Math.PI / 4.5,
            textAlign: 'end',
            textBaseline: 'middle',
            offsetX: 0
          }
          //   cfg.text = text;
          cfg.text = text

          return cfg
        },

        tickLine: {
          alignWithLabel: false,
          length: 0
        },
        line: {
          lineWidth: 0
        }
      })

      chart
        .interval()
        .position('name*value')
        .color('type', function (val) {
          return colors[val]
        })
        .adjust('stack')
        .shape('text')
      chart.render()
    },
    /**
     * 推荐之星 初始化
     */
    initStar (data, max) {
      let formatter = function (val) {
        return val
      }
      var Shape = F2.Shape
      var Util = F2.Util
      var G = F2.G
      let count = data.countTui
      Shape.registerShape('interval', 'text', {
        draw: function draw (cfg, container) {
          var points = this.parsePoints(cfg.points)
          var style = {
            fill: cfg.color,
            z: true // 需要闭合
          }
          var shapes = []
          var intervalWidth = points[1].x - points[0].x
          var interval = container.addShape('rect', {
            attrs: Util.mix(
              {
                x: points[0].x,
                y: points[0].y,
                width: intervalWidth,
                height: points[3].y - points[0].y
              },
              style
            )
          }) // 绘制柱形
          shapes.push(interval)
          var origin = cfg.origin._origin // 获取对应的原始数据
          var textOffsetX = 3

          var text = new G.Shape.Text({
            attrs: {
              x: points[0].x + textOffsetX,
              y: (points[0].y + points[3].y) / 2 + 22,
              text: formatter(origin.value),
              fill: '#ccc',
              textAlign: 'start',
              textBaseline: 'middle',
              fontSize: 8
            }
          })
          //   count  渲染总数
          var textCount = new G.Shape.Text({
            attrs: {
              x: document.documentElement.clientWidth - 50,
              y: (points[0].y + points[3].y) / 2,
              text: count[cfg.origin.index],
              fill: '#666',
              textAlign: 'start',
              textBaseline: 'middle',
              fontSize: 10
            }
          })
          var textWidth = text.getBBox().width
          container.add(textCount)
          shapes.push(textCount)

          return shapes
        }
      })

      var colors = {
        绑定医生参数: '#6666FF',
        推送内容参数: '#6699FF',
        医生积分参数: '#66CCFF',
        直播报名参数: '#66FFFF',
        医生提问参数: '#EEEEEE'
      }
      var chart = new F2.Chart({
        id: 'star',
        pixelRatio: window.devicePixelRatio,
        padding: [0, 30, 0, 70]
      })
      chart.source(data.data, {
        value: {
          min: 0,
          max: max,
          formatter: function (val) {
            return val
          }
        }
      })
      chart.coord({
        transposed: true
      })
      // 定位图标
      let icons = [
        'https://imageysz.yxj.org.cn/1558925023893.png',
        'https://imageysz.yxj.org.cn/1558925001000.png',
        'https://imageysz.yxj.org.cn/1558924953131.png'
      ]
      let arrIcon = [0, 1, 2]
      arrIcon.map(function (obj, i) {
        chart.guide().html({
          position: [obj, -15],
          html:
            '<div style="width: 80px;height: 24px;text-align: center" class="iconTuiStar">' +
            '<img src="' +
            icons[i] +
            '" style="width: 21px;height: 21px;" />' +
            '</div>' +
            '</div></div>'
        })
      })

      // 定位图标 end
      let that = this
      chart.tooltip({
        // custom: true,
        onChange: function onChange (obj) {
          var legend = that.star2Chart.get('legendController').legends
            .bottom[0]

          var tooltipItems = obj.items
          var legendItems = legend.items
          var map = {}
          legendItems.map(function (item) {
            map[item.name] = clone(item)
          })
          tooltipItems.map(function (item) {
            var name = item.name
            var value = item.value
            if (map[name]) {
              map[name].value = value
            }
          })
          that.star2Chart
            .get('legendController')
            .legends.bottom[0].setItems(values(map))
        },
        onHide: function onHide () {
          var legend = that.star2Chart.get('legendController').legends
            .bottom[0]
          legend.setItems(that.star2Chart.getLegendItems().country)
        }
      })
      chart.legend({
        custom: true,
        items: null
      })

      //   chart.tooltip(false);
      chart.axis('value', false)
      chart.axis('name', {
        label: function label (text, index, total) {
          const cfg = {
            // rotate: -Math.PI / 4.5,
            textAlign: 'end',
            textBaseline: 'middle',
            offsetX: 0
          }
          cfg.text = text
          //   cfg.text = data.nameArrTui[index] + " " + text;
          return cfg
        },

        tickLine: {
          alignWithLabel: false,
          length: 0
        },
        line: {
          lineWidth: 0
        }
      })

      chart
        .interval()
        .position('name*value')
        .color('type', function (val) {
          return colors[val]
        })
        .adjust('stack')
        .shape('text')
      chart.render()
    },
    // 轮播图跳转
    async linkAddressGo (url, sourceId) {
      let linkAddressUrl = url.split('?')[0]
      let outLinkPath = linkAddressUrl.split('#/')[1]
      let outLinkType
      switch (outLinkPath) {
        case 'articleDetail':
          outLinkType = 1
          break
        case 'meetingDetail':
          outLinkType = 2
          break
        case 'videoDetail':
          outLinkType = 3
          break
        case 'survey':
          outLinkType = 4
          break
        default:
          outLinkType = 6
          break
      }

      var encrypt = storage.get(process.env.VUE_APP_STORAGE_NAME).encrypt || ''
      let data = {
        url: url,
        type: outLinkType
      }
      try {
        // banner跳转上报
        var res = await this.reportSourceUrl(data)
      } catch (error) {
        Toast(error)
        return
      }

      if (linkAddressUrl.indexOf('/#/survey') >= 0) {
        var paramsStr = url.split('?')[1]
        var params = []
        params = paramsStr.split('&')
        var param = []
        var paramObj = new Object()

        for (var i = 0; i < params.length; i++) {
          param = params[i].split('=')
          paramObj[param[0]] = param[1]
        }
        var userId = storage.get('amy').userId || ''
        var encrypt = storage.get('amy').encrypt || ''
        let data = {
          userId: userId,
          code: paramObj.code
        }
        try {
          var res1 = await this.research(data)
          let isFlag = res.body.data.isFlag
          if (isFlag == 1) {
            Toast('您已参与该调研')
          } else {
            location.href = url + '&refCode=' + sourceId + "&sourceType='A'"
          }
        } catch (error) {
          Toast(error)
        }
      } else {
        this.source = '10'
        if (url.indexOf('?') >= 0) {
          location.href = url + '&source=' + this.source
        } else {
          location.href = url + '?source=' + this.source
        }
      }
    }
  },
  components: {
    Toast,
    Swipe,
    SwipeItem,
    yDialog
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 333;
}
.activityEntry {
  position: fixed;
  right: 0;
  bottom: 15%;
  z-index: 666;
}
.activityEntryNLXF {
  width: 1.44rem !important;
}
.activityEntry_wrap {
  width: 0.5rem;
  height: 0.4rem;
  transition: 0.1s all ease;
  background: rgba(216, 216, 216, 1);
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  align-items: center;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
}
.activityEntry_cicle {
  width: 0.33rem;
  height: 0.33rem;
  border-radius: 50%;
  //   background: #39b9d4;
  background: url(src1/assets/819/activityEntry_cicle.png) no-repeat no-repeat;
  background-size: 100% 100%;
  font-size: 0.12rem;
  color: #fff;
}
.activityEntry_txt {
  flex: 1;
  color: #fff;
  margin-left: 0.1rem;
}
.tuiHelp {
  //   background:rgba(134,115,255,1) url('@{icon}/paihangbang.png') no-repeat 5px center;
  background: url(src1/assets/icons/tuiHelp.png) no-repeat no-repeat;
  background-size: 100% 100%;
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: top;
  display: inline-block;
}
.tabWrap {
  .tab_item {
    width: 39px;
    font-size: 0.12rem;
    height: 24px;
    background: #fff;
    border: 1px solid #f1f1f1;
    line-height: 24px;
    &.active {
      background: rgb(241, 241, 241);
      color: #746ff3;
      border: 0;
    }
    &:first-child {
      border-right: 0;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      border-left: 0;
    }
  }
}
.starMe {
  //   top: -0.5rem;
}

.indexWrap {
  height: 100%;
  overflow: auto;
  background: #fff;
  // padding-bottom: 0.45rem;
  .topSearch {
    padding: 0.3rem 0.1rem;
    height: 0.45rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.12rem;
    .searchBar {
      width: 80%;
      height: 0.3rem;
      background: #f2f2f2;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.15rem;
      color: #bbb;
      .serchIcon {
        width: 0.1rem;
        height: 0.1rem;
        margin-right: 0.1rem;
        background: url("src1/assets/iconD/search.png") no-repeat center;
        background-size: 0.1rem 0.1rem;
      }
    }
  }
  .index_wrap {
    position: relative;
    .swiper_index {
      overflow: hidden;
      width: 100%;
      height: 1.5rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .month {
    .title {
      padding: 0 0.1rem;
      height: 0.5rem;
      h3 {
        font-size: 18px;
        font-weight: normal;
      }
      span {
        padding-right: 0.2rem;
        font-size: 10px;
        background: url("src1/assets/iconD/right.png") no-repeat right;
        background-size: 0.08rem 0.1rem;
      }
    }
  }

  .customer {
    .title {
      padding: 0 0.1rem;
      height: 0.5rem;
      h3 {
        font-size: 18px;
        font-weight: normal;
      }
    }
  }

  .linkBox {
    padding-top: 0.2rem;
    padding-bottom: 0.25rem;
    .read {
      margin-right: 20px;
    }
    .box {
      text-align: center;
      width: 135px;
      height: 64px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 20px 0px rgba(124, 149, 254, 0.3);
      border-radius: 4px;
      font-size: 10px;
      line-height: 14px;
      color: #4a4a4a;
      i {
        display: block;
        width: 30px;
        height: 30px;
        margin: 7px auto;
        margin-bottom: 6px;
        border-radius: 50%;
        box-shadow: 0px 2px 10px 0px rgba(124, 149, 255, 1);
      }
    }
    .read {
      i {
        background: url("src1/assets/iconD/noread.png") no-repeat center;
        background-size: 42px 42px;
      }
    }
    .push {
      i {
        background: url("src1/assets/iconD/nopush.png") no-repeat center;
        background-size: 42px 42px;
      }
    }
  }
}
/deep/ .mint-swipe {
  overflow: hidden !important;
}
.my {
  width: 1rem;
  height: 0.32rem;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0.16rem 0 0 0.16rem;
  position: absolute;
  right: 0;
  top: 0.27rem;
  z-index: 99;
  color: #fff;
  text-align: center;
  line-height: 0.32rem;
  font-size: 14px;
  span {
    position: absolute;
    width: 0.1rem;
    height: 0.1rem;
    line-height: 0.2rem;
    background: red;
    border-radius: 50%;
    color: #fff;
    right: 4%;
    top: 0;
    bottom: 0;
    margin: auto 0;
    text-align: center;
  }
}
.circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid orange;
  line-height: 40px;
  text-align: center;
  color: #fff;
}
#star {
  //   width: 300px;
}
.starMe {
  border-top: 10px solid #f5f5f5;
}
.starBox {
  width: 95%;
  margin: 0 auto;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.09);
  border-radius: 8px;
}
.first819tk {
  width: 2.7rem;
  height: 3.35rem;
  width: 2.7rem;
  //   height: 3.74rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: absolute;
  z-index: 6666;
  left: 50%;
  transform: translate(-50%, 0);
  top: 20%;
  .bg_819 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  //   background: url(../../assets/819/indexTk_bg.png) no-repeat no-repeat;
  //   background-size: 100% 100%;
  //   position: absolute;
  //   z-index: 7777;
  //   left: 50%;
  //   transform: translate(-50%, 0);
  //   top: 20%;
  //   padding-top: 2rem;
  &_desc {
    color: #fff;
    font-size: 0.13rem;
    margin-top: 1.3rem;
    margin-bottom: 0.2rem;
  }
  &_footer {
    width: 1.2rem;
    height: 0.28rem;
    background: url(src1/assets/819/indexTk_btn.png) no-repeat no-repeat;
    background-size: contain;
    color: #49b8ff;
    line-height: 0.28rem;
    text-align: center;
  }
}
</style>
