<script setup lang="ts">

import {ArticleContent, EditorType, SaveFormStatus} from "~/composables/common-interface";
import EditorCode from "~/components/common/EditorCode.vue";
import EditorMarkdown from "~/components/common/EditorMarkdown.vue";

type Props = {
    editor : ArticleContent
    editorIndex : number
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
    isLast: false,
})
// init
props.editor.langType = props.editor.langType || 'html'

// created
const emits = defineEmits(['update:editorType', 'update:uploadFile', 'addEditor', 'delEditor', 'movePrev', 'moveNext'])
const oriEditorType = props.editor.editor
const oriContents = props.editor.content
const oriLangType = props.editor.langType
// 추가된 컨텐츠는 타겟으로 잡지않음
if (props.editor.status !== SaveFormStatus.insert) {
    watch(()=> oriContents !== props.editor.content
            || oriEditorType !== props.editor.editor
            || oriLangType !== props.editor.langType
        , async (value) => {
            // 해당값이 참일경우 변경상태라는 의미
            props.editor.status = value ? SaveFormStatus.update : undefined
        }
    )
}

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


// computed
const contents = computed({
    get() {
        return props.editor.content
    },
    set(val) {
        if (props.editor && val) {
            props.editor.content = val
        }
    }
})

const editorType = computed({
    get() {
        if (props.editor) {
            return props.editor.editor
        } else {
            return internalType.value
        }
    },
    set(val : EditorType) {
        if (props.editor) {
            props.editor.editor = val
        } else {
            internalType.value = val
        }
    }
})

// @move-prev="movePrev(cIdx)"
// @move-next="moveNext(cIdx)"

const loadCallback = ()=>{
    // typeSelectBox.value?.scrollIntoView({behavior:'smooth'})
}

const loadLanguages = (val : string[]) => {
    languagesArray.value = val
}

const uploadFile = (fileSeq : number)=>{
    emits('update:uploadFile', fileSeq)
}

</script>

<template>
    <div>
        <div v-if="isVisibleSelect" class="d-flex flex-wrap justify-space-between" ref="typeSelectBox">
            <v-sheet class="d-flex" :style="{'min-width' : '240px'}">
                <v-select :items="editorData" item-title="title" item-value="type" v-model="editorType">
                </v-select>
                <div class="mx-3"></div>
                <v-autocomplete v-if="languagesArray.length > 0" :style="{'min-width':'120px'}" :items="languagesArray" v-model="props.editor.langType">
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
            <EditorCode v-if="editorType === EditorType.CodeEditor" v-model="contents" :language="props.editor.langType" @init:languages="loadLanguages"></EditorCode>
            <v-textarea v-else-if="editorType === EditorType.TextArea" variant="outlined" v-model="contents" :auto-grow="true" :clearable="true"></v-textarea>
            <EditorMarkdown v-else-if="editorType === EditorType.MarkdownEditor" v-model="contents" :load-callback="loadCallback" @update:upload-file="uploadFile"></EditorMarkdown>
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