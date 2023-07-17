<script setup lang="ts">
  const testEmit =  defineEmits(['test-pop'])
</script>

<template>
  <v-btn @click="testEmit('test-pop')">테스트</v-btn>
</template>

<style scoped>

</style>