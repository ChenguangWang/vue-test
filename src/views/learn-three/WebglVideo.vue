<template>
  <div>
    <canvas id="webgl" width="500" height="300" style="background-color: #eee"></canvas>
    <button type="button" id="btn">change</button>
  </div>
</template>

<script>
export default {
  name: 'WebglVideo',
  mounted() {
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');

    // 创建视频
    var video = document.createElement('video');
    var videoready = false;
    // video.loop = true;
    video.onplaying = function () {
      videoready = true;
    };
    video.crossOrigin = 'anonymous';
    video.src = require('@/assets/video/1.mp4');
    video.autoplay = 'autoplay';
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    var video2 = document.createElement('video');
    videoready = false;
    // video2.loop = true;
    video2.onplaying = function () {
      videoready = true;
    };
    video2.crossOrigin = 'anonymous';
    video2.src = require('@/assets/video/2.mp4');
    video2.autoplay = 'autoplay';
    video2.setAttribute('playsinline', '');
    video2.setAttribute('webkit-playsinline', '');

    video2.addEventListener('error', (e) => {
      console.log('e', e);
    });

    var vertexShaderSource = `
  attribute vec2 pos;
  varying vec2 tx;
  void main() {
    gl_Position=vec4(pos.x*2.0-1.0,1.0-pos.y*2.0,0,1);
    tx=pos;
  }`;

    var fragmentShaderSource1 = `
  precision lowp float;
  uniform sampler2D texture;
  uniform float h;
  uniform float v;
  varying vec2 tx;
  void main() {
    if(tx.x > 0.5){
       vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );
      //纵向高斯模糊
      sum += texture2D( texture, vec2( tx.x, tx.y - 4.0 * v ) ) * (0.051/2.0);
      sum += texture2D( texture, vec2( tx.x, tx.y - 3.0 * v ) ) * (0.0918/2.0);
      sum += texture2D( texture, vec2( tx.x, tx.y - 2.0 * v ) ) * (0.12245/2.0);
      sum += texture2D( texture, vec2( tx.x, tx.y - 1.0 * v ) ) * (0.1531/2.0);
      sum += texture2D( texture, vec2( tx.x, tx.y ) ) * (0.1633/2.0);
      sum += texture2D( texture, vec2( tx.x, tx.y + 1.0 * v ) ) * (0.1531/2.0);
      sum += texture2D( texture, vec2( tx.x, tx.y + 2.0 * v ) ) * (0.12245/2.0);
      sum += texture2D( texture, vec2( tx.x, tx.y + 3.0 * v ) ) * (0.0918/2.0);
      sum += texture2D( texture, vec2( tx.x, tx.y + 4.0 * v ) ) * (0.051/2.0);
      //横向高斯模糊
      // sum += texture2D( texture, vec2( tx.x - 4.0 * h, tx.y ) ) * (0.051/2.0);
      // sum += texture2D( texture, vec2( tx.x - 3.0 * h, tx.y ) ) * (0.0918/2.0);
      // sum += texture2D( texture, vec2( tx.x - 2.0 * h, tx.y ) ) * (0.12245/2.0);
      // sum += texture2D( texture, vec2( tx.x - 1.0 * h, tx.y ) ) * (0.1531/2.0);
      // sum += texture2D( texture, vec2( tx.x, tx.y ) ) * (0.1633/2.0);
      // sum += texture2D( texture, vec2( tx.x + 1.0 * h, tx.y ) ) * (0.1531/2.0);
      // sum += texture2D( texture, vec2( tx.x + 2.0 * h, tx.y ) ) * (0.12245/2.0);
      // sum += texture2D( texture, vec2( tx.x + 3.0 * h, tx.y ) ) * (0.0918/2.0);
      // sum += texture2D( texture, vec2( tx.x + 4.0 * h, tx.y ) ) * (0.051/2.0);
      gl_FragColor = sum;
    } else {
      gl_FragColor = texture2D(texture, tx);
    }
  }`;

    //初始化着色器
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource1);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    //获取顶点着色器的位置变量pos
    var pos = gl.getAttribLocation(program, 'pos');
    //允许数据传递
    gl.enableVertexAttribArray(pos);

    //获取着色器
    gl.uniform1f(gl.getUniformLocation(program, 'v'), 10.0);
    gl.uniform1f(gl.getUniformLocation(program, 'h'), 10.0);

    //创建缓冲区对象
    //顶点缓冲
    var vpos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vpos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
    //索引缓冲
    var ipos = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ipos);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.activeTexture(gl.TEXTURE0);

    var d = true;

    function loop() {
      if (videoready) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, d ? video : video2);
        gl.bindBuffer(gl.ARRAY_BUFFER, vpos);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ipos);
        //缓冲区中的数据传递pos
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
        //开始绘制图形
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      }
      window.requestAnimationFrame(loop);
    }

    loop();

    var btn = document.getElementById('btn');
    btn.addEventListener('click', () => {
      d = !d;
      // if (d) {
      //   video.play();
      //   // video.muted = true;
      //   // video2.muted = false;
      //   video2.pause();
      // } else {
      //   video2.play();
      //   // video2.muted = true;
      //   // video.muted = false;
      //   video.pause();
      // }
    });
  }
};
</script>

<style></style>
