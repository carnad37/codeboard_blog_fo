<script setup lang="ts">
import {Editor} from "@toast-ui/editor";
import {MdLikeNode} from "@toast-ui/editor/types/markdown";
import {CommonResponse} from "~/composables/custom-fetch";
import {BlogFile} from "~/composables/common-interface";
import {HookCallback} from "@toast-ui/editor/types/editor";

interface Props {
    modelValue: string  // show flag
    loadCallback? : ()=>void
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    loadCallback: ()=>{}
})

const emits = defineEmits(['update:modelValue', 'update:uploadFile'])


const contents = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        return emits("update:modelValue", val)
    }
})

// 이미지 업로드 로직
const uploadImageFile = async (file : Blob | File, callback :(url: string, alt?: string)=> void)=>{
    const request = new FormData();

    // 처음 저장할때는 typeSeq값이 없다.
    request.set("uploadFile", file);

    const { success, data : resultData } = await useCBFetch().post<BlogFile>("/api/blog/private/article/saveImage", {body : request});
    if (success && resultData && resultData.data?.savFileName && resultData.data?.seq) {
        const fileName = resultData.data.savFileName;
        const seq = resultData.data?.seq

        // 이미지 정보 저장
        emits("update:uploadFile", seq)
        callback(useRuntimeConfig().public.imgURL + fileName, '이미지')
    } else {
        useAlertStore().open("이미지 업로드에 실패하였습니다.")
    }

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
            hooks: {
                addImageBlobHook: uploadImageFile
            },
            events: {
                change: ()=>{
                    contents.value = editor?.getMarkdown() || ''
                },
                focus:()=>{
                    if (firstFlag) {
                        firstFlag = false
                        props.loadCallback()
                    }
                },
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