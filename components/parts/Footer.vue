<script setup lang="ts">

import {FooterSetting} from "~/composables/common-interface";

const setting = useLayoutStore().footerSetting;

</script>

<template>
  <div v-if="setting.visible">
    Footer space
  </div>
</template>

<style scoped>

</style>