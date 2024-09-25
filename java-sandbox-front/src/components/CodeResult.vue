<script setup lang="ts">
defineProps<{
  outputs: string
}>()
</script>

<template>
  <div class="output-space">
    {{ outputs }}
  </div>
</template>

<style scoped>
.output-space {
  height: 80vh;
  width: 45vw;
  margin-left: 50px;
  border: 1px solid white;
  padding: 10px;
}
</style>
