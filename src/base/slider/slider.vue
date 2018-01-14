<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
			<slot></slot>
		</div>
		<div class="dots">
			<span class="dot" v-for="(item, i) in dots" :class="{active: currentIndex === i}"></span>
		</div>
	</div>
</template>

<script>
import BScroll from "better-scroll";
import { addClass } from "common/js/dom";
export default {
	props: {
		loop: {
			type: Boolean,
			default: true
		},
		autoPlay: {
			type: Boolean,
			default: true
		},
		interval: {
			type: Number,
			default: 4000
		}
	},
	data () {
		return {
			dots: [],
			currentIndex: 0,
			isResize: false
		}
	},
	// 必须在组件的dom已经ready的时候，才能初始化better-scroll
	mounted () {
		// 保证dom渲染成功的延迟设置
		setTimeout(() => {
			this._setSliderWidth()
			this.initDots()
			this.initSlider()
			if (this.autoPlay) {
				this._play()
			}
			window.addEventListener('resize', () => {
				if (!this.slider) return
				this._setSliderWidth(true)
				this.slider.refresh()
			})
		}, 20);
	},
	methods: {
		// 设置slider宽度
		_setSliderWidth(isResize) {
			// 获取此slider容器的所有子节点
			this.children = this.$refs.sliderGroup.children
			let width = 0
			// 获取此slider的dom宽度
			let sliderWidth = this.$refs.slider.clientWidth
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children[i]
				// slider组件本身为每个子节点动态添加slider-item类名，避免与外界组件耦合
				addClass(child, 'slider-item')

				child.style.width = `${sliderWidth}px`
				width += sliderWidth
			}
			if (this.loop && !isResize) {
				width += 2 * sliderWidth
			}
			this.$refs.sliderGroup.style.width = `${width}px`
		},
		// 初始化slider
		initSlider() {
			this.slider = new BScroll(this.$refs.slider, {
				scrollX: true,
				scrollY: false,
				momentum: false,
				snap: true,
				snapLoop: this.loop,
				snapThreshold: 0.3,
				snapSpeed: 400
			})
			this.slider.on('scrollEnd', () => {
				let pageIndex = this.slider.getCurrentPage().pageX
				if (this.loop) {
					pageIndex -= 1
				}
				this.currentIndex = pageIndex
				if (this.autoPlay) {
					clearTimeout(this.timer)
					this._play()
				}
			})
		},
		initDots() {
			this.dots = new Array(this.children.length)
		},
		_play() {
			let pageIndex = this.currentIndex + 1
			if (this.loop) {
				pageIndex += 1
			}
			this.timer = setTimeout(() => {
				this.slider.goToPage(pageIndex, 0, 400)
			}, this.interval);
		}
	},
	destroyed () {
		clearTimeout(this.timer)
	}
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.slider
	min-height: 1px
	position: relative
	.slider-group
		overflow: hidden
		white-space: nowrap
		.slider-item
			float: left
			box-sizing: border-box
			overflow: hidden
			text-align: center
			a
				display: block
				width: 100%
				overflow: hidden
				text-decoration: none
			img
				display: block
				width: 100%
	.dots
		position: absolute
		right: 0
		left: 0
		bottom: 12px
		text-align: center
		font-size: 0
		.dot
			display: inline-block
			margin: 0 4px
			width: 8px
			height: 8px
			border-radius: 50%
			background: $color-text-l
			&.active
				width: 20px
				border-radius: 5px
				background: $color-text-ll
</style>


