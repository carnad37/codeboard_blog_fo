<script setup lang="ts">


import {useRecaptcha} from "~/composables/common-api";
import {DivNode} from "postcss-value-parser";
import {useAuthCheck} from "~/composables/user-auth";

definePageMeta({
    layout: "menu-layout"
})

const isLogin = computed(()=>{
    return useAuthCheck().isLogin()
})

const map : Ref<HTMLDivElement | undefined> = ref()
// onMounted(()=>{
//     kakao.maps.load(() => {
//         if (map?.value) {
//             const options = {
//                 center: new kakao.maps.LatLng(33.450701, 126.570667),
//                 level: 3,
//             };
//             const tMap = new kakao.maps.Map(map.value, options);
//             console.log(tMap)
//         }
//     });
// })

</script>
<template>
  <div>
      <div v-if="!isLogin">
          <nuxt-link :to="'/user/login'">{{ useAuthCheck().isLogin() }}</nuxt-link>
      </div>
      <template v-if="isLogin">
          <v-btn @click.prevent.once="useUserAuth().logout()" v-text="'로그아웃'"></v-btn>
      </template>
      <div v-if="isLogin">
          <nuxt-link :to="'/menu/list'">메뉴 리스트입니다</nuxt-link>
      </div>
      <div v-if="isLogin">
          <nuxt-link :to="'/article/1/list'">블로그 리스트입니다</nuxt-link>
      </div>
      <div style="height: 500px" ref="map"></div>
      <v-btn>테스트</v-btn>
  </div>
</template>

<style lang="scss" scoped>

</style>