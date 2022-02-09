<template>
  <div>
    <canvas ref="glCanvas" :width="width * pixelRatio" :height="height * pixelRatio"></canvas>
    <VueGlTransition
      :canvas="canvas"
      :name="name"
      :from="from"
      :to="to"
      :progress.sync="progress"
      :duration="duration"
      :defaultParams="{ depth: 2, perspective: 0.4, reflection: 1 }"
    />
  </div>
</template>

<script>
import VueGlTransition from 'vue-gl-transitions';

export default {
  name: 'TestGl',
  components: { VueGlTransition },
  data() {
    return {
      canvas: '',
      name: 'doorway',
      defaultParams: {},
      duration: 5,
      progress: 0,
      from: '',
      to: '/logo.png',
      width: 360,
      height: 203,
      pixelRatio: 1
    };
  },
  computed: {
    widthPR() {
      const { width, pixelRatio } = this;
      return width * pixelRatio;
    },
    heightPR() {
      const { height, pixelRatio } = this;
      return height * pixelRatio;
    }
  },
  methods: {
    getDevicePixelRatio() {
      this.pixelRatio = Number((typeof window === 'object' && window.devicePixelRatio) || 1);
    }
  },
  mounted() {
    this.canvas = this.$refs.glCanvas;
    this.from = this.$refs.toVideo;
    window.addEventListener('resize', this.getDevicePixelRatio);
  },
  destroyed() {
    window.removeEventListener('resize', this.getDevicePixelRatio);
  }
};
</script>

<style lang="less" scoped></style>
