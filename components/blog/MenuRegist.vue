<script setup lang="ts">

import {useCBFetch} from "~/composables/custom-fetch";
import {VForm} from "vuetify/components/VForm";
import TreeTab, {Tree} from "~/components/common/TreeTab.vue";
import {MenuData} from "~/composables/common-interface";
import {useAlertStore} from "#imports";

// props
type MenuProps = {
    modelValue?: boolean  // show flag
    menuSeq: number
    accumList: Array<Array<MenuData>>
}

const props = withDefaults(defineProps<MenuProps>(), {
    modelValue: false,
    menuSeq: 0
})

const emits = defineEmits(['update:modelValue', 'save:after'])

// asyncData
const menuFindAllBody = {
    menuSeq : props.menuSeq
}

// constant
const width = 450;
// refs
const form = ref<VForm|null>(null)

// reactive
const isEdit = computed(()=>{
    return props.menuSeq > 0
})

const tVisible = computed({
    get() {
        return props.modelValue
    },
    set(val : boolean) {
        emits('update:modelValue', val)
    }
})

const currentTreeArray = computed(()=>{
    let result : Tree[][] = []
    for (const tTreeList of props.accumList || []) {
        let innerArray : Tree[] = []
        for (const target of tTreeList) {
            innerArray.push({
                name : target.title,
                uniqueSeq : target.seq,
                active : false,
                children: target?.childrenList
            })
        }
        result.push(innerArray)
    }
    return result
})


// data
const title = ref('')
const menuOrder = ref(1)
const menuType = ref('B')
const publicFlag = ref(YN.Y)
const parentSeq : Ref<number> = ref(props.menuSeq)

// method
const menuSave = async ()=>{
    if (await useValidateForm(form)) {
        const param = {title: title.value, menuOrder: menuOrder.value, menuType: menuType.value, publicFlag: publicFlag.value, parentSeq: parentSeq.value}
        const result = await useCBFetch().post<MenuData>('/api/blog/private/menu/save', {body: param})
        useAlertStore().openWithCallback('메뉴가 저장되었습니다.', ()=>{
            tVisible.value=false
            emits('save:after')
        })
    }
}

const callChildren = async () : Promise<Array<Tree>> => {
    const param = {parentSeq: parentSeq.value}
    const result = await useCBFetch().get<MenuData>('/api/blog/private/menu/findAll', {params: param})
    return (result.data?.dataList || []).map(target => {
        return {
            uniqueSeq: target.seq,
            name: target.title,
            active: false
        }
    })
}

</script>

<template>
    <v-dialog :max-width="width" class="mx-auto" v-model="tVisible" :persistent="true">
        <v-card>
            <v-form ref="form">
            <v-container class="pa-8">
                <v-row>
                    <v-col>
                        <TreeTab :tree-data="currentTreeArray" v-model="parentSeq" :call-children="callChildren"></TreeTab>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field variant="underlined" label="제목" v-model="title" :clearable="true"/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field variant="outlined" label="순서" v-model="menuOrder" :clearable="true" type="number" min="1"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-radio-group label="공개여부" v-model="publicFlag">
                            <v-radio label="공개" :value="YN.Y"></v-radio>
                            <v-radio label="비공개" :value="YN.N"></v-radio>
                        </v-radio-group>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="pb-6 text-center">
                        <v-btn variant="elevated" height="45" width="80" class="font-weight-bold text-h6" color="indigo-accent-4" @click.self.prevent="menuSave()" v-text="isEdit ? '수정' : '등록'"></v-btn>
                    </v-col>
                    <v-col class="pb-6 text-center">
                        <v-btn variant="elevated" height="45" width="80"  class="font-weight-bold text-h6" color="red-darken-1" @click="tVisible = false">닫기</v-btn>
                    </v-col>
                </v-row>
            </v-container>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<style scoped>

</style>