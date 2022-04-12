<template>
  <div :style="{ height: item.height + 'px' }">
    <iframe
      width="100%"
      :height="item.height"
      frameborder="0"
      scrolling="no"
      marginheight="0"
      marginwidth="0"
      :src="`https://www.openstreetmap.org/export/embed.html?bbox=${item.injected.coordinates}&amp;layer=mapnik`"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'MapComponent',
  props: ['item']
};
</script>

<style scoped></style>
