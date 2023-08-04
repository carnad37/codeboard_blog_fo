<script setup lang="ts">
import {YN} from "~/composables/common-interface";
import ArticleRegist from "~/components/blog/ArticleRegist.vue";

export interface ArticleData {
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

const headerSetting = useLayoutStore().headerSetting
headerSetting.visible = true

// asyncData
const result = await useCBFetch.get<Array<ArticleData>>('/api/blog/public/article/findAll')
let blogList : Array<ArticleData> = [];
if (result.data?.data) {
    blogList = result.data.data;
}
const dataContents = ref(blogList)

// data
const page = ref(5)
const registerFlag = ref(false)
const selectArticle : Ref<ArticleData|null> = ref(null)

const dataHeader = [
  {
      title: '제목',
      key: 'title',
  },
  {
      title: '요약',
      key: 'summary'
  },
]

// method
const popRegister = ()=>{
    selectArticle.value = null
    registerFlag.value = true
}

</script>

<template>
    <div id="main-post" class="content">
        <v-data-table
                :items-per-page="page"
                :headers="dataHeader"
                :items="dataContents"
                item-value="name"
                class="elevation-1"
        ></v-data-table>
        <div class="d-flex flex-row-reverse mt-5">
            <v-btn variant="elevated" color="deep-purple-darken-4" @click="popRegister()">등록</v-btn>
        </div>
    </div>
    <ArticleRegist v-model="registerFlag" :article="selectArticle"></ArticleRegist>
</template>

<style scoped>
#main-post {
   margin: 0 auto;
}
</style>