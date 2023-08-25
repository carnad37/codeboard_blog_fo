<script setup lang="ts">


import {useRecaptcha} from "~/composables/common-api";
import {DivNode} from "postcss-value-parser";

definePageMeta({
    layout: "no-menu-layout"
})

const map : Ref<HTMLDivElement | undefined> = ref()
onMounted(()=>{
    kakao.maps.load(() => {
        if (map?.value) {
            const options = {
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 3,
            };
            const tMap = new kakao.maps.Map(map.value, options);
            console.log(tMap)
        }
    });
})

</script>
<template>
  <div>
      <div>
          <nuxt-link :to="'/user/login'">로그인 페이지입니다</nuxt-link>
      </div>
      <div>
          <nuxt-link :to="'/user/logout'">로그아웃입니다</nuxt-link>
      </div>
      <div>
          <nuxt-link :to="'/menu/list'">메뉴 리스트입니다</nuxt-link>
      </div>
      <div>
          <nuxt-link :to="'/article/2/list'">블로그 리스트입니다</nuxt-link>
      </div>
      <div style="height: 500px" ref="map"></div>
      <v-btn>테스트</v-btn>
  </div>
</template>

<style scoped>

</style>