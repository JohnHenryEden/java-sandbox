<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h3>Welcome to my online coding platform</h3>
    <h6>Please give constructive feedbacks, thanks!</h6>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

h6 {
  position: absolute;
  bottom: 5px;
}

.greetings h1 {
  text-align: center;
}

.greetings h3 {
  text-align: center;
}
</style>
