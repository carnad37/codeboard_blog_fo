<script setup lang="ts">
import {ArticleData, MenuData, PageData, YN} from "~/composables/common-interface";
import ArticleRegist from "~/components/blog/ArticleRegist.vue";

definePageMeta({
 layout: 'menu-layout'
})

// data
const page = ref(10)
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
    {
        title: '공개여부',
        key: 'publicFlag'
    }
]
// method
const popRegister = ()=>{
    selectArticle.value = null
    registerFlag.value = true
}

const menuReload = async ()=> {
    const pageData : PageData = {
        pageSize : 10,
        contentSize : 10,
        pageIndex : 1
    }
    const result = await useCBFetch().get<Array<ArticleData>>('/api/blog/private/article/findAll', {params : {boardSeq : menuSeq, ...pageData}})
    return result?.data?.dataList || [] as ArticleData[]
}

const headerSetting = useLayoutStore().header
headerSetting.visible = true

const menuSeq = useRoute().params.boardSeq
const menuApiResult = await useCBFetch().get<MenuData>('/api/blog/private/menu/find', {params : {seq : menuSeq}})
const menuData = menuApiResult?.data?.data
if (!menuData) {
    throw new Error('404', {cause: '404'});
}
const menu = ref(menuData)


const dataContents = ref(await menuReload())

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
    <ArticleRegist v-model="registerFlag" :article="selectArticle" :menu="menu"></ArticleRegist>
</template>

<style scoped>
#main-post {
   margin: 0 auto;
}
</style>