<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen" ref="normalPlayer">
        <div class="background">
          <img :src="currentSong.image" alt="" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="minimize">
            <i class="icon-back"></i>
          </div>
          <h2 class="title">{{currentSong.name}}</h2>
          <h3 class="subtitle">{{currentSong.singer}}</h3>
        </div>
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img :src="currentSong.image" class="image" alt="">
              </div>
            </div>
						<div class="playing-lyric-wrapper">
							<div class="playing-lyric">{{playingLyric}}</div>
						</div>
          </div>
					<scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
						<div class="lyric-wrapper">
							<div v-if="currentLyric">
								<p ref="lyricLine" :class="{'current': currentLineNum === index}" v-for="(line, index) in currentLyric.lines" class="text">{{line.txt}}</p>
							</div>
						</div>
					</scroll>
        </div>
        <div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class="{'active': currentShow === 'cd'}"></span>
						<span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
					</div>
          <div class="progress-wrapper">
            <div class="time time-l">{{_normalizeDuration(currentTime)}}</div>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="resetPercent"></progress-bar>
            </div>
            <div class="time time-r">{{_normalizeDuration(currentSong.duration)}}</div>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="playModeIcon" @click="togglePlayMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" @click="togglePlay">
              <i :class="iconCls"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" @click="maximize" v-show="!fullScreen">
        <div class="icon">
          <img :src="currentSong.image" class="img" width="40" height="40" alt="">
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control" @click.stop="togglePlay">
					<progress-circle :radius="32" :percent="percent">
						<i class="icon-mini" :class="miniPlayIcon"></i>
					</progress-circle>
        </div>
        <div class="control" @click="togglePlay">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @ended="endSong" @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
import animations from "create-keyframe-animation";
import ProgressBar from "base/progress-bar/progress-bar";
import ProgressCircle from "base/progress-circle/progress-circle";
import { mapGetters, mapMutations } from "vuex";
import { playMode } from "common/js/config";
import { shuffle } from "common/js/util";
import Lyric from "lyric-parser";
import Scroll from "base/scroll/scroll";

