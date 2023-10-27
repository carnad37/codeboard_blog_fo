<script setup lang="ts">
import {useLoading} from "~/composables/layout-api";

const nuxtApp = useNuxtApp();
nuxtApp.hook("page:start", () => {
    useLoading().start();
});
nuxtApp.hook("page:finish", () => {
    useLoading().stop();
});
</script>
<template>
    <template v-if="useLoading().isVisible()">
        <v-progress-circular class="loading-overlay" indeterminate size="50"></v-progress-circular>
        <div class="loading-overlay-cover"></div>
    </template>
    <NuxtLayout>
        <NuxtPage/>
    </NuxtLayout>
</template>

<style scoped>
.loading-overlay {
    z-index: 100;
    position: fixed;
    bottom: calc(50vh - 25px);
    right: calc(50vw - 25px);
}
.loading-overlay-cover {
    z-index: 99;
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: aliceblue;
    opacity: 0.7;
}
</style>