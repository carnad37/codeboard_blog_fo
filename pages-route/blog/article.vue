<script setup lang="ts">
import {MenuType, YN} from "~/composables/common-interface";
import MenuRegist from "~/components/blog/MenuRegist.vue";

export interface MenuData {
    seq: number
    title: string
    menuOrder: string
    uuid: string
    publicFlag?: YN
    menuType?: MenuType
    categorySeq?: number
}

definePageMeta({
 layout: 'menu-layout'
})

const headerSetting = useLayoutStore().headerSetting
headerSetting.visible = true

// asyncData
const result = await useCBFetch.get<MenuData>('/api/blog/public/menu/findAll')
console.log(result)
let blogList : Array<MenuData> = [];
if (result.data?.dataList) {
    blogList = result.data.dataList;
}
const dataContents = ref(blogList)

// data
const page = ref(5)
const registerFlag = ref(false)
const selectArticle : Ref<MenuData|null> = ref(null)

const dataHeader = [
    {
        title: '제목',
        key: 'title',
        print: (val: any) => val
    },
    {
        title: '요약',
        key: 'summary',
        print: (val: any) => val
    },
    {
        title: '순서',
        key: 'menuOrder',
        print: (val: any) => val
    },
    {
        title: '공개여부',
        key: 'publicFlag',
        print: (val: any) => val
    }
]

// method
const popRegister = ()=>{
    selectArticle.value = null
    registerFlag.value = true
}

</script>

<template>
    <div id="main-post" class="content">
        <v-table>
            <thead>
                <tr>
                    <th scope="col" v-for="tHeader in dataHeader">
                        <span v-text="tHeader.title"></span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="content in dataContents">
                    <td v-for="tHeader in dataHeader">
                        <span v-text="content[tHeader.key]"></span>
                    </td>
                </tr>
            </tbody>

        </v-table>

        <div class="d-flex flex-row-reverse mt-5">
            <v-btn variant="elevated" color="deep-purple-darken-4" @click="popRegister()">등록</v-btn>
        </div>
    </div>
    <MenuRegist v-model="registerFlag" :article="selectArticle"></MenuRegist>
</template>

<style scoped>
#main-post {
   margin: 0 auto;
}
</style>