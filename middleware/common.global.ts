import {useApiProcess} from "~/composables/common-api";

export default defineNuxtRouteMiddleware(async (to, from) => {
    // 전체 글로펄 middleware
    // 글로벌 Middleware는 *.global.ts 로 등록하면 알아서 파싱해서 등록됨
    // 이동시 api 네트워크 대기 리셋
    useApiProcess().forcedStop();
})