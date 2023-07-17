<template>
    <v-card>
        카드 테스트
    </v-card>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'no-menu-layout',
    middleware: ['auth']
})
</script>

<style scoped>

</style>