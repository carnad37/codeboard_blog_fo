<script setup lang="ts">

import {useMonacoEditor} from "~/composables/editor-store";
import {editor} from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import ITextModel = editor.ITextModel;


interface Props {
    modelValue: string  // show flag
    language?: string
    readonly?: boolean
    height?: number
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    language: 'html',
    readonly: false,
    height: 300
})
const emits = defineEmits(['update:modelValue', 'init:languages'])

const monaco = useMonacoEditor().get()

const editorTag : Ref<HTMLElement | null> = ref(null)
let editorObj : IStandaloneCodeEditor | null = null

//created
const languages = monaco.languages.getLanguages().filter(target=>!target.id.startsWith('freemarker2.')).map(target=>target.id)
emits('init:languages', languages)

watch(
    ()=>props.language
    , async (value, oldValue) => {
        if (value && editorObj) {
            editorObj.setModel( monaco.editor.createModel(props.modelValue, props.language))
        }
    }
)

onMounted(()=>{
    if (editorTag.value) {
        editorObj = useMonacoEditor().create(editorTag.value, ()=>{
            emits('update:modelValue', editorObj?.getValue())
        }, {
            value : props.modelValue || '',
            language: props.language,
            theme: 'vs-dark',
            readOnly: props.readonly
        })
    }
})

onUnmounted(()=>{
    emits('init:languages', [])
})

const heightPx = computed(()=>{
    return props.height + "px"
})


</script>

<template>
    <div class="code-editor" :style="{height: heightPx}" ref="editorTag"></div>
</template>

<style>
@import "monaco-editor/min/vs/editor/editor.main.css";
</style>