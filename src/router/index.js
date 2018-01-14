import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
		{
			path: '/',
			redirect: '/recommend'
		},
		{
			path: '/recommend',
			name: 'recommend',
			component: resolve => require(['components/recommend/recommend'], resolve),
			children: [
				{
					path: ':id',
					component: resolve => require(['components/disc/disc'], resolve)
				}
			]
		},
		{
			path: '/singer',
			name: 'singer',
			component: resolve => require(['components/singer/singer'], resolve),
			children: [
				{
					path: ':id',
					component: resolve => require(['components/singer-detail/singer-detail'], resolve)
				}
			]
		},
		{
			path: '/rank',
			name: 'rank',
			component: resolve => require(['components/rank/rank'], resolve)
		},
		{
			path: '/search',
			name: 'search',
			component: resolve => require(['components/search/search'], resolve)
		},
  ]
})
