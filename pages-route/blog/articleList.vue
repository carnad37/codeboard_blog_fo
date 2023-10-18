<script setup lang="ts">
import {
    ArticleData,
    DataTableSort,
    EditorType,
    MenuData,
    PageData,
    SaveFormStatus,
    YN
} from "~/composables/common-interface";
import ArticleRegist from "~/components/blog/ArticleRegist.vue";
import {DeepReadonly} from "@vue/reactivity";
import * as vue from "vue";
import {useCBFetch} from "~/composables/custom-fetch";
import {ca} from "vuetify/locale";

definePageMeta({
    layout: 'menu-layout',
    middleware: ['auth']
})

// interface(type)
interface DataTableItem {
    key: any;
    index: number;
    columns: {
        [key: string]: string;
    };
}
interface ArticleResult {
    totalCnt: number
    articleList: ArticleData[]
}

// method
const popRegister = ()=>{
    useRouter().push({path: `/article/${menuSeq}/insert`})
}


const menuReload = async ({ page, itemsPerPage, sortBy} : {page:number, itemsPerPage:number, sortBy:DataTableSort[]})=> {
    tableLoading.value = true
    const pageData : PageData = {
        pageSize : itemsPerPage,
        contentSize : 10,
        pageIndex : page
    }
    let dataList = [] as ArticleData[]
    let dataCnt = 0
    try {
        const result = await useCBFetch().get<ArticleResult>('/api/blog/private/article/findAll', {params : {boardSeq : menuSeq, ...pageData}})
        const resultData = result?.data?.data
        if (resultData) {
            dataList = resultData.articleList
            dataCnt = resultData.totalCnt
        }
        // dataList = result?.data?.data || [] as ArticleData[]
    } catch (e) {
        dataList = []
    } finally {
        tableLoading.value = false
    }
    totalCnt.value = dataCnt
    dataContents.value = dataList
}

const pageMove = async (inputPage : number)=>{
    page.value = inputPage
    await menuReload({ page : inputPage, itemsPerPage : itemsPerPage.value, sortBy : sortBy.value })
}

const rowClickCallback = async (e : Event, value : { item: DataTableItem })=>{
    await useRouter().push({path: `/article/${menuSeq}/insert/${value.item.columns.seq}`})
}


// data
const page = ref(1)
const itemsPerPage = ref(10)

const dataHeader = [
    {
        title: '구분자',
        key: 'seq',
    },
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
        key: 'publicFlag',
        align: 'center'
    },
]

const selectArticleSeq = ref(0)
const tableLoading = ref(false)
const sortBy = ref([] as Array<DataTableSort>)

// const headerSetting = useLayoutStore().header
// headerSetting.visible = true

const menuSeq = useRoute().params.boardSeq
const menuApiResult = await useCBFetch().get<MenuData>('/api/blog/private/menu/find', {params : {seq : menuSeq}})
const menuData = menuApiResult?.data?.data
if (!menuData) {
    throw new Error('404', {cause: '404'});
}

const menu = ref(menuData)
const totalCnt = ref(0)
const dataContents = ref([] as Array<ArticleData>)
menuReload({page:page.value, itemsPerPage:10, sortBy:sortBy.value})
// const dataContents = ref(await menuReload({page:1, itemsPerPage:10, sortBy:sortBy.value}))

</script>

<template>
    <div id="main-post" class="content">
        <v-data-table-server
            :items-per-page="itemsPerPage"
            :headers="dataHeader"
            :items="dataContents"
            :loading="tableLoading"
            item-value="name"
            class="elevation-1"
            @click:row="rowClickCallback"
            @update:options="menuReload"
        >
            <template v-slot:bottom>
                <div class="text-center pt-2">
                    <v-pagination
                        :model-value="page"
                        :length="totalCnt"
                        @update:modelValue="pageMove"
                    ></v-pagination>
<!--                    <v-text-field-->
<!--                        :model-value="page"-->
<!--                        class="pa-2"-->
<!--                        label="Items per page"-->
<!--                        type="number"-->
<!--                        min="-1"-->
<!--                        max="15"-->
<!--                        hide-details-->
<!--                        @update:model-value="itemsPerPage = parseInt($event, 10)"-->
<!--                    ></v-text-field>-->
                </div>
            </template>

        </v-data-table-server>
        <div class="d-flex flex-row-reverse mt-5">
            <v-btn variant="elevated" color="deep-purple-darken-4" @click="popRegister()">등록</v-btn>
        </div>
    </div>
<!--    <ArticleRegist v-model="registerFlag" :article-seq="selectArticleSeq" :menu="menu"></ArticleRegist>-->
</template>

<style scoped>
#main-post {
   margin: 0 auto;
}
</style>