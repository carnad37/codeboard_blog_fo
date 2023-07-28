<script setup lang="ts">
definePageMeta({
    layout: 'no-menu-layout',
    middleware: ['auth']
})
const pushPage = ()=> {
    useRouter().push({path: '/'})
}

</script>

<template>
    <v-card>
        <v-btn @click="pushPage()">카드 테스트</v-btn>
    </v-card>
</template>

<style scoped>

</style>