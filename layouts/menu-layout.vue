<script setup lang="ts">
import Header from "~/components/parts/Header.vue";
import Footer from "~/components/parts/Footer.vue";
import CommonAlertDialog from "~/components/parts/CommonAlertDialog.vue";

useLayoutStore().enableHeader({title : "", isSticky : true})
useLayoutStore().enableFooter({isSticky : false})
</script>

<template>
    <v-app id="wrapper">
        <Header></Header>
        <main>
            <slot></slot>
        </main>
        <Footer/>
        <CommonAlertDialog/>
    </v-app>
</template>

<style lang="scss" scoped>
main {
    width: 70%;
    height: 100%;
    margin: auto;
}
@media screen and (max-width: 900px) {
    main {
        width: 100%;
    }
}
</style>