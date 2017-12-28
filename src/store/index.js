import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mustations";
import state from './state'
import * as getters from "./getters";
// import * as actions from "./actions";

import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'porduct'

export default new Vuex.Store({
	state,
	mutations,
	getters,
	// actions,
	strict: debug,
	plugins: debug ? [createLogger()] : []
})