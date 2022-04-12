<template>
  <img :src="item.injected.url" :title="item.injected.alt" :style="{ height: item.height + 'px' }" class="image" />
</template>

<script>
export default {
  name: 'ImageComponent',
  props: ['item']
};
</script>

<style scoped>
.image {
  position: relative;
  width: 100%;
  height: auto;
  vertical-align: top;
  background: hsl(0, 0%, 98%);
  transition: 100ms ease;
  transition-property: transform box-shadow;
  border-radius: 3px;
}
.image:hover {
  z-index: 1;
  transform: scale(1.25);
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14),
    0 9px 46px 8px rgba(0, 0, 0, 0.12);
}
</style>
