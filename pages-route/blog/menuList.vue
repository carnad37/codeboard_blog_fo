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

const menuListLoad = async (parentSeq? : number) : Promise<MenuData[]>=>{
    let params = {parentSeq}
    const result = await useCBFetch().get<MenuData>('/api/blog/private/menu/findAll', {params})
    let blogList : Array<MenuData> = [];
    if (result.data?.dataList) {
        blogList = result.data.dataList;
    }
    return blogList
}

// asyncData
const typeData : MenuData[] = []
const dataContents = ref(await menuListLoad(selectMenuSeq.value))
const accumContents = ref([JSON.parse(JSON.stringify(dataContents))])

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
const popRegister = (content : MenuData)=>{
    if (content) {
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
    // 최상위로 이동후 새로고침
    selectMenuSeq.value = 0
    dataContents.value = await menuListLoad(selectMenuSeq.value)
    accumContents.value = [JSON.parse(JSON.stringify(dataContents.value))]
}

interface TestType {
    seq : number
    main : string
}
const test : TestType = {
    seq : 1,
    main : ''
}
const testD : TestType[] = [test, test]
const testData = reactive({
  innerArray : testD
})

// for (const tTarget in testData.value) {
//     tTarget.
// }



</script>

<template>
    <div id="main-post" class="content">
        <v-table>
            <thead>
                <tr v-for="tData in testData">
                    <span v-text="tData"></span>
                    <th scope="col" v-for="tHeader in dataHeader">
                        <span v-text="tHeader.title"></span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(content, idx) in dataContents">
                    <td v-for="tHeader in dataHeader" class="nodrag" :class="`text-${tHeader.align}`" :role="tHeader.key === 'title' ? 'button' : ''" @dblclick="popRegister(content['seq'])">
                        <span v-html="tHeader.print(content[tHeader.key])"></span>
                    </td>
                    <td>
                        <v-btn variant="elevated" color="deep-purple-darken-4" @click="popRegister(content)">수정</v-btn>
                    </td>
                </tr>
            </tbody>

        </v-table>

        <div class="d-flex flex-row-reverse mt-5">
            <v-btn variant="elevated" color="deep-purple-darken-4" @click="popRegister">등록</v-btn>
        </div>
    </div>
    <MenuRegist v-model="registerFlag" :accumList="accumContents" :menu-seq="selectMenuSeq" @save:after="reloadList"></MenuRegist>
</template>

<style scoped>
#main-post {
   margin: 0 auto;
}
</style>