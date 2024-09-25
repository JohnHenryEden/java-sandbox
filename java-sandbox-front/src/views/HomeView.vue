<script setup lang="ts">
import MonacoEditor from '../components/MonacoEditor.vue'
import CodeResult from '../components/CodeResult.vue'

import { useCodeResultStore } from '@/stores/counter'
const store = useCodeResultStore()
</script>

<template>
  <main class="main-container">
    <MonacoEditor></MonacoEditor>
    <CodeResult :outputs="store.codeResult"></CodeResult>
  </main>
</template>
<style scoped>
.main-container {
  display: flex;

  margin-top: 1vw;
}
</style>
