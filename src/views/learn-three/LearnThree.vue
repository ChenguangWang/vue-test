<template>
  <div>
    <video :src="videoSrc" width="300" height="200" controls></video>
    <div id="stage" style="width: 500px; height: 300px; margin: 20px auto"></div>
  </div>
</template>

<script>
import * as THREE from 'three';

export default {
  name: 'LearnThree',
  data() {
    return {
      videoSrc: require('@/assets/video/2.mp4'),
      scene: undefined,
      camera: undefined,
      renderer: undefined,
      guiControls: undefined,
      mouseX: 0,
      mouseY: 0
    };
  },
  methods: {
    /** 场景 */
    initScene() {
      this.scene = new THREE.Scene();
    },
    /** 相机 */
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
      this.camera.position.set(0, 0, 8);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
    /** 渲染器 */
    initRender() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      const stage = document.querySelector('#stage');
      this.renderer.setSize(stage.clientWidth, stage.clientHeight);
      this.renderer.setClearColor(0xeeeeee);
      stage.appendChild(this.renderer.domElement);
    },
    /* 灯光 */
    initLight() {
      this.scene.add(new THREE.AmbientLight(0x404040));

      var spotLight1 = new THREE.SpotLight(0xffffff);
      spotLight1.position.set(-400, -400, -400);

      var spotLight2 = new THREE.SpotLight(0xffffff);
      spotLight2.position.set(400, 400, 400);

      this.scene.add(spotLight1);
      this.scene.add(spotLight2);
    },
    /* 场景中的内容 */
    initContent() {
      var planeGeometry = new THREE.PlaneGeometry(4, 6.5);
      var material = new THREE.MeshPhongMaterial();
      material.side = THREE.DoubleSide;

      var mesh = new THREE.Mesh(planeGeometry, material);

      this.scene.add(mesh);

      var video = document.querySelector('video');
      var texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;

      material.map = texture;
    },
    /* 窗口变动触发 */
    onWindowResize() {
      const stage = document.querySelector('#stage');
      this.camera.aspect = stage.clientWidth / stage.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(stage.clientWidth, stage.clientHeight);
    },
    onDocumentMouseMove(event) {
      this.mouseX = (event.clientX - window.innerWidth / 2) * 0.01;
      this.mouseY = (event.clientY - window.innerHeight / 2) * 0.01;
    },
    /* 数据更新 */
    update() {
      // this.stats.update();

      this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.005;
      this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.005;
      this.camera.lookAt(this.scene.position);
    },
    /* 循环渲染 */
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      this.update();
    },
    /* 初始化 */
    init() {
      this.initScene();
      this.initCamera();
      this.initRender();
      this.initLight();
      this.initContent();
      /* 监听事件 */
      window.addEventListener('resize', this.onWindowResize, false);
      // document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    }
  },
  mounted() {
    this.init();
    this.animate();
  }
};
</script>

<style></style>
