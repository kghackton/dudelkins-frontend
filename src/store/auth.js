import * as API from "@/api";
import {lsset} from "../plugins/localstorage";

export const Auth = {
    actions: {
        AUTH_LOGIN: ({ commit, dispatch }, user) => {
            return new Promise((resolve, reject) => {
                API.auth(user.login, user.password)
                    .then(resp => {
                        const token = resp.data.data.token
                        const userUuid = resp.data.data.userUuid
                        lsset('auth', { token, userUuid, login:user.login})
                        API.checkToken()
                        resolve(resp)
                    })
                    .catch(err => {
                        lsset('auth', null)
                        reject(err)
                    })
            })
        },
        AUTH_LOGOUT: () => {
            return new Promise((resolve, reject) => {
                lsset('auth', null)
                API.checkToken()
                resolve()
            })
        }
    }
}