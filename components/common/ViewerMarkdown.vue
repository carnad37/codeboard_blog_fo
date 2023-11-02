<script setup lang="ts">
import {Editor} from "@toast-ui/editor";
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';

interface Props {
    modelValue: string  // show flag
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
})

const emits = defineEmits(['update:modelValue'])

const contents = computed(()=>{
    return props.modelValue
})

const editorTag : Ref<HTMLElement | null> = ref(null)
let editor : Viewer | null = null

onMounted(()=>{
    if (editorTag.value) {
        editor = new Viewer({
            el: editorTag.value,
            initialValue: contents.value
        });
    }
})

onBeforeUnmount(()=>{
    editor?.destroy()
})

</script>

<template>
    <div>
        <div class="html-editor" ref="editorTag"></div>
    </div>
</template>

<style lang="scss" scoped>
@import 'assets/scss/toast_ui';
</style>