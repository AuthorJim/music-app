<template>
  <div id="app">
		<header-common></header-common>
		<tabs></tabs>
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
		<player></player>
  </div>
</template>

<script>
import HeaderCommon from 'components/header-common/header-common'
import Tabs from 'components/tabs/tabs'
import Player from "components/player/player";
export default {
	name: 'app',
	components: {
		HeaderCommon,
		Tabs,
		Player
	}
}
</script>

<style>
</style>
