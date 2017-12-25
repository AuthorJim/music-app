<template>
  <div id="app">
		<header-common></header-common>
		<tabs></tabs>
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
  </div>
</template>

<script>
import HeaderCommon from 'components/header-common/header-common'
import Tabs from 'components/tabs/tabs'
export default {
	name: 'app',
	components: {
		HeaderCommon,
		Tabs
	}
}
</script>

<style>
</style>
