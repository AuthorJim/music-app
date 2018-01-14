<template>
	<transition name="slider">
		<music-list :rank="rank" :songs="songList" :title="title" :bgImage="bgImage"></music-list>
	</transition>
</template>

<script>
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getSongList } from "api/rank";
import { createSong } from "common/js/song";

export default {
  data() {
    return {
			songList: [],
			rank: true
    };
  },
  activated() {
    this.getSong();
  },
  computed: {
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
			if (this.songList.length) {
				return this.songList[0].image
			}
      return this.topList.picUrl;
    },
    ...mapGetters(["topList"])
  },
  methods: {
    getSong() {
      if (!this.topList.id) this.$router.back();
      getSongList(this.topList.id).then(res => {
        this.songList = this._normalizeSong(res.songlist);
      });
    },
    _normalizeSong(list) {
      let ret = [];
      list.forEach(item => {
        const { data } = item;
        if (data.songid && data.albumid) {
          ret.push(createSong(data));
        }
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active {
	transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
	transform: translate3d(100%, 0, 0);
}
</style>


