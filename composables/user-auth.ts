import {useCBFetch} from "~/composables/custom-fetch";
import {UserAuth} from "~/composables/common-interface";
import {defineStore} from "pinia";

export interface LoginResponse  {
    email : string,
    accessToken : string,
    refreshToken : string,
    userAuth? : UserAuth
}

/**
 * access key, refresh key 둘다 Cookie에 http only 로 담아버린다.
 */
export const useUserAuth = ()=> {
    const login = async (email : string, passwd : string) => {
        const {success} =  await useCBFetch().post<LoginResponse>('/auth/login', {body: {email, passwd}});
        if (success) {
            useAuthCheck().doLogin();
        }
        return success
    }
    const check = async () => {
        const {success} =  await useCBFetch().post<LoginResponse>('/auth/login/check');
        if (success) {
            useAuthCheck().doLogin();
        }
        return success
    }
    const logout = () => {}
    return {login, check, logout}
}

/**
 *
 */
export const useAuthCheck = defineStore('user-auth-api',() => {
    const userAuth = ref(UserAuth.ANONYMOUS)

    const doLogin = () =>{
        userAuth.value = UserAuth.MEMBER
    }
    const isLogin = ()=> {
        // 로그인 상태일 경우
        return userAuth.value !== UserAuth.ANONYMOUS
    }

    const isAdmin = () => {
        return userAuth.value === UserAuth.ADMIN
    }

    const isMember = () => {
        return userAuth.value === UserAuth.MEMBER
    }

    return {doLogin, isLogin}
})