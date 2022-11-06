import {range} from 'mathjs'
import proxy from "@/../vue.config";
import store from '@/store/store';
export function isUUID(str){
	return str.match("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")
}

export function isOdh_Serial_Number(str){
	if(typeof(str)!=='string'){return false}
	return str.match("^N[0-9a-fA-F]{2}[1-9abcABC][01]{2}[UPup][0-9]{3}$")
}

export function generateDateISOInterval(timestamps) {
	let start, end
	if (timestamps.length > 0) {
		const datestr1 = timestamps[0]
		const datestr2 = timestamps[1] || timestamps[0]
		const date1 = new Date(datestr1 + 'T00:00:00.000Z')
		const date2 = new Date(datestr2 + 'T00:00:00.000Z')
		if (date1 > date2) {
			start = date2
			end = date1
		}
		else {
			start = date1
			end = date2
		}
		start.setUTCHours(0, 0, 0)
		end.setUTCHours(23, 59, 59)
	}
	return { start, end }
}
export function translateMonthCal (str) {
	const mon = translateMonthIm(str.split('-')[1])
	return `${str.split('-')[0]}, ${mon}`
}

function translateMonthIm(num) {
	switch (num) {
		case '01': return 'январь'
		case '02': return 'февраль'
		case '03': return 'март'
		case '04': return 'апрель'
		case '05': return 'май'
		case '06': return 'июнь'
		case '07': return 'июль'
		case '08': return 'август'
		case '09': return 'сентябрь'
		case '10': return 'октябрь'
		case '11': return 'ноябрь'
		case '12': return 'декабрь'
	}
}


export function fromStoreTimeIntervalToNatural(type){
	const rev=(str)=> {
		if (!str) return ''
		const arr = str.split('-')
		return arr.reverse().join('.')
	}
	let min, max
	const dates = store.getters[`FILTER_${type.toUpperCase()}_TIMESTAMPS`]
	if (dates[0] > dates[1]) {
		min = dates[1]
		max = dates[0]
	}
	else {
		min = dates[0]
		max = dates[1]
	}
	if (rev(min) === '' && rev(max) === '') {
		return ''
	}
	else if (rev(min) === '' || rev(max) === '') {
		return rev(min) || rev(max)
	}
	else {
		return rev(min) + ' - ' + rev(max)
	}
}

// export function translit(word){
// 	if(!word) return ''
// 	const converter = {
// 		'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
// 		'е': 'e',    'ё': 'e',    'ж': 'zh',   'з': 'z',    'и': 'i',
// 		'й': 'y',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
// 		'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
// 		'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': 'ch',
// 		'ш': 'sh',   'щ': 'sch',  'ь': '',     'ы': 'y',    'ъ': '',
// 		'э': 'e',    'ю': 'yu',   'я': 'ya'
// 	};
// 	let answer = '';
// 	for (let i = 0; i < word.length; ++i ) {
// 		if (converter[word[i].toLowerCase()] == undefined){
// 			answer += word[i];
// 		} else {
// 			const low = word[i].toLowerCase() === word[i]
// 			if(low){
// 				answer += converter[word[i]];
// 			}
// 			else{
// 				let add = converter[word[i].toLowerCase()]
// 				add = add[0].toUpperCase() + add.slice(1)
// 				answer += add
// 			}
// 		}
// 	}
// 	answer = answer.replace(/[-]+/g, '-');
// 	return answer;
// }

export const dir = (start, end)=>{
	const w = start[0]-end[0]
	const h = start[1]-end[1]
	return Math.sqrt(w*w + h*h)
}

export const generateImageUrl = (bucket, filepath, preview=false)=>{
	const geturl = function(){
		if (process.env.NODE_ENV === 'development') {
			const target = proxy.devServer.proxy["/api"].target
			return target.slice(7).split(':')[0]
		}
		else {
			return window.location.href.slice(7).split('/')[0].split(':')[0]
		}
	}
	const url = geturl()
	let port = ''
	switch (url) {
		case '10.200.96.211':
		case 'iipm-test-echd.mos.ru':
			port = '9000'
			break;
		// case 'http://iipm-test-echd.mos.ru/':
		case '10.200.96.209':
			port = '9005'
			break;

		case '10.200.96.202':
		case 'iipm-echd.mos.ru':
			port = '9001'
			break;
		// case '10.200.96.209':
		default:
			port = '9001'
	}
	return `http://iipm-echd.mos.ru:9001/${bucket}/${filepath}${preview?'_preview' :''}`
}

export function calcDistance(gps1, gps2) {
	let longitude1, latitude1, longitude2, latitude2
	if (Array.isArray(gps1)) {
		longitude1 = gps1[0]
		latitude1 = gps1[1]
	}
	else {
		longitude1 = gps1.longitude
		latitude1 = gps1.latitude
	}

	if (Array.isArray(gps2)) {
		longitude2 = gps2[0]
		latitude2 = gps2[1]
	}
	else {
		longitude2 = gps2.longitude
		latitude2 = gps2.latitude
	}

	const h = longitude1 - longitude2
	const hm = 111000 * h
	const w = latitude1 - latitude2
	const wm = 111000 * 0.5678 * w //домножение на косинус широты Москвы
	const dist = Math.sqrt(hm*hm + wm*wm)

	return dist
}