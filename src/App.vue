<template>
  <div id="app">
		<header-common></header-common>
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
  </div>
</template>

<script>
import HeaderCommon from 'components/header-common/header-common'
export default {
	name: 'app',
	components: {
		HeaderCommon
	}
}
</script>

<style>
</style>
