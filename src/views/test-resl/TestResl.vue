<template>
  <div>
    <canvas id="reslCanvas" width="600" height="500"></canvas>
  </div>
</template>

<script>
import Regl from 'regl';
import resl from 'resl';

export default {
  name: 'TestResl',
  mounted() {
    const regl = Regl(document.querySelector('#reslCanvas'));
    const drawDoggie = regl({
      frag: `
    precision mediump float;
    uniform sampler2D texture;
    uniform vec2 screenShape;
    uniform float time;
    varying vec2 uv;
    void main () {
      vec4 color = texture2D(texture, uv);
      float chromakey = step(0.15 + max(color.r, color.b), color.g);
      gl_FragColor = color;
    }`,

      vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;
    void main () {
      uv = position;
      gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
    }`,

      attributes: {
        position: [-2, 0, 0, -2, 2, 2]
      },

      uniforms: {
        texture: regl.prop('video'),
        screenShape: ({ viewportWidth, viewportHeight }) => [viewportWidth, viewportHeight],
        time: regl.context('time')
      },

      count: 3
    });
    resl({
      manifest: {
        video: {
          type: 'video',
          src: require('@/assets/video/2.mp4'),
          stream: true
        }
      },
      onDone: ({ video }) => {
        document.body.appendChild(video);
        // video.autoplay = true;
        // video.loop = true;
        video.load();
        document.addEventListener('click', () => {
          console.log('click');
          video.play();
          const texture = regl.texture({ height: 300, width: 200, data: video });
          regl.frame(() => {
            // clear contents of the drawing buffer
            regl.clear({
              color: [0, 0, 0, 1],
              depth: 1
            });
            drawDoggie({ video: texture.subimage(video) });
          });
        });
      }
    });
  }
};
</script>

<style></style>
