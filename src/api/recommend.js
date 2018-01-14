import axios from "axios";
import jsonp from 'common/js/jsonp'
import { commonParams, options } from "./config";

export function getRecommend() {
	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
	const data = Object.assign({}, commonParams, {
		uin: 0,
		platform: 'h5',
		needNewCode: 1
	})
	return jsonp(url, data, options)
}

export function getMusic() {
	const url = '/getDiscList'
	const data = Object.assign({}, commonParams, {
		picmid: 1,
		rnd: Math.random(),
		loginUin: 0,
		hostUin: 0,
		format: 'json',
		platform: 'yqq',
		categoryId: 10000000,
		sortId: 5,
		sin: 0, 
		ein: 29
	})
	return axios.get(url, {params: data}).then(res => {
		return Promise.resolve(res.data)
	})
}

export function getDiscList(disstid) {
  const url = '/getcdList'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return axios.get(url, {params: data}).then(res => {
		return Promise.resolve(res.data)
	})
}

// export function getDiscList(disstid) {
//   const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

//   const data = Object.assign({}, commonParams, {
//     disstid,
//     type: 1,
//     json: 1,
//     utf8: 1,
//     onlysong: 0,
//     platform: 'yqq',
//     hostUin: 0,
//     needNewCode: 0
//   })

//   return jsonp(url, data, options)
// }