<template>
  <div class="title" :style="{ height: `${item.height}px` }">
    <h2 @click="$emit('event-test')">{{ item.injected.title }}</h2>
  </div>
</template>

<script>
export default {
  name: 'TitleComponent',
  props: ['item']
};
</script>

<style scoped>
.title {
  display: inline-grid;
  align-items: center;
  width: 100%;
  color: #fff;
  background: #666;

  border-radius: 3px;
}
</style>
