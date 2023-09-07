<script setup lang="ts">

import {useCBFetch} from "~/composables/custom-fetch";
import {VForm} from "vuetify/components/VForm";
import TreeTab, {Tree} from "~/components/common/TreeTab.vue";
import {useAlertStore} from "#imports";
import {MenuData} from "~/composables/common-interface";

// props
type MenuProps = {
    modelValue?: boolean  // show flag
    menu: MenuData
    accumList: MenuData[][]
}

const props = withDefaults(defineProps<MenuProps>(), {
    modelValue: false,
    menu : ()=>{
      return {
        seq: -1,
        menuOrder: 0,
        title: ''
      }
    }
})

const emits = defineEmits(['update:modelValue', 'save:after'])

// constant
const width = 450;
// refs
const form = ref<VForm|null>(null)

// reactive
const isEdit = computed(()=>{
    return props.menu.seq > 0
})

const tVisible = computed({
    get() {
        parentSeq.value = props.menu.seq
        title.value = props.menu.title
        menuOrder.value = props.menu.menuOrder
        publicFlag.value = YN.Y

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
        for (const target of tTreeList || []) {
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
const title = ref(props.menu.title)
const menuOrder = ref(props.menu.menuOrder)
const menuType = ref('B')
const publicFlag = ref(YN.Y)
const parentSeq = ref(props.menu.seq)

// method
const menuSave = async ()=>{
    // parentSeq값은 form과 별개이므로 따로 validate
    // 선택안된 상태는 -1
    if (parentSeq.value < 0) {
      useAlertStore().open('상위 메뉴를 선택해주세요.');
      return
    }
    if (await useValidateForm(form)) {
        const param = {title: title.value,
          menuOrder: isEdit ? props.menu.menuOrder || 1 : menuOrder.value,
          menuType: menuType.value,
          publicFlag: publicFlag.value,
          parentSeq: parentSeq.value,
          seq: isEdit ? props.menu.seq || 1 : 1
        }
        const api = isEdit.value ? useCBFetch().put : useCBFetch().post
        const result = await api('/api/blog/private/menu/save', {body: param})
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
                        <TreeTab :tree-data="currentTreeArray" v-model="parentSeq" :is-lock="isEdit" :call-children="callChildren"></TreeTab>
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