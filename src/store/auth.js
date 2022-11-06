import * as API from "@/api";
import {lsset} from "../plugins/localstorage";

export const Auth = {
    actions: {
        AUTH_LOGIN: ({ commit, dispatch }, user) => {
            lsset('auth', {login:user.login, password: user.password})
            API.checkToken()
            return API.auth()
                .catch(err => {
                    lsset('auth', null)
                    API.checkToken()
                    return err
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