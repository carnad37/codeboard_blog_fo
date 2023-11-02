<script setup lang="ts">

import {WritableComputedRef} from "vue";

export interface Tree {
    name: string
    uniqueSeq : number
    active?: boolean
    children?: Array<Tree>
}

// type
type Props = {
    treeData: Array<Array<Tree>>
    modelValue: number
    isLock : boolean
    callChildren: ()=>Array<Tree> | Promise<Array<Tree>>
}

const emit = defineEmits(['update:modelValue'])

// props
const props = withDefaults(defineProps<Props>(), {
    treeData: ()=>[],
    modelValue: 0,
    isLock : false,
    callChildren: ()=>{return []}
})


// method
const menuDepthClass = (depth : number)=>{
    const result : Array<string> = []
    if (selectTab.value > depth) {
        result.push('upper-depth')
    } else if (selectTab.value < depth) {
        result.push('lower-depth')
    } else {
        result.push('active')
    }

    result.push(colorClassArray[depth % colorClassArray.length])
    return result
}

const menuDepthStyle = (depth:number)=>{
    type menuStyle = {
        transform? : string
        , 'min-width'? : string
    }

    const result : menuStyle = {}

    let pad = 0
    if (selectTab.value >= depth) {
        const depthTrans = depth * 6
        pad = depthTrans
        result.transform = `translateX(-${depthTrans}px)`;
    }
    if (selectTab.value === depth) {
        // 패딩 사이즈 * 2
        const padSize = 13 * 2
        const padWidth = depth * padSize - pad
        result["min-width"] = `calc(100% - ${padWidth}px)`
    }
    return result
}

const menuDepthClick = (depth:number)=>{
    if (props.isLock) return

    if (depth < selectTab.value) {
        // 이하 정보는 모두 삭제한다
        selectTreeData.value = selectTreeData.value.slice(0, depth + 1)
        selectTab.value = depth
    }
    selectUniqueSeq.value = -1
}

const menuUnitClick = (selectTree : Tree)=>{
    if (props.isLock) return

    selectUniqueSeq.value = selectTree.uniqueSeq

    selectTreeData.value[selectTab.value].forEach(target=>target.active=false)
    selectTree.active = true
}
const menuUnitDbClick = async (selectTree : Tree)=>{
    if (props.isLock) return

    const result = selectTab.value + 1
    let childrenList : Array<Tree> | undefined = undefined
    if (selectTree.children?.length) {
        childrenList = selectTree.children
    } else {
        childrenList = await props.callChildren();
    }
    if (childrenList?.length) {
        // for (let idx=0; idx < childrenList.length; idx++) {
        //     const target = childrenList[idx]
        // if (idx===0) {
        //     selectUniqueSeq.value = target.uniqueSeq
        //     target.active = true
        // } else {
        //     target.active = false
        // }
        // }
        selectTreeData.value.push(childrenList)
        selectTab.value = result
    }
}

// data
const emptyTreeData = props.treeData?.flatMap(target=>target).length === 0
const selectTab = ref(1) // index와 동의미
for (let idx=props.treeData.length - 1; idx >= 0; idx--) {
  const tTree = props.treeData[idx]

  if (tTree?.length) {
    selectTab.value = idx + 1
    break
  }
}

const selectUniqueSeq : WritableComputedRef<number> = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        return emit('update:modelValue', val)
    }
})

const colorClassArray = ['bg-lime', 'bg-orange']
const process : Array<Array<Tree>> = [
    [
        {
            name: "최상위",
            uniqueSeq: 0,
            active: props.modelValue === 0,
        }
    ]
]
if (emptyTreeData) {
    selectTab.value = 0
} else {
    // const lastArray = props.treeData[props.treeData?.length - 1]
    // const tTree = lastArray.filter(tTree=>tTree.uniqueSeq == selectUniqueSeq.value).pop()
    // if (!tTree) {
    //     selectUniqueSeq.value = lastArray[0].uniqueSeq
    // } else {
    //     tTree.active = true
    // }
}
process.push(...props.treeData)

const selectTreeData = ref(process)

</script>

<template>
    <v-card class="menu-top d-flex pa-5">
        <template v-for="(menuList, idx) in selectTreeData" >
          <v-sheet class="menu-depth" :style="menuDepthStyle(idx)" :class="menuDepthClass(idx)" @click.self="menuDepthClick(idx)">
            <div v-for="menu in menuList" class="menu-unit bg-white rounded-sm justify-space-between my-1 p-1" :class="{active : selectUniqueSeq === menu.uniqueSeq}" @click="menuUnitClick(menu)" @dblclick="menuUnitDbClick(menu)" role="button">
              <span class="nodrag" v-text="menu.name"></span>
            </div>
          </v-sheet>
        </template>
    </v-card>
</template>

<style lang="scss" scoped>
.menu-top {
    .menu-depth {
        padding: 12px 13px 12px 13px;
        .menu-unit {
            padding-left: 10px;
        }
        .menu-unit.active {
            border: black 2px solid;
        }
    }
    > .upper-depth {
        .menu-unit{
            display: none;
        }
        border-bottom-left-radius: 5px !important;
        border-top-left-radius: 5px !important;
    }
    > .lower-depth {
        display: none;
    }
    > .active {
        padding: 12px 18px 12px 18px;
        border-radius: 5px !important;
    }

}
</style>