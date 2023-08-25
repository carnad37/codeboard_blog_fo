<script setup lang="ts">


interface Props {
    modelValue: string  // show flag
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
})

// const CKE = CKEditor.component

</script>

<template>
  <ckeditor v-model="props.modelValue"></ckeditor>
</template>

<style>

</style>