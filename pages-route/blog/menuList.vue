<script setup lang="ts">
import {MenuData, MenuType, YN} from "~/composables/common-interface";
import MenuRegist from "~/components/blog/MenuRegist.vue";
import {SymbolKind} from "vscode-languageserver-types";
import Array = SymbolKind.Array;
import {useCBFetch} from "~/composables/custom-fetch";
import {useLayoutStore} from "~/composables/layout-api";
// export interface MenuData {
//     seq: number
//     title: string
//     menuOrder: string
//     uuid: string
//     publicFlag?: YN
//     menuType?: MenuType
//     categorySeq?: number
// }

definePageMeta({
    layout: 'menu-layout',
    middleware: 'auth'
})

useLayoutStore().enableHeader({
    title : '테스트'
})


// constant
// const userSeq : number = parseInt(useRoute().params.userSeq as string)
const page = ref(5)
const registerFlag = ref(false)
const initMenu : MenuData = {
  seq : 0,
  menuOrder : 0,
  title : '',
  uuid : ''
}
const selectMenu = ref(initMenu)

// method
const menuListLoad = async () : Promise<MenuData[]>=>{
    const targetSeq = parentSeqArray.value[parentSeqArray.value.length - 1]
    let params = {parentSeq : targetSeq}
    const result = await useCBFetch().get<MenuData>('/api/blog/public/menu/findAll', {params})
    let blogList : Array<MenuData> = [];
    if (result.data?.dataList) {
        blogList = result.data.dataList;
    }
    return blogList
}

// method
const popRegister = (content : MenuData)=>{
    if (content) {
        // TODO ::  차후 공통로직으로 분기처리
        selectMenu.value = content
    } else {
        selectMenu.value = content
    }
    registerFlag.value = true
}

const reloadList = async ()=>{
    dataContents.value = await menuListLoad()
    accumContents.value = [JSON.parse(JSON.stringify(dataContents.value))]
}

const moveChildrenMenu = async (parentSeq : number)=>{
    const param = {parentSeq}
    const result = await useCBFetch().get<MenuData>('/api/blog/private/menu/findAll', {params: param})
    const resultList = result.data?.dataList || []

    parentSeqArray.value.push(parentSeq)
    dataContents.value = resultList
    accumContents.value.push(JSON.parse(JSON.stringify(resultList)))
}

const moveParentMenu = async ()=>{
    if (parentSeqArray.value.length < 2) return

    parentSeqArray.value = parentSeqArray.value.slice(0, parentSeqArray.value.length - 1)
    await reloadList()
}

// created
const parentSeqArray = ref([0])
const dataContents = ref([] as MenuData[])
const accumContents = ref(dataContents.value)
reloadList()

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


</script>

<template>
    <div id="main-post" class="content">
        <v-table>
            <thead>
                <tr>
                    <th scope="col" v-for="tHeader in dataHeader" :class="`text-center`" >
                        <span v-text="tHeader.title"></span>
                    </th>
                    <th scope="col" style="width: 100px"></th>
                    <th scope="col" style="width: 100px"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(content, idx) in dataContents">
                    <td v-for="tHeader in dataHeader" class="nodrag" :class="`text-${tHeader.align}`" :role="tHeader.key === 'title' ? 'button' : ''" @dblclick="moveChildrenMenu(content.seq)">
                        <span v-html="tHeader.print(content[tHeader.key])"></span>
                    </td>
                    <td>
                        <v-btn variant="elevated" color="deep-purple-darken-4" @click="useRouter().push({path : `/article/${content.seq}/list`})">게시물</v-btn>
                    </td>
                    <td>
                        <v-btn variant="elevated" color="deep-purple-darken-4" @click="popRegister(content)">수정</v-btn>
                    </td>
                </tr>
            </tbody>

        </v-table>

        <div class="d-flex flex-row-reverse mt-5">
            <v-btn variant="elevated" color="deep-purple-darken-4" @click="popRegister">메뉴 등록</v-btn>
        </div>
    </div>
    <MenuRegist v-model="registerFlag" :accumList="accumContents" :menu="selectMenu" @save:after="reloadList"></MenuRegist>
</template>

<style lang="scss" scoped>
#main-post {
   margin: 0 auto;
}
</style>