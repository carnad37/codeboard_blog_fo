<script setup lang="ts">

import {useCBFetch} from "~/composables/custom-fetch";
import {VForm} from "vuetify/components/VForm";
import {ArticleContent, ArticleData, EditorType} from "~/composables/common-interface";
import EditorSelector from "~/components/common/EditorSelector.vue";
import {useAlertStore} from "#imports";

// props
interface Props {
    modelValue?: boolean
    articleData?: ArticleData
}
const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
})

const emits = defineEmits(['update:modelValue'])

// constant

// refs
const form = ref<VForm|null>(null)

// reactive
const isEdit = computed(()=>{
    return !!props.articleData
})
const tVisible = computed({
    get() {
        return props.modelValue
    },
    set(val : boolean) {
        emits('update:modelValue', val)
    }
})

// data
const title = ref(isEdit ? props.articleData?.title : '' )
const summary = ref(isEdit ? props.articleData?.summary : '' )
const initContent :ArticleContent = {
    articleSeq: 0,
    content: '',
    editor: EditorType.TextArea
}
const contents = ref(isEdit ? props.articleData?.contents || [initContent] : [initContent])

// method
const articleSave = async ()=>{
    if (await useValidateForm(form)) {
        const param = {title: title.value, summary: summary.value, contents : contents.value}
        const result = await useCBFetch().post<ArticleData>('/api/blog/private/article/save', {body: param})
        // let responseArticle = new ArticleData();
        // if (result.data?.data) {
        //     responseArticle = result.data.data
        // } else return
        // 부모 리스트 재로딩
    }
}

const addEditor = (index : number)=>{
    const targetList = contents.value
    targetList.splice(index + 1, 0, {
        articleSeq: isEdit.value ? props.articleData?.seq || 0 : 0,
        content: '',
        editor: EditorType.TextArea
    })
}
const delEditor = (index : number)=>{
    if (contents.value?.length > 1) {
        contents.value.splice(index, 1)
    } else {
        useAlertStore().open('콘텐츠는 하나이상 입력되어야합니다.')
    }
}
const movePrev = (idx : number)=>{
    const targetList = contents.value
    if (targetList?.length > 1 && idx !== 0) {
        const keep = targetList[idx - 1]
        targetList[idx - 1] = targetList[idx]
        targetList[idx] = keep
    }
}
const moveNext = (idx : number)=>{
    const targetList = contents.value
    if (targetList?.length > 1 && contents.value.length - 1 !== idx) {
        const keep = targetList[idx + 1]
        targetList[idx + 1] =  targetList[idx]
        targetList[idx] = keep
    }
}


</script>

<template>
    <v-dialog class="mx-auto my-auto article-editor" v-model="tVisible" :persistent="true">
        <v-card>
            <v-form ref="form">
            <v-container class="pa-8">
                <v-row>
                    <v-col>
                        <v-text-field variant="underlined" label="제목" v-model="title" :clearable="true"/>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-textarea variant="outlined" label="요약" v-model="summary" :clearable="true"></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-divider class="ma-3" :style="{'border-color': 'black', 'opacity' : '1'}" thickness="2">텍스트</v-divider>
                </v-row>
                <v-row v-for="(item, cIdx) in contents" :key="`editor-selector-${cIdx}`">
                    <v-col>
                        <EditorSelector
                            v-model:editor-type="item.editor"
                            v-model="item.content"
                            :editor-index="cIdx"
                            :key="`editor_${item.seq || 0}_${cIdx}`"
                            @add-editor="addEditor(cIdx)"
                            @del-editor="delEditor(cIdx)"
                            @move-prev="movePrev(cIdx)"
                            @move-next="moveNext(cIdx)"
                            :is-first="cIdx === 0"
                            :is-last="contents.length - 1 === cIdx"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="pb-6 text-center">
                        <v-btn variant="elevated" height="45" width="80"  class="font-weight-bold text-h6" color="indigo-accent-4" @click.self.prevent="articleSave()" v-text="isEdit ? '수정' : '등록'"></v-btn>
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

<style>
.article-editor {
    width: 80%;
    height: 80%;
}
@media screen and (max-width: 900px) {
    .article-editor {
        width: 100%;
        .v-overlay__content {
            width: 100% !important;
            max-width: 100% !important;
        }
    }
}
@media screen and (max-width: 600px) {
    .article-editor {
        height: 100vh;
        .v-overlay__content {
            max-height: 100%;
            margin: 0;
        }
    }
}


</style>