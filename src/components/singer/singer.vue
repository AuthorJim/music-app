<template>
	<div class="singer">
		<listview :singers="singers" @selected="selected"></listview>
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
	</div>
</template>

<script>
import { getSinger } from "api/singer";
import { ERR_OK } from "api/config";
import { mapMutations } from "vuex";
import Singer from "common/js/singer";
import Listview from "base/listview/listview";

const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;

export default {
  data() {
    return {
      singers: []
    };
  },
  created() {
    this.getSingerList();
  },
  methods: {
    getSingerList() {
      getSinger().then(res => {
        if (res.code === ERR_OK) {
					this.singers = this._normalizeSinger(res.data.list);
        }
      });
		},
		selected(item) {
			this.$router.push({
				path: `/singer/${item.id}`
			})
			this.setSinger(item)
		},
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          item: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.item.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }
        let key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            item: []
          };
        }
        map[key].item.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        );
      });
      let ret = [];
      let hot = [];
      for (let k in map) {
        let val = map[k];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
      return hot.concat(ret);
		},
		...mapMutations({
			setSinger: 'SET_SINGER'
		})
	},
	components: {
		Listview
	}
};
</script>

<style lang="stylus" scoped>
.singer {
	position: fixed;
	top: 88px;
	bottom: 0;
	width: 100%;
}
</style>
