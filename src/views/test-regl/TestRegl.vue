<template>
  <div>
    <canvas id="preview-canvas" width="500" height="300"></canvas>
  </div>
</template>

<script>
import GLTransitions from 'gl-transitions';
import createREGL from 'regl';
import createREGLTransition from 'regl-transition';

export default {
  name: 'TestRegl',
  data() {
    return {
      videoSrcs: [require('@/assets/video/1.mp4'), require('@/assets/video/2.mp4')]
    };
  },
  methods: {},
  mounted() {
    const createVedio = (src) => {
      const video = document.createElement('video');
      video.width = 500;
      video.height = 400;
      video.crossOrigin = 'anonymous';
      video.preload = 'auto';
      video.load();
      video.src = src;
      video.loop = true;
      video.controls = true;
      video.muted = true;
      // video.autoplay = true;
      video.play();
      return video;
    };

    // const regl = createREGL({
    //   container: this.glDemo.nativeElement,
    //   gl: this.webgl
    // });
    const delay = 1;
    const duration = 1.5;
    const regl = createREGL(document.querySelector('canvas'));
    const transitions = GLTransitions.map((t) => createREGLTransition(regl, t));
    console.log('transitions====>>>', transitions);
    const videos = this.videoSrcs.map(createVedio);
    setTimeout(() => {
      // 延迟一下，等video加载完
      regl.frame(({ time }) => {
        const slides = videos.map((video) => regl.texture(video).subimage(video));
        const index = Math.floor(time / (delay + duration));
        const from = slides[index % slides.length];
        const to = slides[(index + 1) % slides.length];
        const transition = transitions[index % transitions.length];
        const total = delay + duration;
        const progress = Math.max(0, (time - index * total - delay) / duration);

        transition({ progress, from, to });
      });
    }, 1000);
  }
};
</script>
