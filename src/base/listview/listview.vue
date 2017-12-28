<template>
  <scroll :data="singers" :probeType="probeType" :listenScroll="listenScroll" class="listview" ref="listview" @scroll="scroll">
    <ul>
      <li class="list-group" v-for="singer in singers" ref="listGroup">
        <h2 class="list-group-title" ref="listTitle">{{singer.title}}</h2>
        <div class="list-group-item" v-for="list in singer.item" @click="selectItem(list)">
          <img class="avatar" v-lazy="list.avatar">
          <div class="name">{{list.name}}</div>
        </div>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item" v-for="(item, i) in shortcutList" :data-index="i" :class="{current: currentIndex === i}">{{item}}</li>
      </ul>
    </div>
		<div class="list-fixed" v-show="fixedTitle" ref="fixedTop">
			<h2 class="fixed-title">{{fixedTitle}}</h2>
		</div>
    <div class="loading-container" v-if="!this.singers.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { getData } from "common/js/dom";

const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;

export default {
  props: {
    singers: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      currentIndex: 0,
      scrollY: -1,
      diff: 0
    };
  },
  created() {
    this.touch = {};
    this.listHeight = [];
    this.probeType = 3;
    this.listenScroll = true;
  },
  computed: {
    shortcutList() {
      return this.singers.map(item => {
        return item.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY >= 0) return "";
      return this.singers[this.currentIndex]
        ? this.singers[this.currentIndex].title
        : "";
    }
  },
  watch: {
    scrollY(newY) {
      const { listHeight } = this;
      for (let i = 0; i < listHeight.length; i++) {
        const height1 = listHeight[i];
        const height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
    },
    singers() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    diff(newDiff) {
      let fixedTop =
        newDiff > 0 && newDiff < TITLE_HEIGHT ? newDiff - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) return;
      this.fixedTop = fixedTop;
      this.$refs.fixedTop.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, "index");
      this.touch.y1 = e.touches[0].pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e) {
      this.touch.y2 = e.touches[0].pageY;
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT || 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    // 向外传递当前被点击的歌手id
    selectItem(item) {
      this.$emit("selected", item);
    },
    _scrollTo(index) {
      index = parseInt(index);
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() {
      const listGroup = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < listGroup.length; i++) {
        const element = listGroup[i];
        height += element.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.listview {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: $color-background;

	.list-group {
		padding-bottom: 30px;

		.list-group-title {
			height: 30px;
			line-height: 30px;
			padding-left: 20px;
			font-size: $font-size-small;
			color: $color-text-l;
			background: $color-highlight-background;
		}

		.list-group-item {
			display: flex;
			align-items: center;
			padding: 20px 0 0 30px;

			.avatar {
				width: 50px;
				height: 50px;
				border-radius: 50%;
			}

			.name {
				margin-left: 20px;
				color: $color-text-l;
				font-size: $font-size-medium;
			}
		}
	}

	.list-shortcut {
		position: absolute;
		z-index: 30;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		padding: 20px 0;
		border-radius: 10px;
		text-align: center;
		background: $color-background-d;
		font-family: Helvetica;

		.item {
			padding: 3px;
			line-height: 1;
			color: $color-text-l;
			font-size: $font-size-small;

			&.current {
				color: $color-theme;
			}
		}
	}

	.list-fixed {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;

		.fixed-title {
			height: 30px;
			line-height: 30px;
			padding-left: 20px;
			font-size: $font-size-small;
			color: $color-text-l;
			background: $color-highlight-background;
		}
	}

	.loading-container {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
}
</style>
