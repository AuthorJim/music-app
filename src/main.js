// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

// 引入样式文件
import 'common/stylus/index.styl'

// 设置图片懒加载
Vue.use(VueLazyload, {
	loading: require('common/image/default.png'),
	attempt: 1
})

Vue.config.productionTip = false

// 消除移动端点击300ms延迟问题

/* eslint-disable no-new */
new Vue({
  el: '#app',
	router,
	store,
  template: '<App/>',
  components: { App }
})
