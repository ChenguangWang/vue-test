<template>
  <div>
    <canvas ref="glCanvas" width="500" height="300"></canvas>
  </div>
</template>

<script>
import GLTransitions from 'gl-transitions';
import createREGL from 'regl';
import createREGLTransition from 'regl-transition';

export default {
  name: 'TestGl',
  data() {
    return {
      delay: 1,
      duration: 1.5,
      imgSrcs: [
        require('@/assets/img/1.jpg'),
        require('@/assets/img/2.jpg'),
        require('@/assets/img/3.jpg'),
        require('@/assets/img/4.jpg')
      ]
    };
  },
  methods: {},
  mounted() {
    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.onabort = reject;
        img.crossOrigin = 'anonymous';
        img.src = src;
      });

    const delay = 1;
    const duration = 1.5;
    const regl = createREGL(document.querySelector('canvas'));
    const transitions = GLTransitions.map((t) => createREGLTransition(regl, t));

    Promise.all(this.imgSrcs.map(loadImage)).then((imgs) => {
      const slides = imgs.map((img) => regl.texture(img));
      regl.frame(({ time }) => {
        const index = Math.floor(time / (delay + duration));
        const from = slides[index % slides.length];
        const to = slides[(index + 1) % slides.length];
        const transition = transitions[index % transitions.length];
        const total = delay + duration;
        const progress = Math.max(0, (time - index * total - delay) / duration);
        transition({ progress, from, to });
      });
    });
  }
};
</script>

<style lang="less" scoped></style>
