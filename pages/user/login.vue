<script setup lang="ts">
import {LoginResponse, useUserAuth} from "~/composables/user-auth";
import {useAlertStore} from "~/composables/layout-api";
import {VForm} from "vuetify/components/VForm";
import Join from "~/components/member/Join.vue";
import {COMMON} from "~/constants/common/common";
import {useCBFetch} from "~/composables/custom-fetch";
import {useValidateForm} from "~/composables/common-api";


definePageMeta({
    layout: 'no-menu-layout',
})
// constant
const variant="underlined"
const emailRule = COMMON.RULES.EMAIL;
const passBlankRule = [ (value : string)=>value?.trim()?.length > 0 || '비밀번호를 입력해주세요']

// refs
const form = ref<VForm|null>(null)

// data
const email : Ref<string> = ref('')
const passwd : Ref<string> = ref('')

const registDialog = ref(false)


const login = async () => {
    if (await useValidateForm(form)) {
        if(await useUserAuth.login(email.value, passwd.value)) {
            useAlertStore().open('로그인성공')
            // 로그인 성공시
            await useRouter().replace({path: '/'})
        }
    }
}

function openRegister() {
    registDialog.value = true
}

</script>

<template>
    <div>
        <Join v-model="registDialog"/>
        <div class="d-flex align-center justify-center h-screen">
            <v-card class="pa-5" min-width="350" min-height="400">
                <v-form ref="form">
                    <v-container>
                        <v-row>
                            <v-col>
                                <div class="text-h3 text-center">Login</div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="pt-8 pb-5">
                                <v-text-field :variant="variant" label="이메일" v-model="email" :rules="emailRule" @keyup.enter="login" :clearable="true"/>
                                <v-text-field :variant="variant" label="비밀번호" v-model="passwd" type="password" :rules="passBlankRule" @keyup.enter="login" :clearable="true"/>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-container class="pa-3">
                                    <v-row class="text-center">
                                        <v-col cols="6">
                                            <v-btn variant="elevated" class="font-weight-bold" color="green" @click.self.prevent="login">로그인</v-btn>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-btn variant="elevated" class="font-weight-bold" color="indigo-accent-4" @click="openRegister">회원가입</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </div>
    </div>
</template>


<style scoped>

</style>