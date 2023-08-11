<script setup lang="ts">
import {YN} from "~/composables/common-interface";

interface PostData {
  seq: number
  title: string
  content: string
  summary: string
  publicFlag: YN
  boardSeq: number
  categorySeq: number
}

definePageMeta({
 layout: 'menu-layout'
})
const headerSetting = useLayoutStore().header
headerSetting.visible = true

const page = ref(5)



</script>

<template>
    <div id="main-post" class="content">

    </div>
</template>

<style scoped>
#main-post {
   margin: 0 auto;
}
</style>