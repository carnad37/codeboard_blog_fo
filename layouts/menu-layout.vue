<script setup lang="ts">
import Header from "~/components/parts/Header.vue";
import Footer from "~/components/parts/Footer.vue";
import CommonAlertDialog from "~/components/parts/CommonAlertDialog.vue";

useLayoutStore().header.visible = true

</script>

<template>
    <v-app id="wrapper">
        <Header></Header>
        <slot></slot>
        <Footer/>
        <CommonAlertDialog/>
    </v-app>
</template>

<style scoped>

</style>