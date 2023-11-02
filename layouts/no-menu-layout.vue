<script setup lang="ts">
import CommonAlertDialog from "~/components/parts/CommonAlertDialog.vue";


</script>

<template>
    <v-app id="wrapper">
        <slot />
        <CommonAlertDialog/>
    </v-app>
</template>

<style lang="scss" scoped>

</style>