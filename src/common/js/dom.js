export function addClass(el, className) {
	if (hasClass(el, className)) return 
	let ret = el.className.split(',')
	ret.push(className)
	el.className = ret.join(' ')
}

export function hasClass(el, className) {
	const reg = new RegExp(`(^|\\s)${className}(\\s|$)`)
	return reg.test(el.className)
}