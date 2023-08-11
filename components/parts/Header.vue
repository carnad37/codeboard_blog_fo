<script setup lang="ts">

import {HeaderSetting} from "~/composables/common-interface";

const setting : HeaderSetting = useLayoutStore().header;

</script>

<template>
    <div>
      <v-toolbar v-if="setting.visible">
          <v-toolbar-title>타이틀</v-toolbar-title>
      </v-toolbar>
    </div>
</template>

<style scoped>

</style>