import {useAuthCheck} from "~/composables/user-auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
    /**
     * 몇가지 방법이 있는데, 사용할지 말지 한걸로 2개준비
     * 1. 토큰 보유 확인.
     * - 현재 httponly인 access token은 확인 불가
     * - localstorage에 담긴 refresh token으로만 확인가능
     * 2. 로그인 체크 요청
     * - 리턴값이 True일 경우에만 진행.
     * - 가장 확실하나 서버 응답이 필요.
     *
     * 현재는 2로 진행
     */
    if (!useAuthCheck().isLogin) {
        // return abortNavigation("403")
        throw createError({ statusCode: 403, statusMessage: 'Not Login' })
    }

})