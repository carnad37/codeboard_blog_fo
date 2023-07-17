<template>
    <div>
        <Join v-model="registDialog"/>
        <div class="d-flex align-center justify-center h-screen">
            <v-card class="pa-5" min-width="350" min-height="400">
                <v-container>
                    <v-row>
                        <v-col>
                            <div class="text-h3 text-center">Login</div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="pt-8 pb-5">
                            <v-text-field label="이메일" v-model="email" hint="입력은 이렇게!" :clearable="true"/>
                            <v-text-field label="비밀번호" v-model="passwd" type="password" :clearable="true"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-container class="pa-3">
                                <v-row class="text-center">
                                    <v-col cols="6">
                                        <v-btn variant="elevated" class="font-weight-bold" color="green" @click="login">로그인</v-btn>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-btn variant="elevated" class="font-weight-bold" color="indigo-accent-4" @click="openRegister">회원가입</v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useUserAuth} from "~/composables/user-auth";
import {useAlertStore} from "~/composables/layout-api";
import Join from "~/components/member/Join.vue";


definePageMeta({
    layout: 'no-menu-layout',
})
// constant
const variant="underlined"

// data
const email : Ref<string> = ref('')
const passwd : Ref<string> = ref('')

const registDialog = ref(false)
const registEmail = ref('')
const registPasswd = ref('')
const registPasswdChk = ref('')

// options의 method와 비슷한 역할.
async function login() {
    if(await useUserAuth.login(email.value, passwd.value)) {
        useAlertStore().open('로그인성공')
        // 로그인 성공시
        await useRouter().replace({path: '/'})
    }
}

function openRegister() {
    registDialog.value = true
}

</script>

<style scoped>

</style>