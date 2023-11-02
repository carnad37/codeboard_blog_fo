<script setup lang="ts">

import {CommonResponse, useCBFetch} from "~/composables/custom-fetch";
import {COMMON} from "~/constants/common/common";
import {LoginResponse} from "~/composables/user-auth";
import {VForm} from "vuetify/components/VForm";
import {useRecaptcha, useValidateForm} from "~/composables/common-api";

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
        if (!val) recaptcha.value = ''
        emits('update:modelValue', val)
    }
})

const email = ref('')
const passwd = ref('')
const passwdCheck = ref('')
const nickname = ref('')

// pass const
const emailRule = COMMON.RULES.EMAIL;
const passwdRule = COMMON.RULES.PASSWD;
const passwdCheckRule = [
    (value: string) => {
        return (passwd.value === value) || '패스워드와 일치하지 않습니다'
    },
];

const recaptcha : Ref<string> = ref('')

const join = async (token:string)=>{
    // validate
    if (await useValidateForm(form)) {
        const bodyParam = {email: email.value, passwd: passwd.value, nickname: nickname.value, token: token}
        const response = await useCBFetch().post<LoginResponse>('/api/member/public/user/save', {body : bodyParam})
        const responseData = response.data;
        if (responseData?.errorCode !== COMMON.API.SUCCESS.CODE && responseData?.alertFlag) {
            // 실패 and alert
            useAlertStore().open(responseData.message)
        } else {
            // 성공
            useAlertStore().open(`회원가입이 완료되었습니다.\n환영합니다 ${nickname.value} 님.`)
        }
    }
}

const joinClick = async ()=>{
    useRecaptcha((token)=>{
        join(token);
    });
}

</script>

<template>
    <v-no-ssr>
        <v-dialog :max-width="width" class="mx-auto" v-model="tVisible">
            <v-card>
                <v-form ref="form">
                <v-container class="pa-8">
                    <v-row>
                        <v-col>
                            <v-text-field variant="underlined" label="이메일" v-model="email" :rules="emailRule" :clearable="true"/>
                            <v-text-field variant="underlined" label="비밀번호" v-model="passwd" :rules="passwdRule" type="password" :clearable="true"/>
                            <v-text-field variant="underlined" label="비밀번호 확인" v-model="passwdCheck" :rules="passwdCheckRule" type="password" :clearable="true"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field variant="underlined" label="닉네임" v-model="nickname" :clearable="true"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="text-center">
                            <RecaptchaCheckbox class="codeboard-recaptcha-btn" :key="'recaptcha'" v-model="recaptcha" :theme="'light'" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col v-if="recaptcha" class="mb-6 text-center">
                            <v-btn variant="elevated" class="font-weight-bold" color="indigo-accent-4" @click="joinClick()">회원가입</v-btn>
                        </v-col>
                        <v-col v-if="recaptcha" class="mb-6 text-center">
                            <v-btn variant="elevated" class="font-weight-bold" color="red-darken-1" @click="tVisible = false">닫기</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
                </v-form>
            </v-card>
        </v-dialog>
    </v-no-ssr>
</template>

<style lang="scss" scoped>

</style>