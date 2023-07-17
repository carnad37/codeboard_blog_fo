import {useCBFetch} from "~/composables/custom-fetch";

export interface LoginResponse  {
    email : string,
    accessToken : string,
    refreshToken : string
}

/**
 * access key, refresh key 둘다 Cookie에 http only 로 담아버린다.
 */
export const useUserAuth = {
    login: async (email : string, passwd : string) => {
        const {success} =  await useCBFetch.post<LoginResponse>('/auth/login', {body: {email, passwd}});
        return success
    },
    loginCheck: async ()=> {
        const {success} =  await useCBFetch.post<LoginResponse>('/auth/login/check');
        return success
    },
    logout: () => {},
}