<script setup lang="ts">
import {ArticleData, EditorType, YN} from "~/composables/common-interface";
import {useCBFetch} from "~/composables/custom-fetch";
import { marked } from 'marked';

interface PostData {
  seq: number
  title: string
  content: string
  summary: string
  publicFlag: YN
  boardSeq: number
  categorySeq: number
}

definePageMeta({
 layout: 'menu-layout'
})

const articleSeq = useRoute().params.articleSeq
let resultSeq = 0
try {
    resultSeq = parseInt(articleSeq as string)
} catch (e) {
    throw new Error('잘못된 접근입니다.')
}

const articleResult = await useCBFetch().get<ArticleData>('/api/blog/private/article/find', {params: {seq : resultSeq}})
if (!articleResult.data?.data) {
    throw new Error('잘못된 접근입니다.')
}

const articleInfo = ref(articleResult.data.data)

// 함수꺼내기(markdown -> html)
const markedPaser = marked.parse
</script>

<template>
    <div class="article-wrapper pl-12 pr-12">
        <div class="article-header mt-7">
            <div class="text-h4" v-text="articleInfo.title"/>
        </div>
        <v-expansion-panels v-if="articleInfo.summary" class="article-summary mt-5 pr-5 pl-5" variant="accordion" >
            <v-expansion-panel>
                <v-expansion-panel-title style="min-height: 0">
                    요약
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <div class="mt-3">
                        {{ articleInfo.summary }}
                    </div>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-divider class="mt-5" thickness="2"></v-divider>
        <template v-for="(content, idx) in articleInfo.contents">
            <div class="article-content mt-5" v-html="content.editor === EditorType.MarkdownEditor ? markedPaser(content.content) : content.content"/>
        </template>
        <div class="article-comment">

        </div>
    </div>
</template>

<style scoped>
.article-wrapper {
}
</style>