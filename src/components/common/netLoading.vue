<template>
	<div class="loading">
		<div data-flex="main:center cross:center" class="loading-wrap">
			<Loading size="60px" />
		</div>
	</div>
</template>
<style lang="less">
	.loading{
	    width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top:0%;
        z-index: 999;
    }
    .loading-wrap{
        width: 100%;
        height: 100%;
    }
</style>
<script>
import { Loading } from 'vant'
export default {
  components: { Loading }
}
</script>
