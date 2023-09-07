import {UseFetchOptions } from "nuxt/app"
import {_AsyncData, KeysOf, PickFrom} from "nuxt/dist/app/composables/asyncData"
import type { FetchError } from 'ofetch';
import {COMMON} from "~/constants/common/common";
import {RouterMethod} from "h3";

export interface CommonResponse<T> {
    message? : any,
    errorCode : string,
    httpCode: number,
    alertFlag: boolean
    data?: T
    dataList?: Array<T>
}

// useFetch의 경우 제대로 타입스크립트로 체크가 이루워지지 않음.
export const useCBFetch = ()=> {
    const get = async <ResT> (path : string, param? : UseFetchOptions<ResT>)=>{
        return commonLogic(path, 'get', param)
    }
    const post = async <ResT> (path : string, param? : UseFetchOptions<ResT>)=>{
        return commonLogic(path, 'post', param)
    }
    const put = async <ResT> (path : string, param? : UseFetchOptions<ResT>)=>{
        return commonLogic(path, 'put', param)
    }
    return {get, post, put}
}

const commonLogic = async <ResT> (path : string, method : RouterMethod, param? : UseFetchOptions<ResT>) => {
    try {
        if (!param) {
            param = {}
        }
        param.method = method
        param.credentials = 'include'
        if (!process.dev) param.baseURL = useRuntimeConfig().public.baseURL;
        const result : _AsyncData<CommonResponse<ResT> | any, FetchError<ResT> | null> = param ? await useFetch(path, param) : await useFetch(path)

        if (result.error.value) {
            // error checker
            useAlertStore().open(COMMON.API.ERROR.NETWORK_FAIL)
            return {success: false, data : null, error : null, refresh : null, pending : null, execute : null}
        }

        const resultData : CommonResponse<ResT> | null = result.data.value
        const success = resultData?.httpCode === 200 && resultData?.errorCode === COMMON.API.SUCCESS.CODE

        if (resultData?.alertFlag) {
            useAlertStore().open(resultData?.message || '')
        }
        return {success,  data : resultData, error : result.error, refresh : result.error, pending : result.pending, execute : result.execute}
    } catch (e) {
        useAlertStore().open(COMMON.API.ERROR.NETWORK_FAIL)
        return {success: false, data : null, error : null, refresh : null, pending : null, execute : null}
    }
}