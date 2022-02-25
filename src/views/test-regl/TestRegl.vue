<template>
  <div>
    <canvas id="preview-canvas" width="500" height="300"></canvas>
  </div>
</template>

<script>
import GLTransitions from 'gl-transitions';
import createREGL from 'regl';
import createREGLTransition from 'regl-transition';

// import transitions from 'gl-transitions';
// import createTransition from 'gl-transition';
// import createTexture from 'gl-texture2d';

export default {
  name: 'TestRegl',
  data() {
    return {
      videoSrcs: [require('@/assets/video/1.mp4'), require('@/assets/video/2.mp4')],
      tick: null
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
      video.src = src;
      video.loop = true;
      video.controls = true;
      video.muted = true;
      video.load();
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
      this.tick = regl.frame(({ time }) => {
        // regl.texture(videos[0]).subimage(videos[0]);
        const slides = videos.map((video) => regl.texture(video).subimage(video));
        const index = Math.floor(time / (delay + duration));
        const from = slides[index % slides.length];
        const to = slides[(index + 1) % slides.length];
        const total = delay + duration;
        const progress = Math.max(0, (time - index * total - delay) / duration);
        transitionFunc({ progress, from, to });
      });
      setTimeout(() => {
        this.tick.cancel();
      }, 10000);
    }, 1000);

    //加载视频
    // Promise.all(this.videoSrcs.map(createVedio)).then((videos) => {
    //   //创建画布
    //   const canvas = document.querySelector('canvas');
    //   const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    //   // 把图片上下对称翻转坐标轴
    //   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    //   // 创建并初始化顶点着色器对象
    //   const buffer = gl.createBuffer();
    //   // 将创建的着色器对象buffer 绑定到 gl.ARRAY_BUFFER
    //   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    //   // 创建并初始化buffer对象的数据存储区
    //   gl.bufferData(
    //     gl.ARRAY_BUFFER,
    //     new Float32Array([-1, -1, -1, 4, 4, -1]), // see a-big-triangle
    //     gl.STATIC_DRAW
    //   );
    //   // 设置视口 gl.viewport(x, y, width, height);
    //   gl.viewport(0, 0, canvas.width, canvas.height);

    //   //生成过渡需要的texture
    //   const slides = videos.map((img) => {
    //     debugger;
    //     const from = createTexture(gl, img);
    //     from.minFilter = gl.LINEAR;
    //     from.magFilter = gl.LINEAR;
    //     return from;
    //   });
    //   //const transition = createTransition(gl, transitions.find(t => t.name === "BowTieVertical"));
    //   var transition = createTransition(gl, transitions[0], { resizeMode: 'cover' });
    //   var tmpIndex = -1;

    //   const step = (timestamp) => {
    //     const time = Math.floor(timestamp / 1000);
    //     const index = Math.floor(time / (delay + duration));
    //     const from = slides[index % slides.length];
    //     const to = slides[(index + 1) % slides.length];

    //     //console.info(index);
    //     if (index + 1 < slides.length) {
    //       window.requestAnimationFrame(step);

    //       if (tmpIndex != index) {
    //         console.info(tmpIndex, index);
    //         tmpIndex = index;
    //         //const transitionIndex = index%transitions.length;
    //         //随机过渡
    //         const transitionIndex = Math.floor(Math.random() * transitions.length);
    //         //console.info('transitionIndex:'+transitionIndex);
    //         transition = createTransition(gl, transitions[transitionIndex], { resizeMode: 'cover' });
    //       }

    //       const total = delay + duration;
    //       const progress = Math.max(0, (timestamp - index * total * 1000 - delay * 1000) / (duration * 1000)); //0-1的数，其实就是百分比
    //       //开始过渡
    //       transition.draw(progress, from, to, canvas.width, canvas.height, { persp: 1.5, unzoom: 0.6 });
    //     }
    //   };
    //   //step();
    //   window.requestAnimationFrame(step);
    // });
  },
  destroyed() {
    console.log('regl 清除动画');
    this.tick && this.tick.cancel();
  }
};
</script>
