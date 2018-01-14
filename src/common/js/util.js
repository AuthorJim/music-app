export function shuffle(list) {
	let ret = list
	for (let i = 0; i < ret.length; i++) {
		let j = getRandom(0, i)
		let t = ret[i]
		ret[i] = ret[j]
		ret[j] = t
	}
	return ret
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
