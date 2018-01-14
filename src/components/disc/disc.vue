<template>
	<transition name="slider">
		<music-list :title="title" :bgImage="bgImage"></music-list>
	</transition>
</template>

<script>
import MusicList from "components/music-list/music-list";
import {mapGetters} from 'vuex';
import {getDiscList} from 'api/recommend'

export default {
	created () {
		this.getSongList()
	},
	computed: {
		title() {
			return this.disc.dissname
		},
		bgImage() {
			return this.disc.imgurl
		},
		...mapGetters([
			'disc'
		])
	},
	methods: {
		getSongList() {
			getDiscList(this.disc.dissid).then(res => {
				console.log(res);
				
			})
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


