<script setup lang="ts">

definePageMeta({
    layout: "no-menu-layout"
})

</script>
<template>
  <div>
      <div>
          <nuxt-link :to="'/user/logout'">로그아웃입니다</nuxt-link>
      </div>
      <div>
          <nuxt-link :to="'/blog/list'">블로그 리스트입니다</nuxt-link>
      </div>
  </div>
</template>

<style scoped>

</style>