import {integer} from "vscode-languageserver-types";

export const RULES = {
    EMAIL : [
        (value: string) => !!value || '이메일을 입력해주세요',
        (value: string) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || '이메일 형식이 아닙니다(aaa@aaa.aaa)'
        },
    ],
    PASSWD : [
        (value: string) => !!value || '비밀번호를 입력해주세요',
        (value: string) => {
            const passLenth : integer = parseInt(useRuntimeConfig().public.custom.user.passwd.length);
            const result = (value?.length || 0) >= passLenth
            return result || `${passLenth}문자 이상 입력해주세요`
        },
        (value: string) => {
            const passLenth : integer = parseInt(useRuntimeConfig().public.custom.user.passwd.length)
            const permitChar = useRuntimeConfig().public.custom.user.passwd.permitChar
            const regExp = new RegExp(`(?!((?:[A-Za-z]+)|(?:[${permitChar}]+)|(?:[0-9]+))$)[A-Za-z\\d${permitChar}]{${passLenth},}$`, 'g')
            // 8문자 이상, 영문,숫자,특수문자 중 2가지이상
            const result = regExp.test(value);
            return result || '영문,숫자,특수문자 중 2가지이상'
        },
    ],
} as const;