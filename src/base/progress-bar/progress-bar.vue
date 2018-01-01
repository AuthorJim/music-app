<template>
<div class="progress-bar" ref="progressBar" @click="progressClick">
	<div class="bar-inner">
		<div class="progress" ref="progress"></div>
		<div class="progress-btn-wrapper" 
			@touchstart.prevent="progressTouchStart" 
			@touchmove.prevent="progressTouchMove"
			@touchend="progressTouchEnd">
			<div class="progress-btn" ref="progressBtn"></div>
		</div>
	</div>
</div>
</template>

<script>
const PROGRESS_BTN = 16;

export default {
  props: {
    percent: {
      type: Number,
      default: null
    }
  },
  created() {
    this.touch = {};
  },
  watch: {
    percent(newVal) {
      if (newVal >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN;
        const offsetWidth = barWidth * newVal;
        this._setOffset(offsetWidth);
      }
    }
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) return;
      const deltaX = e.touches[0].pageX - this.touch.startX;
      // 为了使按钮不被拖出视窗，设定一个最小值
      const offsetWidth = Math.min(
        Math.max(0, this.touch.left + deltaX),
        this.$refs.progressBar.clientWidth - PROGRESS_BTN
      );
      this._setOffset(offsetWidth);
    },
    progressTouchEnd(e) {
			this.touch.initiated = false;
			this._trigglePercent()	
		},
		progressClick(e) {
			console.log(e);
			
			this._setOffset(e.offsetX)
			this._trigglePercent()
		},
		_trigglePercent() {
			const width = this.$refs.progressBar.clientWidth - PROGRESS_BTN;
			const percent = this.$refs.progress.clientWidth / width
			this.$emit('percentChange', percent)
		},
    _setOffset(width) {
      this.$refs.progress.style.width = `${width}px`;
      this.$refs.progressBtn.style.transform = `translate3d(${width}px, 0, 0)`;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.progress-bar {
	height: 30px;

	.bar-inner {
		position: relative;
		top: 13px;
		height: 4px;
		background: rgba(0, 0, 0, 0.3);

		.progress {
			position: absolute;
			height: 100%;
			background: $color-theme;
		}

		.progress-btn-wrapper {
			position: absolute;
			left: -8px;
			top: -13px;
			width: 30px;
			height: 30px;

			.progress-btn {
				position: relative;
				top: 7px;
				left: 7px;
				box-sizing: border-box;
				width: 16px;
				height: 16px;
				border: 3px solid $color-text;
				border-radius: 50%;
				background: $color-theme;
			}
		}
	}
}
</style>


