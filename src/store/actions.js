import * as types from './types'
import { playMode } from "common/js/config";
import { shuffle } from "common/js/util";

export const selectPlay = ({state, commit}, {list, index}) => {
	commit(types.SET_SEQUENCE_LIST, list)
	if (state.mode === playMode.random) {
		let randomList = shuffle(list)
		commit(types.SET_PLAYLIST, randomList)
		index = findIndex(randomList, list[index])
	} else {
		commit(types.SET_PLAYLIST, list)
	}
	commit(types.SET_CURRENT_INDEX, index)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

export function randomPlay({state, commit}, {list}) {
	commit(types.SET_MODE, playMode.random)
	commit(types.SET_SEQUENCE_LIST, list)
	commit(types.SET_PLAYLIST, shuffle(list))
	commit(types.SET_CURRENT_INDEX, 0	)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

function findIndex(list, song) {
	return list.findIndex(item => {
		return item.id === song.id
	})
}