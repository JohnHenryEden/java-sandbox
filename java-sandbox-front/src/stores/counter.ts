import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCodeResultStore = defineStore('counter', () => {
  const codeResult = ref('')
  function setResult(res: string) {
    codeResult.value = res
  }

  return { codeResult, setResult }
})
