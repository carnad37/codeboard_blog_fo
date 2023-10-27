<script setup lang="ts">

import {HeaderSetting} from "~/composables/common-interface";


// 헤더 아이콘 관련
const setting = ref<HeaderSetting>(useLayoutStore().header);
const isLogin = computed(()=>{
    return useAuthCheck().isLogin()
})

enum MoveState {
    UP,
    DOWN
}

const defaultHeaderHeight = 64
// 헤더 이벤트 관련
const currentScroll = ref(0)
const currentState = ref(MoveState.UP)
const isProcessing = ref(false)
const headerPosition = ref('absolute')

// 스크롤 up/down 판별 필요
onMounted(()=>{
    // init
    window.addEventListener('scroll', scrollEvent)
})

onUnmounted(()=>{
    window.removeEventListener('scroll', scrollEvent)
})
const scrollEvent = ()=>{
    if (isProcessing.value === true) return
    isProcessing.value = true

    // header-wrapper-block 가 출력되면서 스크롤이동이 일어나고, 해당 이벤트 때문에, UP/DOWN이 계산되버림

    const getScroll = document.documentElement.scrollTop
    const gapScroll = getScroll - currentScroll.value

    currentState.value = gapScroll >= 0 ? MoveState.DOWN : MoveState.UP
    if (currentState.value === MoveState.UP ) {
        headerPosition.value = 'fixed'
    } else {
        headerPosition.value = 'absolute'
    }

    currentScroll.value = getScroll

    isProcessing.value = false
}

const nickname = computed(()=>{
    return useAuthCheck().user.nickname
})

</script>

<template>
    <div class="header-wrapper" :style="{position: headerPosition}">
        <v-expand-transition>
            <v-toolbar v-if="setting.visible">
                <v-toolbar-title>{{ setting.title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn v-if="!isLogin" icon @click.prevent="useRouter().push({path:`/user/login`})">
                    <v-icon icon="mdi-login" color="rgba(0, 0, 0, 1)"></v-icon>
                </v-btn>
                <template v-if="isLogin">
                    <span class="font-weight-bold font-italic mr-2" v-text="nickname"></span>
                    <span class=" mr-5">님</span>
                    <v-btn icon @click.prevent="useUserAuth().logout()">
                        <v-icon icon="mdi-logout" color="rgba(0, 0, 0, 1)"></v-icon>
                    </v-btn>
                </template>

            </v-toolbar>
        </v-expand-transition>
    </div>
    <div class="header-wrapper-block"></div>
</template>

<style scoped>
.header-wrapper {
    position: absolute;
    width: 100%;
    top: 0;
    z-index: 100;
}
.header-wrapper-block {
    height: 64px;
}
</style>