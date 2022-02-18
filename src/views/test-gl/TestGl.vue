<template>
  <div>
    <canvas ref="glCanvas" width="500" height="300"></canvas>
  </div>
</template>

<script>
import transitions from 'gl-transitions';
import createTransition from 'gl-transition';
import createTexture from 'gl-texture2d';

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

    //加载图片
    Promise.all(this.imgSrcs.map(loadImage)).then((imgs) => {
      //创建画布
      const canvas = document.querySelector('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 4, 4, -1]), // see a-big-triangle
        gl.STATIC_DRAW
      );
      gl.viewport(0, 0, canvas.width, canvas.height);

      //生成过渡需要的texture
      const slides = imgs.map((img) => {
        const from = createTexture(gl, img);
        from.minFilter = gl.LINEAR;
        from.magFilter = gl.LINEAR;
        return from;
      });
      //const transition = createTransition(gl, transitions.find(t => t.name === "BowTieVertical"));
      var transition = createTransition(gl, transitions[0], { resizeMode: 'cover' });
      var tmpIndex = -1;

      const step = (timestamp) => {
        const time = Math.floor(timestamp / 1000);
        const index = Math.floor(time / (delay + duration));
        const from = slides[index % slides.length];
        const to = slides[(index + 1) % slides.length];

        //console.info(index);
        if (index + 1 < slides.length) {
          window.requestAnimationFrame(step);

          if (tmpIndex != index) {
            console.info(tmpIndex, index);
            tmpIndex = index;
            //const transitionIndex = index%transitions.length;
            //随机过渡
            const transitionIndex = Math.floor(Math.random() * transitions.length);
            //console.info('transitionIndex:'+transitionIndex);
            transition = createTransition(gl, transitions[transitionIndex], { resizeMode: 'cover' });
          }

          const total = delay + duration;
          const progress = Math.max(0, (timestamp - index * total * 1000 - delay * 1000) / (duration * 1000)); //0-1的数，其实就是百分比
          //console.info(index,timestamp);
          //开始过渡
          transition.draw(progress, from, to, canvas.width, canvas.height, { persp: 1.5, unzoom: 0.6 });
        }
      };
      //step();
      window.requestAnimationFrame(step);
    });
  }
};
</script>

<style lang="less" scoped></style>
