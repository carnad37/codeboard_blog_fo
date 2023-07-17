<script setup lang="ts">

import {CommonResponse, useCBFetch} from "~/composables/custom-fetch";
import {COMMON} from "~/constants/common";
import {LoginResponse} from "~/composables/user-auth";
import {VForm} from "vuetify/components/VForm";

// props
interface Props {
    modelValue?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    modelValue: false
})

const emits = defineEmits(['update:modelValue'])

// constant
const width = 450;

// refs
const form = ref<VForm|null>(null)

// reactive
const tVisible = computed({
    get() {
        return props.modelValue
    },
    set(val : boolean) {
        emits('update:modelValue', val)
    }
})

const email = ref('')
const passwd = ref('')
const passwdCheck = ref('')
const nickname = ref('')
const passHint = ref('8문자 이상, 영문,숫자,특수문자 중 2가지이상')

// pass const
const permitChar = '~!@#$%^&*()_+='
const passLenth : number = 8

const emailRule = [
    (value: string) => !!value || '이메일을 입력해주세요',
    (value: string) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || '이메일 형식이 아닙니다(aaa@aaa.aaa)'
    },
];

const passwdRule = [
    (value: string) => !!value || '비밀번호를 입력해주세요',
    (value: string) => {
        const result = (value?.length || 0) >= passLenth
        return result || `${passLenth}문자 이상 입력해주세요`
    },
    (value: string) => {
        const regExp = new RegExp(`(?!((?:[A-Za-z]+)|(?:[${permitChar}]+)|(?:[0-9]+))$)[A-Za-z\\d${permitChar}]{${passLenth},}$`, 'g')
        // 8문자 이상, 영문,숫자,특수문자 중 2가지이상
        const result = regExp.test(value);
        if (result) {
            passHint.value = ''
        }
        return result || '영문,숫자,특수문자 중 2가지이상'
    },
];

const passwdCheckRule = [
    (value: string) => {
        return (passwd.value === value) || '패스워드와 일치하지 않습니다'
    },
];

const join = async ()=>{
    // validate
    if (form.value !== null) {
        const { valid } = await form.value.validate()
        if (valid) {
            const response = await useCBFetch.post<LoginResponse>('/api/member/public/user/save', {body : {email: email.value, passwd: passwd.value, nickname: nickname.value}})
            const responseData = response.data;
            console.log(responseData)
            if (responseData?.errorCode !== COMMON.API.SUCCESS.CODE && responseData?.alertFlag) {
                // 실패 and alert
                useAlertStore().open(responseData.message)
            } else {
                // 성공
                useAlertStore().open(`회원가입이 완료되었습니다.\n환영합니다 ${nickname.value} 님.`)
            }
        }
    }
}

</script>

<template>
    <v-dialog :max-width="width" class="mx-auto" v-model="tVisible" :persistent="true">
        <v-card>
            <v-form ref="form">
            <v-container class="pa-8">
                <v-row>
                    <v-col>
                        <v-text-field variant="underlined" label="이메일" v-model="email" :rules="emailRule" :clearable="true"/>
                        <v-text-field variant="underlined" label="비밀번호" v-model="passwd" :rules="passwdRule" type="password" :hint="passHint" :clearable="true"/>
                        <v-text-field variant="underlined" label="비밀번호 확인" v-model="passwdCheck" :rules="passwdCheckRule" type="password" :clearable="true"/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field variant="underlined" label="닉네임" v-model="nickname" :clearable="true"/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="mb-6 text-center">
                        <v-btn variant="elevated" class="font-weight-bold" color="indigo-accent-4" @click.self.prevent="join">회원가입</v-btn>
                    </v-col>
                    <v-col class="mb-6 text-center">
                        <v-btn variant="elevated" class="font-weight-bold" color="red-darken-1" @click="tVisible = false">닫기</v-btn>
                    </v-col>
                </v-row>
            </v-container>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<style scoped>

</style>