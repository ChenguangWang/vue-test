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
    // 可调整不同转场 https://www.cnblogs.com/nlsoft/p/12059458.html
    let transName = 'doorway';
    const regl = createREGL(document.querySelector('canvas'));
    const transitions = GLTransitions.filter((t) => t.name == transName);
    const transitionFunc = createREGLTransition(regl, transitions[0]);
    const videos = this.videoSrcs.map(createVedio);
    setTimeout(() => {
      // 延迟一下，等video加载完
      // let tick = regl.frame(({ time }) => {
      regl.frame(({ time }) => {
        // regl.texture(videos[0]).subimage(videos[0]);
        const slides = videos.map((video) => regl.texture(video).subimage(video));
        const index = Math.floor(time / (delay + duration));
        const from = slides[index % slides.length];
        const to = slides[(index + 1) % slides.length];
        const total = delay + duration;
        const progress = Math.max(0, (time - index * total - delay) / duration);
        transitionFunc({ progress, from, to });
      });
      // setTimeout(() => {
      //   tick.cancel();
      // }, 1500);
    }, 1000);
  }
};
</script>
