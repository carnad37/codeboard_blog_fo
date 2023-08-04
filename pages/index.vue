<script setup lang="ts">


import {useRecaptcha} from "~/composables/common-api";

definePageMeta({
    layout: "no-menu-layout"
})

console.log(useRoute().params)

</script>
<template>
  <div>
      <div>
          <nuxt-link :to="'/user/logout'">로그아웃입니다</nuxt-link>
      </div>
      <div>
          <nuxt-link :to="'/menu/list'">메뉴 리스트입니다</nuxt-link>
      </div>
      <div>
          <nuxt-link :to="'/blog/list'">블로그 리스트입니다</nuxt-link>
      </div>
      <v-btn>테스트</v-btn>
  </div>
</template>

<style scoped>

</style>