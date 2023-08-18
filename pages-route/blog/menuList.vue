<script setup lang="ts">
import {MenuType, YN} from "~/composables/common-interface";
import MenuRegist from "~/components/blog/MenuRegist.vue";
import {SymbolKind} from "vscode-languageserver-types";
import Array = SymbolKind.Array;
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
    layout: 'menu-layout',
    middleware: 'auth'
})

useLayoutStore().header.title = '테스트'

// constant
// const userSeq : number = parseInt(useRoute().params.userSeq as string)
const page = ref(5)
const registerFlag = ref(false)
const selectMenuSeq = ref(0)

const menuListLoad = async (parentSeq? : number)=>{
    let params = {}
    if (parentSeq) params = {parentSeq}
    const result = await useCBFetch().get<MenuData>('/api/blog/private/menu/findAll', {params})
    let blogList : Array<MenuData> = [];
    if (result.data?.dataList) {
        blogList = result.data.dataList;
    }
    return blogList
}

// asyncData
const dataContents = ref(await menuListLoad())

// data


const dataHeader = [
    {
        title: '제목',
        key: 'title',
        align: 'left',
        print: (val: any) => val
    },
    {
        title: '순서',
        key: 'menuOrder',
        align: 'center',
        print: (val: any) => val
    },
    {
        title: '공개여부',
        key: 'publicFlag',
        align: 'center',
        print: (val: any) => val
    }
]

// method
const popRegister = (menuSeq? : number | string)=>{
    if (menuSeq) {
        // TODO ::  차후 공통로직으로 분기처리
        if (typeof menuSeq === 'string') {
            try{
                menuSeq = parseInt(menuSeq)
            } catch(ex) {
                menuSeq = 0
            }
        }

        selectMenuSeq.value = menuSeq
    } else {
        selectMenuSeq.value = 0
    }
    registerFlag.value = true
}

const reloadList = async ()=>{
    dataContents.value = await menuListLoad(selectMenuSeq.value)
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
                    <td v-for="tHeader in dataHeader" class="nodrag" :class="`text-${tHeader.align}`" role="button" @dblclick="popRegister(content['seq'])">
                        <span v-text="tHeader.print(content[tHeader.key])"></span>
                    </td>
                </tr>
            </tbody>

        </v-table>

        <div class="d-flex flex-row-reverse mt-5">
            <v-btn variant="elevated" color="deep-purple-darken-4" @click="popRegister">등록</v-btn>
        </div>
    </div>
    <MenuRegist v-model="registerFlag" :menuList="dataContents" :menu-seq="selectMenuSeq" @save:after="reloadList"></MenuRegist>
</template>

<style scoped>
#main-post {
   margin: 0 auto;
}
</style>