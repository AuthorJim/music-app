<template>
	<transition name="slider">
		<music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
	</transition>
</template>

<script>
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { ERR_OK } from "api/config";
import { getSingerDetail } from "api/singer";
import { createSong } from "common/js/song";

export default {
	data () {
		return {
			songs: []
		}
	},
  activated () {
		this._getSinger();
	},
  computed: {
		title() {
			return this.singer.name
		},
		bgImage() {
			return this.singer.avatar
		},
    ...mapGetters(["singer"])
  },
  methods: {
    _getSinger() {
      if (!this.singer.id) {
        this.$router.push("/singer");
			}
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
					this.songs = this._normalizeSinger(res.data.list)
				}
      });
    },
    _normalizeSinger(list) {
      let ret = [];
      list.forEach(item => {
        const { musicData } = item;
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData));
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
@import '~common/stylus/variable';

.slide-enter-active, .slide-leave-active {
	transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
	transform: translate3d(100%, 0, 0);
}
</style>

