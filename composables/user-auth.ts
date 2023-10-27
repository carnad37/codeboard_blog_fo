import {useCBFetch} from "~/composables/custom-fetch";
import {UserAuth} from "~/composables/common-interface";
import {defineStore} from "pinia";

export interface LoginResponse  {
    email : string,
    seq : number,
    nickname : string,
    accessToken : string,
    refreshToken : string,
    userAuth? : UserAuth
}

export interface UserInfoResponse  {
    email: string
    nickname: string,
    userType: string
    userSeq: number
}

/**
 * access key, refresh key 둘다 Cookie에 http only 로 담아버린다.
 */
export const useUserAuth = ()=> {
    const login = async (email : string, passwd : string) => {
        const { data, success} =  await useCBFetch().post<LoginResponse>('/auth/login', {body: {email, passwd}});
        console.log(data?.data)
        if (success && data?.data) {
            const response = data.data

            await useAuthCheck().doLogin(response);
        }
        return success
    }
    const check = async () => {
        const {success} =  await useCBFetch().post<LoginResponse>('/auth/login/check');
        if (success) {
            await useAuthCheck().doLogin();
        }
        return success
    }
    const logout = async () => {
        const {success} =  await useCBFetch().post<LoginResponse>('/auth/logout');
        if (success) {
            useAuthCheck().doLogout();
            useAlertStore().open('로그아웃에 성공했습니다.')
            await useRouter().push({path: '/'})
        }
        return success
    }
    return {login, check, logout}
}

/**
 *
 */
export const useAuthCheck = defineStore('user-auth-api',() => {
    const userInfo = reactive({auth : UserAuth.ANONYMOUS, seq : 0, nickname : ''})

    const doLogin = async (response? : LoginResponse) =>{
        if (!response) {
            const {data, success} = await useCBFetch().get<UserInfoResponse>('/api/member/private/user/selfInfo');
            const infoResponse = data?.data
            if (!infoResponse) {
                throw new Error('fail get user info')
            } else {
                response = {
                    seq : infoResponse.userSeq,
                    email : infoResponse.email,
                    nickname : infoResponse.nickname,
                    accessToken : '',
                    refreshToken : ''
                }
            }
        }
        if (userInfo.seq < 1) {
            userInfo.seq =  response.seq
            userInfo.nickname = response.nickname
        }
        userInfo.auth = UserAuth.MEMBER
    }

    const isMine = (seq : number)=>{
        return userInfo.seq == seq;
    }

    const doLogout = () =>{
        userInfo.auth = UserAuth.ANONYMOUS
    }

    const isLogin = ()=>{
        // 로그인 상태일 경우
        return userInfo.auth !== UserAuth.ANONYMOUS
    }

    const isAdmin = () => {
        return userInfo.auth === UserAuth.ADMIN
    }

    const isMember = () => {
        return userInfo.auth === UserAuth.MEMBER
    }

    return {doLogin, doLogout, isLogin, isMine, user : readonly(userInfo)}
})