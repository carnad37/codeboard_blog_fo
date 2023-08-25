<script setup lang="ts">

import {CommonResponse, useCBFetch} from "~/composables/custom-fetch";
import {COMMON} from "~/constants/common/common";
import {LoginResponse} from "~/composables/user-auth";
import {VForm} from "vuetify/components/VForm";
import {WritableComputedRef} from "@vue/reactivity";
import {ArticleData} from "~/composables/common-interface";
import HtmlEditor from "~/components/common/HtmlEditor.vue";
import EditorCode from "~/components/common/EditorCode.vue";

// props
interface Props {
    modelValue?: boolean
    articleData: ArticleData | null
}
const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    articleData: null
})

const emits = defineEmits(['update:modelValue'])

// constant

// refs
const form = ref<VForm|null>(null)

// reactive
const isEdit = computed(()=>{
    return props.articleData !== null
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
const title = ref('')
const summary = ref('')
const content = ref('')

// method
const articleSave = async ()=>{
    if (await useValidateForm(form)) {
        const param = {title: title.value, summary: summary.value, content: content.value}
        const result = await useCBFetch().post<ArticleData>('/api/blog/private/article/save', {body: param})
        // let responseArticle = new ArticleData();
        // if (result.data?.data) {
        //     responseArticle = result.data.data
        // } else return
        // 부모 리스트 재로딩
    }
}

</script>

<template>
    <v-dialog class="mx-auto article-editor" v-model="tVisible" :persistent="true">
        <v-card :style="{overflow : 'visible'}">
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
                    <v-col style="height: 100%">
                        <v-textarea variant="outlined" v-model="summary" :clearable="true"></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-divider class="ma-3" :style="{'border-color': 'black', 'opacity' : '1'}" thickness="2">텍스트</v-divider>
                </v-row>
                <v-row>
                    <v-col style="height: 100%">
                        <div class="my-2 border-sm rounded-s overflow-hidden" :style="{'border-color' : 'gray !important', 'opacity' : '1'}">
                            <EditorCode v-model="content"></EditorCode>
                        </div>
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

</style>