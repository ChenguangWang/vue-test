<template>
  <div class="loader">
    <!-- <img src="../../assets/loader.svg" /> -->
    <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
    <p>We limit the loading speed for demo purpose only.</p>
  </div>
</template>

<script>
export default {
  name: 'LoaderComponent'
};
</script>

<style scoped>
.loader {
  width: 100%;
  text-align: center;
}
</style>
