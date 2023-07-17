<script setup lang="ts">
import {useAlertStore} from "~/composables/layout-api";

const alertStore = useAlertStore();
const size = reactive({
    width: 400,
    height :300
})
</script>

<template>
    <v-dialog :max-width="size.width" :min-height="size.height" v-model="alertStore.alert.visible">
        <v-card class="d-flex justify-center align-center" v-text="alertStore.alert.message" :max-width="size.width" :min-height="size.height">
        </v-card>
    </v-dialog>
</template>

<style scoped>

</style>