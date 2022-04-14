<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <br />
    <router-link to="/testVideo">视频测试</router-link>
    <br />
    <router-link to="/testGl">GL测试</router-link>
    <br />
    <router-link to="/testRegl">REGL测试</router-link>
    <br />
    <router-link to="/testSplitPanel">Split-Panel测试</router-link>
    <br />
    <router-link to="/testResl">Resl测试</router-link>
    <br />
    <router-link to="/learnThree">learnThree</router-link>
    <br />
    <router-link to="/virtual-grid">virtual-grid</router-link>
    <br />
    <router-link to="/test-drag">test-drag</router-link>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {}
};
</script>
