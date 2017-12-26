<template>
	<div class="recommend">
		<scroll class="recommend-content" :data="musicList" ref="scroll">
			<div>
				<div class="slider-wrapper" v-if="sliders.length > 0">
					<Slider>
						<div v-for="slider in sliders">
							<a :href="slider.linkUrl">
								<img :src="slider.picUrl" alt="" @load="imageLoad">
							</a>
						</div>
					</Slider>
				</div>
				<div class="recommend-list">
					<h2 class="list-title">热门歌单推荐</h2>
					<div class="item" v-for="item in musicList">
						<img class="icon" v-lazy="item.imgurl" alt="">
						<div class="text">
							<h2 class="name">{{item.creator.name}}</h2>
							<p class="desc">{{item.dissname}}</p>
						</div>
					</div>
				</div>
			</div>
		</scroll>
	</div>
</template>

<script>
import { getRecommend, getMusic } from "api/recommend";
import { ERR_OK } from "api/config";
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";

export default {
	data () {
		return {
			sliders: [],
			musicList: []
		}
	},
	created () {
		this.getRecommendList()
		this.getMusicList()
	},
	methods: {
		getRecommendList() {
			getRecommend().then(res => {
				if (res.code === ERR_OK) {
					this.sliders = res.data.slider
				}
			})
		},
		getMusicList() {
			getMusic().then(res => {
				if (res.code === ERR_OK) {
					this.musicList = res.data.list
				}
			})
		},
		imageLoad() {
			if (!this.isLoad) {
				this.isLoad = true
				this.$refs.scroll.refresh()
			}
		}
	},
	components: {
		Slider,
		Scroll
	}
}
	
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.recommend
	position: fixed
	width: 100%
	top: 88px
	bottom: 0
	.recommend-content
		height: 100%
		overflow: hidden
		.slider-wrapper
			position: relative
			width: 100%
			overflow: hidden
		.recommend-list
			.list-title
				height: 65px
				line-height: 65px
				text-align: center
				font-size: $font-size-medium
				color: $color-theme
			.item
				display: flex
				box-sizing: border-box
				align-items: center
				padding: 0 20px 20px 20px
				.icon
					flex: 0 0 60px
					width: 60px
					padding-right: 20px
				.text
					display: flex
					flex-direction: column
					justify-content: center
					flex: 1
					line-height: 20px
					overflow: hidden
					font-size: $font-size-medium
					.name
						margin-bottom: 10px
						color: $color-text
					.desc
						color: $color-text-d
		.loading-container
			position: absolute
			width: 100%
			top: 50%
			transform: translateY(-50%)
</style>
