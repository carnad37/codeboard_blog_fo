<script setup lang="ts">

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
    callChildren: ()=>Array<Tree>
}

const emit = defineEmits(['update:modelValue'])

// props
const props = withDefaults(defineProps<Props>(), {
    treeData: ()=>[],
    modelValue: 0,
    callChildren: ()=>{return []}
})

// data
const emptyTreeData = props.treeData?.flatMap(target=>target).length === 0

const selectTab = ref(props.treeData.length)
const selectUniqueSeq = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        return emit('update:modelValue', val)
    }
})

const colorClassArray = ['bg-lime', 'bg-orange']

let rootChildren = []
const process : Array<Array<Tree>> = [
    [
        {
            name: "최상위",
            uniqueSeq: 0,
            active: props.modelValue === 0,
        }
    ]
]
if (!emptyTreeData) {
    rootChildren = JSON.parse(JSON.stringify(props.treeData[0]))
    if (selectUniqueSeq.value === 0) {
        selectTab.value = 0
    } else {
        // 자식 전 조회를 통해 타겟 추적 필요.
        const recursiveFunc = (target : Tree, resultArray : Array<Array<Tree>>) => {
            if (target.uniqueSeq === selectUniqueSeq.value) {
                return true
            } else if (target?.children && target.children?.length > 0) {
                for (const unitTree of target.children) {
                    if (recursiveFunc(unitTree, resultArray)) {
                        resultArray.unshift(JSON.parse(JSON.stringify(target.children)))
                        return true
                    }
                }
            }
            return false
        }
        //

        let resultArray : Array<Array<Tree>> = []
        if (props.treeData.flatMap(target=>target).filter(target=>target.uniqueSeq===selectUniqueSeq.value)?.length) {
            let breakFlag = false
            resultArray = props.treeData
            for (let treeIdx=0; treeIdx < props.treeData.length; treeIdx++) {
                if (breakFlag) break
                const treeList =  props.treeData[treeIdx]
                for (let innerIdx=0; innerIdx< treeList.length; innerIdx++) {
                    const tree = treeList[innerIdx]
                    if (tree.uniqueSeq === selectUniqueSeq.value) {
                        resultArray = JSON.parse(JSON.stringify(props.treeData)).splice(0, treeIdx + 1)
                        resultArray[treeIdx][innerIdx].active = true
                        breakFlag = true
                        break
                    }
                }
            }
        } else {
            for (const treeList of props.treeData) {
                // 해당 depth에서 찾을수 있는지 확인
                // 최상위부터 시작
                for (const tree of treeList) {
                    recursiveFunc(tree, resultArray)
                    if (resultArray.length > 0) break;
                }
                if (resultArray.length > 0) break;
            }
            resultArray = resultArray.reverse()

        }
        rootChildren = resultArray[0]
        process.push(...resultArray)

        selectTab.value = process.length - 1
    }
}
console.log(props.treeData)
process[0][0].children = rootChildren

const selectTreeData = ref(process)

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
    if (depth < selectTab.value) {
        // 이하 정보는 모두 삭제한다
        selectTreeData.value = selectTreeData.value.slice(0, depth + 1)
        selectTab.value = depth
    }
}

const menuUnitClick = (selectTree : Tree)=>{
    selectUniqueSeq.value = selectTree.uniqueSeq

    selectTreeData.value[selectTab.value].forEach(target=>target.active=false)
    selectTree.active = true
}
const menuUnitDbClick = async (selectTree : Tree)=>{
    const result = selectTab.value + 1
    let childrenList : Array<Tree> | undefined = undefined
    if (selectTree.children?.length) {
        childrenList = selectTree.children
    } else {
        childrenList = await props.callChildren();
    }
    if (childrenList?.length) {
        for (let idx=0; idx < childrenList.length; idx++) {
            const target = childrenList[idx]
            if (idx===0) {
                selectUniqueSeq.value = target.uniqueSeq
                target.active = true
            } else {
                target.active = false
            }

        }
        selectTreeData.value.push(childrenList)
        selectTab.value = result
    }
}
</script>

<template>
    <v-card class="menu-top d-flex pa-5">
        <v-sheet v-for="(menuList, idx) in selectTreeData" class="menu-depth" :style="menuDepthStyle(idx)" :class="menuDepthClass(idx)" @click.self="menuDepthClick(idx)">
            <div v-for="menu in menuList" class="menu-unit bg-white rounded-sm justify-space-between my-1 p-1" :class="{active : menu.active}" @click="menuUnitClick(menu)" @dblclick="menuUnitDbClick(menu)" role="button">
                <span class="nodrag" v-text="menu.name"></span>
            </div>
        </v-sheet>
    </v-card>
</template>

<style scoped>
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