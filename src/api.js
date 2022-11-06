import axios from 'axios'
import router from './router/router'
import store from '@/store/store'
import dayjs from 'dayjs'
import {lsget} from "@/plugins/localstorage";

const toAuth = () => {
    store.dispatch('AUTH_LOGOUT')
        .then(() => {
            router.push('/web/auth')
        })
}

axios.defaults.timeout = 24 * 60 * 60 * 1000;
export const checkToken = () => {
    const token = lsget('auth', 'token') || ''
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ token
}
checkToken()

const ErrHandler = err=>{ //Если 403 или 401 - редиректит на авторизацию. Иначе пробрасывает ошибку вверх
    if (err?.response?.data?.code === 403 || err?.response?.data?.code === 401) {
        toAuth()
        return
    }
    console.log(`API_ERROR_HANDLER: ${err}`)
    throw err
}
const url = '/api'


export function getAnom({limit, offset}){
    const params = {limit, offset}
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

