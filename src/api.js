import axios from 'axios'
import router from './router/router'
import store from '@/store/store'
import dayjs from 'dayjs'
import {lsget} from "@/plugins/localstorage";

const toAuth = () => {
    store.dispatch('AUTH_LOGOUT')
        .then(() => {
            router.push('/auth')
        })
}

axios.defaults.timeout = 24 * 60 * 60 * 1000;
export const checkToken = () => {
    axios.defaults.headers.common['Authorization'] = `Basic ${btoa(`${lsget('auth', 'login')||''}:${lsget('auth', 'password')||''}`)}`
}
checkToken()

const ErrHandler = err=>{ //Если 403 или 401 - редиректит на авторизацию. Иначе пробрасывает ошибку вверх
    console.log(err.response)
    if (err?.response?.status === 403 || err?.response?.status === 401) {
        toAuth()
        return
    }
    console.log(`API_ERROR_HANDLER: ${err}`)
    throw err
}
const url = '/api'


export function getAnom({limit, offset}={limit:200, offset: 0}){
    // const params = {limit, offset}
    // if(fromImageTimestamp) {
    //     params.from = dayjs(fromImageTimestamp).format('YYYY-MM-DDTHH:mm:ssZ')
    // }
    // if(toImageTimestamp) {
    //     params.to = dayjs(toImageTimestamp).format('YYYY-MM-DDTHH:mm:ssZ')
    // }

    return axios.get(`${url}/applications`,{params:{
        isAbnormal: true,
        limit:2000, offset
    }})
        .then(res=>res.data.data)
        .catch(ErrHandler)
}

export function getOne(id){
    return axios.get(`${url}/applications/${id}`)
        .then(res=>res.data.data)
        .catch(ErrHandler)
}

export function auth() {

    return axios.post(`${url}/auth` )
        .catch(err=>{
            if (err.response.data.code === 401 ) {
                toAuth()
                throw err
            }
            notify({text: `Ошибка запроса: ${err.response.data.code}`, theme: 'red'})
            console.log(`Ошибка запроса: ${err}`)
            throw err
        })
}

