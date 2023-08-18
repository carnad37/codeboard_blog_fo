<script setup lang="ts">

export interface Tree {
    name: string
    uniqueSeq : number
    active?: boolean
    children?: Array<Tree>
}

// type
type Props = {
    treeData: Array<Array<any>>
    modelValue: number
    mapper: (val:any)=>Tree
    callChildren: ()=>Array<Tree> | Promise<Array<Tree>>
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
    // rootChildren = JSON.parse(JSON.stringify(props.treeData[0]))
    // if (selectUniqueSeq.value === 0) {
    //     selectTab.value = 0
    // } else {
    // 자식 전 조회를 통해 타겟 추적 필요.
    // 전달받을 수 있는 데이터는 크게 3종류
    // 1. [[],[],[]...[]] 형태로 출력될 데이터가 미리 다 정해져있는 경우. 가장 간단한 경우.
    // 이경우 최상위이후 해당 데이터들을 그대로 출력해주면된다. 다만 selectUniqueSeq이 해당 내용에 있는지 확인은 필요.
    // 2. 원시형태로 Tree구조의 데이터.
    // 3. 위 아래의 경우가 전부 섞인 구조.(children도 있고, 부모값도 있고...)

    /*
    기존에는 외부에서 Tree로 변경해주고 데이터를 밀어넣었으나, children같은경우 예외처리될 가능성이 있었다.
    이에 Tree경우로 데이터가 주워졌을경우(1)와, Tree가 아닌경우로 데이터가 주워졌을 경우(2)를 분기처리하는게 알맞아보임.

    1의 경우 문제없이 그대로 출력.
    2의 경우 any타입을 mapper를 사용하여 children을 포함한 모든 객체를 변환하는 작업처리.

    물론 둘의 경우 모두 기존 객체를 참조하지 않도록 모두 새로 값을 담는다. (1의 경우는 JSON.parse(JSON.stringify(...))를 사용, 2는 모든 값에 mapper적용)
     */

    // 재귀를 돌릴경우 꼬리재귀를 돌리면 중간에 스탑되기에 모든 객체에 적용되지 않음.
    // children만 체크하여 전 재귀 돌리는게 옳아보임
    // 3에 대비해 모든 list내의 데이터는 전 조회
    for (const treeList of props.treeData) {
        // 최상위 트리 배열. 각각의 탭의 데이터를 가지고 있다(1)

    }

    const recursiveFunc = (target : any, returnArray : Array<Tree>) => {
        const result : Tree = props.mapper(target)
        returnArray.unshift(result)
        for (const anyChildren of result?.children || []) {
            //자식값이
            const resultArray = []
            recursiveFunc(unitTree, resultArray)

            // resultArray.unshift(JSON.parse(JSON.stringify(target.children)))
        }
    }

    // 전 주회를 통해 현재 선택된 값을 확인
    let resultArray : Array<Array<Tree>> = []
    if (props.treeData.flatMap(target=>target).filter(target=>target.uniqueSeq===selectUniqueSeq.value)?.length) {
        // 현재 선택값이 TreeData내에 있는경우 조회를 시작함.
        // 현재 선택값의 Depth만 확인가능하면 매우 편리할듯
        // let breakFlag = false
        // resultArray = props.treeData
        // for (let treeIdx=0; treeIdx < props.treeData.length; treeIdx++) {
        //     if (breakFlag) break
        //     const treeList =  props.treeData[treeIdx]
        //     for (let innerIdx=0; innerIdx< treeList.length; innerIdx++) {
        //         const tree = treeList[innerIdx]
        //         if (tree.uniqueSeq === selectUniqueSeq.value) {
        //             resultArray = JSON.parse(JSON.stringify(props.treeData)).splice(0, treeIdx + 1)
        //             resultArray[treeIdx][innerIdx].active = true
        //             breakFlag = true
        //             break
        //         }
        //     }
        // }

    } else {
        // 현재 트리내에 해당 데이터가 없을경우
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
    // }
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
        console.log("process")
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