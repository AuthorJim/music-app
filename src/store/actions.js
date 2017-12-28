import * as types from './types'

export const selectPlay = ({state, commit}, {list, index}) => {
	commit(types.SET_SEQUENCE_LIST, list)
	commit(types.SET_PLAYLIST, list)
	commit(types.SET_CURRENT_INDEX, index)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}