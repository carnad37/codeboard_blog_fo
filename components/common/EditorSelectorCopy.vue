<script setup lang="ts">

import {ArticleContent, EditorCodeLang, EditorType} from "~/composables/common-interface";
import EditorCode from "~/components/common/EditorCode.vue";
import EditorMarkdown from "~/components/common/EditorMarkdown.vue";

type Props = {
    modelValue? : ArticleContent
    editorType? : EditorType
    isVisibleSelect? : boolean
    isFirst? : boolean
    isLast? : boolean
}

type EditorObj = {
    type : EditorType
    title : string
    options? : any
}

const props = withDefaults(defineProps<Props>(), {
    isVisibleSelect: true,
    isFirst: false,
    isLast: false
})

const emits = defineEmits(['update:modelValue', 'update:editorType', 'addEditor', 'delEditor', 'movePrev', 'moveNext'])

// data
const typeSelectBox : Ref<HTMLElement | null> = ref(null)
const blankArray : string[] = []
const languagesArray = ref(blankArray)
const editorData : Array<EditorObj> = [
    {
        type: EditorType.TextArea,
        title: '텍스트',
    },
    {
        type: EditorType.MarkdownEditor,
        title: '마크다운'
    },
    {
        type: EditorType.CodeEditor,
        title: '코드'
    }
]
const internalType = ref(EditorType.TextArea)
const selectLang = ref('html')

// computed
const contents = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emits('update:modelValue', val)
    }
})

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
        // if (typeSelectBox.value) {
        //     if (val !== EditorType.HTMLEditor) {
        //         typeSelectBox.value.scrollIntoView({behavior:'smooth'})
        //     }
        // }
        if (props.editorType) {
            emits('update:editorType', val)
        } else {
            internalType.value = val
        }
    }
})

const loadCallback = ()=>{
    typeSelectBox.value?.scrollIntoView({behavior:'smooth'})
}

const loadLanguages = (val : string[]) => {
    languagesArray.value = val
}

</script>

<template>
    <div>
        <div v-if="isVisibleSelect" class="d-flex flex-wrap justify-space-between" ref="typeSelectBox">
            <v-sheet class="d-flex" :style="{'min-width' : '240px'}">
                <v-select :items="editorData" item-title="title" item-value="type" v-model="editorType">
                </v-select>
                <div class="mx-3"></div>
                <v-autocomplete v-if="languagesArray.length > 0" :style="{'min-width':'120px'}" :items="languagesArray" v-model="selectLang">
                </v-autocomplete>
            </v-sheet>
            <v-sheet class="mt-3 middle-margin d-flex" :style="{'min-width' : '80px'}">
                <v-sheet>
                    <v-btn v-if="!isFirst" class="tri-up" icon="mdi-triangle align-center" color="grey-darken-2" size="small" @click.prevent="emits('movePrev')"></v-btn>
                    <v-btn v-if="!isLast" class="tri-down" icon="mdi-triangle-down align-center" color="grey-darken-2" size="small" @click.prevent="emits('moveNext')"></v-btn>
                </v-sheet>
                <span class="middle-margin mx-2" > </span>
                <v-sheet>
                    <v-btn icon="mdi-plus align-center" color="indigo-darken-3" size="small" @click.prevent="emits('addEditor')"></v-btn>
                    <v-btn icon="mdi-minus align-center" color="red-accent-4" size="small" @click.prevent="emits('delEditor')"></v-btn>
                </v-sheet>
            </v-sheet>
        </div>
<!--        <div class="my-2 border-sm rounded-s overflow-hidden" :style="{'border-color' : 'gray !important', 'opacity' : '1'}">-->
        <div>
            <EditorCode v-if="editorType === EditorType.CodeEditor" v-model="contents" :language="selectLang" @init:languages="loadLanguages"></EditorCode>
            <v-textarea v-else-if="editorType === EditorType.TextArea" variant="outlined" v-model="contents" :clearable="true"></v-textarea>
            <EditorMarkdown v-else-if="editorType === EditorType.MarkdownEditor" v-model="contents" :load-callback="loadCallback"></EditorMarkdown>
        </div>
    </div>
</template>

<style lang="scss">
@media screen and (max-width: 530px) {
    .middle-margin {
        margin-bottom: 20px;
    }
}

</style>