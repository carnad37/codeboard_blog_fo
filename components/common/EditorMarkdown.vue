<script setup lang="ts">
import {Editor} from "@toast-ui/editor";

interface Props {
    modelValue: string  // show flag
    loadCallback? : ()=>void
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    loadCallback: ()=>{}
})

const emits = defineEmits(['update:modelValue'])

const contents = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        return emits("update:modelValue", val)
    }
})

// 이미지 업로드 로직
const customUploadFile = (file : File, callback? :()=>void)=>{
    const request = new FormData();
}

const editorTag : Ref<HTMLElement | null> = ref(null)
let editor : Editor | null = null
let firstFlag = true

onMounted(()=>{
    if (editorTag.value) {
        editor = new Editor({
            el: editorTag.value,
            previewStyle: 'vertical',
            height: '500px',
            initialValue: contents.value,
            events: {
                change: ()=>{
                    contents.value = editor?.getMarkdown() || ''
                },
                focus:()=>{
                    if (firstFlag) {
                        firstFlag = false
                        props.loadCallback()
                    }
                }
            },
            autofocus: true,
        });
    }
})

onBeforeUnmount(()=>{
    editor?.destroy()
})

</script>

<template>
    <div class="html-editor-wrap">
        <div class="html-editor" style="height: 300px;" ref="editorTag"></div>
    </div>
</template>

<style lang="scss" scoped>
@import "assets/scss/toast_ui";
</style>