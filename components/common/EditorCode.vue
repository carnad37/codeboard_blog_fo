<script setup lang="ts">
import * as monaco from 'monaco-editor'
import IStandaloneEditorConstructionOptions = monaco.editor.IStandaloneEditorConstructionOptions;
import IStandaloneCodeEditor = monaco.editor.IStandaloneCodeEditor
import ITextModel = monaco.editor.ITextModel;


interface Props {
    modelValue: string  // show flag
}
const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
})
const emits = defineEmits(['update:modelValue'])

const editorTag : Ref<HTMLElement | null> = ref(null)
let editor : IStandaloneCodeEditor | null = null

onMounted(()=>{
    if (editorTag.value) {
        editor = useMonacoEditor().create(editorTag.value, ()=>{
            emits('update:modelValue', editor?.getValue())
        }, {
            language: 'java'
        })
    }
})

</script>

<template>
    <div class="code-editor" style="height: 300px;" ref="editorTag"></div>
</template>

<style>
@import "monaco-editor/min/vs/editor/editor.main.css";
</style>