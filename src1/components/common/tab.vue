<template>
	<div class="tab">
		<footer class="footer cf">
			<div class="tab-item" @click="link(1)">
				<i class="icon icon-information" :class="{'icon-information-active':active === 1}"></i>
				<span :class="{'blue':active === 1}">百家讲坛集</span>
			</div>
			<div class="tab-item" @click="link(2)">
				<i class="icon icon-pulpit" :class="{'icon-pulpit-active':active === 2}"></i>
				<span :class="{'blue':active === 2}">心时讯汇编</span>
			</div>
			<div class="tab-item" @click="link(3)">
				<i class="icon icon-index" :class="{'icon-index-active':active === 3}"></i>
			</div>
			<div class="tab-item" @click="link(4)">
				<i class="icon icon-cases" :class="{'icon-cases-active':active === 4}"></i>
				<span :class="{'blue':active === 4}">青年演说家</span>
			</div>
			<div class="tab-item" @click="link(5)">
				<i class="icon icon-meeting" :class="{'icon-meeting-active':active === 5}"></i>
				<span :class="{'blue':active === 5}">学术同期声</span>
				<i class="new"></i>
			</div>
		</footer>
	</div>

</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      active: 3,
      show: false,
      show_timer: null
    }
  },
  methods: {
    ...mapMutations([
      'showLoad', 'hideLoad'
    ]),
    link (n) {
      n = Number(n)
      if (this.active === n) return false
      switch (n) {
        case 1 :
          if (this.active !== n) {
            this.showLoad()
          }
          this.$router.push({ path: '/information' })
          // this.tabChange(1);
          break
        case 2 :
          if (this.active !== n) {
            this.showLoad()
          }
          this.$router.push({ path: '/newsletter' })
          break
        case 3 :
          if (this.active !== n) {
            this.showLoad()
          }
          this.$router.push({ path: '/' })
          break
        case 4 :
          if (this.active !== n) {
            this.showLoad()
          }
          this.$router.push({ path: '/youngspeakers' })
          break
        case 5 :
          if (this.active !== n) {
            this.showLoad()
          }
          this.$router.push({ path: '/academicsync' })
          break
      }
      this.active = n
    },
    shown () {
      this.show = true
      clearTimeout(this.show_timer)
      this.show_timer = setTimeout(() => {
        this.show = false
      }, 1000)
    }
  },
  mounted () {
    	const url = this.$route.path
    switch (url) {
      case '/information':
        this.active = 1
        break
      case '/newsletter':
        this.active = 2
        break
      case '/':
        this.active = 3
        break
      case '/youngspeakers':
        this.active = 4
        break
      case '/pkPractice':
        this.active = 4
        break
      case '/academicsync':
        this.active = 5
        break
    }
  	},
  watch: {
    $route (nv, ov) {
      let position = nv.path
      switch (position) {
        case '/information':
    			this.active = 1
    			break
    			case '/newsletter':
    			this.active = 2
    			break
    			case '/':
    			this.active = 3
    			break
        case '/youngspeakers':
    			this.active = 4
    			break
        case '/pkPractice':
    			this.active = 4
    			break
        case '/academicsync':
    			this.active = 5
    			break
      }
    }
  },
  destroyed () {
    let _this = this
    clearTimeout(_this.show_timer)
  }
}
</script>
<style lang="less" scoped>
	@import 'src1/styletab.less';

	// .new {
	// 	width: 15px;
	// 	height: 15px;
	// 	background: url('../../assets/icons/new.png') no-repeat center center;
	// 	background-size: 100% 100%;
	// 	position: absolute;
	// 	right: 5px;
	// 	top: 5px;
	// }
</style>
