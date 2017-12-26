---
title: 基于better-scroll的轮播组件（Vue.js）
date: 2017-12-26 11:03:47
tags: 
	- JavaScript
	- Vue
top:
---

[引入better-scroll](https://ustbhuangyi.github.io/better-scroll/)

```bash
npm install better-scroll --save
```

```
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
		loop: {			// 是否循环滚动
			type: Boolean,
			default: true
		},
		autoPlay: {		// 是否自动播放
			type: Boolean,
			default: true
		},
		interval: {		// 滚动间隔时长
			type: Number,
			default: 4000
		}
	},
	data () {
		return {
			dots: [],		// 指示器数据
			currentIndex: 0,	// 当前显示的图片索引
			isResize: false		// 是否更改窗口大小
		}
	},
	// 必须在组件的dom已经ready的时候，才能初始化better-scroll
	mounted () {
		// 保证dom渲染成功的延迟设置
		setTimeout(() => {
			// 初始化滚动容器的宽度
			this._setSliderWidth()
			// 初始化指示器
			this.initDots()
			// 初始化scroll
			this.initSlider()
			// 当自动播放时
			if (this.autoPlay) {
				this._play()
			}
			// 当窗口大小改变时，重新计算滚动容器的宽度，并刷新scroll容器
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

				// 设置每个子节点的宽度
				child.style.width = `${sliderWidth}px`
				// 计算滚动组件的总宽度
				width += sliderWidth
			}
			当循环播放并且窗口大小不变时，为满足循环播放的需求，新建两个子节点
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
			// 监听滚动结束事件
			this.slider.on('scrollEnd', () => {
				当滚动完成时，获取当前页面的index
				let pageIndex = this.slider.getCurrentPage().pageX
				// 由于this.slider.getCurrentPage().pageX方法返回的索引从1开始，所以需要做处理
				if (this.loop) {
					pageIndex -= 1
				}
				// 设置当前索引
				this.currentIndex = pageInde
				// 当自动播放时，首先清除定时器，然后播放
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
			// 设置定时器，调用goToPage方法做轮播图片的跳转
			this.timer = setTimeout(() => {
				this.slider.goToPage(pageIndex, 0, 400)
			}, this.interval);
		}
	}
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.slider
	min-height: 1px
	.slider-group
		position: relative
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



```