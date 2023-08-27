<script setup lang="ts">

import {EditorType} from "~/composables/common-interface";
import EditorCode from "~/components/common/EditorCode.vue";
import HtmlEditor from "~/components/common/HtmlEditor.vue";

type Props = {
    modelValue? : string
    editorType? : EditorType
    isVisibleSelect? : boolean
}

type EditorObj = {
    type : EditorType
    title : string
    options? : any
}

const props = withDefaults(defineProps<Props>(), {
  isVisibleSelect: true
})

const emits = defineEmits(['update:modelValue', 'update:editorType'])
const contents = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emits('update:modelValue', val)
    }
})

const internalType = ref(EditorType.TextArea)

const editorType = computed({
    get() {
        if (props.editorType) {
            return props.editorType
        } else {
            return internalType.value
        }
    },
    set(val : EditorType) {
        // 스크롤 이동
        if (typeSelectBox.value) {
            if (val !== EditorType.HTMLEditor) {
                typeSelectBox.value.scrollIntoView({behavior:'smooth'})
            }
        }
        if (props.editorType) {
            emits('update:editorType', val)
        } else {
            internalType.value = val
        }
    }
})

// data
const typeSelectBox : Ref<HTMLElement | null> = ref(null)
const editorData : Array<EditorObj> = [
    {
        type: EditorType.TextArea,
        title: '텍스트',
    },
    {
        type: EditorType.HTMLEditor,
        title: 'HTML'
    },
    {
        type: EditorType.CodeEditor,
        title: '코드'
    }
]
const loadCallback = ()=>{
    console.log("loadCallback")
    typeSelectBox.value?.scrollIntoView({behavior:'smooth'})
}

</script>

<template>
    <div>
        <div v-if="isVisibleSelect" class="d-flex flex-wrap" ref="typeSelectBox">
            <div class="flex-0-1">
                <v-select :items="editorData" item-title="title" item-value="type" v-model="editorType">
                </v-select>
            </div>

        </div>
<!--        <div class="my-2 border-sm rounded-s overflow-hidden" :style="{'border-color' : 'gray !important', 'opacity' : '1'}">-->
        <div>
            <EditorCode v-if="editorType === EditorType.CodeEditor" v-model="contents"></EditorCode>
            <v-textarea v-else-if="editorType === EditorType.TextArea" variant="outlined" v-model="contents" :clearable="true"></v-textarea>
            <HtmlEditor v-else-if="editorType === EditorType.HTMLEditor" v-model="contents" :load-callback="loadCallback"></HtmlEditor>
        </div>
    </div>
</template>

<style scoped>

</style>