export default {
  data() {
    return {
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: "cd",
      playingLyric: ""
    };
  },
  created() {
    this.touch = {};
  },
  computed: {
    cdCls() {
      return this.playing ? "play" : "play pause";
    },
    iconCls() {
      return this.playing ? "icon-play" : "icon-pause";
    },
    playModeIcon() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop ? "icon-loop" : "icon-random";
    },
    miniPlayIcon() {
      return this.playing ? "icon-play-mini" : "icon-pause-mini";
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters([
      "fullScreen",
      "currentSong",
      "playlist",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList"
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) return;
      if (this.currentLyric) this.currentLyric.stop();
      setTimeout(() => {
        if (this.playing) {
          this.$refs.audio.play();
          this.getLyric();
        }
      }, 1000);
    },
    playing(newPlaying) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    }
  },
  methods: {
    // 歌词相关
    middleTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.startY = e.touches[0].pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) return;
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const deltaY = e.touches[0].pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, deltaX + left)
      );
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.lyricList.$el.style.transitionDuration = 0;
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style.transitionDuration = 0;
    },
    middleTouchEnd() {
      let offsetWidth;
      let opacity;
      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          this.currentShow = "lyric";
          opacity = 0;
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      const duration = 300;
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.lyricList.$el.style.transitionDuration = `${duration}ms`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style.transitionDuration = `${duration}ms`;
    },
    getLyric() {
      this.currentSong
        .getSongLyric()
        .then(res => {
          this.currentLyric = new Lyric(res, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
        })
        .catch(() => {
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentLineNum = 0;
        });
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEL = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEL, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    // audio播放相关
    endSong() {
      this.mode === playMode.loop ? this.loop() : this.next();
    },
    // 获取播放时间
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    // 下一首
    next() {
      if (this.playlist.length == 1) {
        this.loop();
      } else {
        this.currentIndex === this.playlist.length - 1
          ? this.setCurrentIndex(0)
          : this.setCurrentIndex(this.currentIndex + 1);
      }
    },
    // 上一首
    prev() {
			if (this.playlist.length === 1) {
				this.loop()
			} else {
				this.currentIndex === 0
					? this.setCurrentIndex(this.playlist.length - 1)
					: this.setCurrentIndex(this.currentIndex - 1);
			}
    },
    // 循环播放
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    togglePlay() {
      this.setPlaying(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    // 切换播放模式
    togglePlayMode() {
      const mode = (this.mode + 1) % 3;
      this.setMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlaylist(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => item.id === this.currentSong.id);
      this.setCurrentIndex(index);
    },
    resetPercent(percent) {
      const time = this.currentSong.duration * percent;
      this.$refs.audio.currentTime = time;
      this.playing ? "" : this.togglePlay();
      if (this.currentLyric) {
        this.currentLyric.seek(time * 1000);
      }
    },
    minimize() {
      this.setFullScreen(false);
      this.$refs.normalPlayer.style.display = "none";
    },
    maximize() {
      this.setFullScreen(true);
    },
    // 播放器展开收起动画相关
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      const animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: "translate3d(0, 0, 0) scale(1.1)"
        },
        100: {
          transform: "translate3d(0, 0, 0) scale(1.0)"
        }
      };

      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });

      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style.transform = `translate(${x}px, ${y}px, 0) scale${scale}`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.animation = "";
      this.$refs.cdWrapper.style.transform = "";
    },
    // 格式化时间
    _normalizeDuration(time) {
      let hour, minute, second;
      second = Math.floor(time % 60);
      let delta = Math.floor(time / 60);
      if (delta >= 60) {
        hour = Math.floor(delta / 60);
        minute = Math.floor(delta % 60);
      } else {
        minute = delta;
      }
      if (hour) {
        hour = hour >= 10 ? hour : `0${hour}`;
      }
      minute = minute >= 10 ? minute : `0${minute}`;
      second = second >= 10 ? second : `0${second}`;
      return hour ? `${hour}:${minute}:${second}` : `${minute}:${second}`;
    },
    // 获取动画改变时的位置与缩放
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingTop = 80;
      const paddingBottom = 30;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - paddingBottom - width / 2;
      return {
        x,
        y,
        scale
      };
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlaying: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setMode: "SET_MODE",
      setPlaylist: "SET_PLAYLIST"
    })
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
	.normal-player {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 150;
		background: $color-background;

		.background {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			opacity: 0.6;
			filter: blur(20px);
		}

		.top {
			position: relative;
			margin-bottom: 25px;

			.back {
				position: absolute;
				top: 0;
				left: 6px;
				z-index: 50;

				.icon-back {
					display: block;
					padding: 9px;
					font-size: $font-size-large-x;
					color: $color-theme;
					transform: rotate(-90deg);
				}
			}

			.title {
				width: 70%;
				margin: 0 auto;
				line-height: 40px;
				text-align: center;
				no-wrap();
				font-size: $font-size-large;
				color: $color-text;
			}

			.subtitle {
				line-height: 20px;
				text-align: center;
				font-size: $font-size-medium;
				color: $color-text;
			}
		}

		.middle {
			position: fixed;
			width: 100%;
			top: 80px;
			bottom: 170px;
			white-space: nowrap;
			font-size: 0;

			.middle-l {
				display: inline-block;
				vertical-align: top;
				position: relative;
				width: 100%;
				height: 0;
				padding-top: 80%;

				.cd-wrapper {
					position: absolute;
					left: 10%;
					top: 0;
					width: 80%;
					height: 100%;

					.cd {
						width: 100%;
						height: 100%;
						box-sizing: border-box;
						border: 10px solid rgba(255, 255, 255, 0.1);
						border-radius: 50%;

						&.play {
							animation: rotate 20s linear infinite;
						}

						&.pause {
							animation-play-state: paused;
						}

						.image {
							position: absolute;
							left: 0;
							top: 0;
							width: 100%;
							height: 100%;
							border-radius: 50%;
						}
					}
				}

				.playing-lyric-wrapper {
					width: 80%;
					margin: 30px auto 0 auto;
					overflow: hidden;
					text-align: center;

					.playing-lyric {
						height: 20px;
						line-height: 20px;
						font-size: $font-size-medium;
						color: $color-text-l;
					}
				}
			}

			.middle-r {
				display: inline-block;
				vertical-align: top;
				width: 100%;
				height: 100%;
				overflow: hidden;

				.lyric-wrapper {
					width: 80%;
					margin: 0 auto;
					overflow: hidden;
					text-align: center;

					.text {
						line-height: 32px;
						color: $color-text-l;
						font-size: $font-size-medium;

						&.current {
							color: $color-text;
						}
					}
				}
			}
		}

		.bottom {
			position: absolute;
			bottom: 50px;
			width: 100%;

			.dot-wrapper {
				text-align: center;
				font-size: 0;

				.dot {
					display: inline-block;
					vertical-align: middle;
					margin: 0 4px;
					width: 8px;
					height: 8px;
					border-radius: 50%;
					background: $color-text-l;

					&.active {
						width: 20px;
						border-radius: 5px;
						background: $color-text-ll;
					}
				}
			}

			.progress-wrapper {
				display: flex;
				align-items: center;
				width: 80%;
				margin: 0px auto;
				padding: 10px 0;

				.time {
					color: $color-text;
					font-size: $font-size-small;
					flex: 0 0 30px;
					line-height: 30px;
					width: 30px;

					&.time-l {
						text-align: left;
						padding-right: 5px;
					}

					&.time-r {
						text-align: right;
						padding-left: 5px;
					}
				}

				.progress-bar-wrapper {
					flex: 1;
				}
			}

			.operators {
				display: flex;
				align-items: center;

				.icon {
					flex: 1;
					color: $color-theme;

					&.disable {
						color: $color-theme-d;
					}

					i {
						font-size: 30px;
					}
				}

				.i-left {
					text-align: right;
				}

				.i-center {
					padding: 0 20px;
					text-align: center;

					i {
						font-size: 40px;
					}
				}

				.i-right {
					text-align: left;
				}

				.icon-favorite {
					color: $color-sub-theme;
				}
			}
		}

		&.normal-enter-active, &.normal-leave-active {
			transition: all 0.4s;

			.top, .bottom {
				transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
			}
		}

		&.normal-enter, &.normal-leave-to {
			opacity: 0;

			.top {
				transform: translate3d(0, -100px, 0);
			}

			.bottom {
				transform: translate3d(0, 100px, 0);
			}
		}
	}

	.mini-player {
		display: flex;
		align-items: center;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 180;
		width: 100%;
		height: 60px;
		background: $color-highlight-background;

		&.mini-enter-active, &.mini-leave-active {
			transition: all 0.4s;
		}

		&.mini-enter, &.mini-leave-to {
			opacity: 0;
		}

		.icon {
			flex: 0 0 40px;
			width: 40px;
			padding: 0 10px 0 20px;

			img {
				border-radius: 50%;

				&.play {
					animation: rotate 10s linear infinite;
				}

				&.pause {
					animation-play-state: paused;
				}
			}
		}

		.text {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			line-height: 20px;
			overflow: hidden;

			.name {
				margin-bottom: 2px;
				no-wrap();
				font-size: $font-size-medium;
				color: $color-text;
			}

			.desc {
				no-wrap();
				font-size: $font-size-small;
				color: $color-text-d;
			}
		}

		.control {
			flex: 0 0 30px;
			width: 30px;
			padding: 0 10px;

			.icon-play-mini, .icon-pause-mini, .icon-playlist {
				font-size: 30px;
				color: $color-theme-d;
			}

			.icon-mini {
				font-size: 32px;
				position: absolute;
				left: 0;
				top: 0;
			}
		}
	}
}

@keyframes rotate {
	0% {
		transform: rotate(0);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
