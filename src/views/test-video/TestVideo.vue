<template>
  <div>
    <div class="header">
      <div class="preview-wrap" :style="{ transform: 'scale(' + transformScale + ') translate(-50%)' }">
        <canvas id="myCanvas" width="1280" height="720"></canvas>
        <template v-for="item of subtitles">
          <!-- 字幕开始出现时间 <= 播放时间 <= 字幕开始出现时间 + 持续时间；例如：字幕出现在第3秒，持续时间5秒，即到第八秒字幕就消失了 -->
          <vue-draggable-resizable
            :key="item.id"
            v-if="item.startTime <= playingTime && playingTime <= item.startTime + item.duration"
            w="auto"
            h="auto"
            :handles="[]"
            :x="item.x"
            :y="item.y"
            :scale="transformScale"
            @dragstop="(x, y) => subtitleOnDrag(item, x, y)"
            :parent="true"
          >
            <template v-if="item.type == 'img'">
              <div class="charlet animate__animated animate__repeat-1">
                <img :src="item.src" alt="" width="100" height="100" />
              </div>
            </template>
            <template v-else>
              <div v-html="item.style"></div>
            </template>
          </vue-draggable-resizable>
        </template>
      </div>
    </div>
    <br />
    播放时间：{{ playingTime }} ms

    <div style="margin: 24px 0">
      <Button type="primary" @click="preview" :disabled="disabledBtn">播放</Button>
      <Button @click="stop" style="margin: 0 24px">暂停</Button>
      <InputNumber :max="10" :min="1" v-model="jumpTimeSecond"></InputNumber>
      <Button type="text" @click="jumpSecond">跳转</Button>
      <Button @click="testEffects">测试</Button>
      <!-- <Button @click="huitui">回退到第5秒</Button> -->
      <br />
      <Select style="width: 100px; margin-left: 10px" placeholder="请选择动画" @on-change="setAnimate">
        <Option v-for="item in animateList" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select>
      <Select
        style="width: 100px; margin-left: 10px"
        placeholder="动画时长"
        @on-change="setAnimateConfig('duration', $event)"
      >
        <Option v-for="item in animateDurationList" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select>
      <Select
        style="width: 100px; margin-left: 10px"
        placeholder="动画次数"
        @on-change="setAnimateConfig('repeat', $event)"
      >
        <Option v-for="item in animateRepeatList" :value="item.value" :key="item.value">{{ item.name }}</Option>
      </Select>
    </div>

    <div class="media-list-wrap">
      <div class="media" v-for="item in demoList" :key="item.id">
        <div style="width: 258px; height: 192px; background: #000" v-if="item.type == 'video'">
          <video
            class="media-dom"
            controls="controls"
            style="width: 100%; height: 100%"
            :src="item.src"
            :custom-id="item.id"
          ></video>
        </div>
        <audio
          class="media-dom"
          controls="controls"
          v-if="item.type == 'audio'"
          :src="item.src"
          :custom-id="item.id"
        ></audio>
      </div>
    </div>
  </div>
</template>

<script>
// 拖拽组件
import VueDraggableResizable from 'vue-draggable-resizable';
// optionally import default styles
import 'vue-draggable-resizable/dist/VueDraggableResizable.css';
import MoEffects from './tools/mo.effects.js';

import 'animate.css';

export default {
  name: 'TestVideo',
  components: { VueDraggableResizable },
  data() {
    return {
      disabledBtn: true,
      mediaDoms: undefined,
      playingTime: 0, // 预览播放的进度（单位秒）
      playTimer: undefined, // 预览播放的定时器
      stopPreviewTimer: undefined, // 预览的播放器，用于停止预览

      mediaTimer: [], // 多媒体定时器列表

      canvasDom: undefined,
      canvasContext: undefined,
      timer: null,
      jumpTimeSecond: 0,

      currentAnimate: '', // 当前动画效果
      // 动画配置
      animateMap: {
        duration: '--animate-duration',
        repeat: '--animate-repeat'
      },
      animateList: [
        {
          name: '无',
          value: 'null'
        },
        {
          name: '心跳',
          value: 'animate__heartBeat'
        },
        {
          name: '上下移动',
          value: 'animate__shakeY'
        }
      ],
      animateDurationList: [
        {
          name: '1s',
          value: '1s'
        },
        {
          name: '2s',
          value: '2s'
        },
        {
          name: '0.5s',
          value: '0.5s'
        }
      ],
      animateRepeatList: [
        {
          name: '1次',
          value: '1'
        },
        {
          name: '2次',
          value: '2'
        },
        {
          name: '3次',
          value: '3'
        },
        {
          name: '无限',
          value: 'animate__infinite'
        }
      ],

      demoList: [
        {
          id: 2,
          type: 'video',
          src: 'https://addct-data-prod.s3.cn-north-1.jdcloud-oss.com/res/v/2022/02/17/3d/c869c7d9652159f79abcb94fb6906e.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220217T094915Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=EC6C989A6F53CFD5E7624212C554ECB6%2F20220217%2Fcn-north-1%2Fs3%2Faws4_request&X-Amz-Signature=6f47c4236eca92546b939a04b6f1d9bf966a5ac78a6a6563307c9f8423ac2c22',
          startTime: 0,
          // endTime: 40,
          duration: undefined
        },
        {
          id: 1,
          type: 'video',
          src: 'https://addct-data-prod.s3.cn-north-1.jdcloud-oss.com/res/v/2022/02/17/81/237cb5cae01bece899482687352b0c.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220217T094851Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=EC6C989A6F53CFD5E7624212C554ECB6%2F20220217%2Fcn-north-1%2Fs3%2Faws4_request&X-Amz-Signature=0b32d805d719eea3261240491bfacf671c1cba16571a3b8fb8d6d2597283bfa5',
          startTime: 9000,
          // endTime: 30,
          duration: undefined // 单位毫秒
        }
      ],
      subtitles: [
        {
          id: 1,
          origin: '朋友们，',
          style: '<span style="color: #fff; font-size:120px">朋友们，</span>',
          x: 0,
          y: 0,
          startTime: 1000,
          duration: 5000
        },
        {
          id: 2,
          origin: '千万别再乱买榴莲了',
          style:
            '<span style="color: #fff; font-size:120px;">千万别再乱买 <span style="color: red; font-size: 200px">榴莲</span>了</span>',
          x: 0,
          y: 0,
          startTime: 20000,
          duration: 5000
        },
        {
          id: 3,
          type: 'img',
          src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi-1-lanrentuku.qqxzb-img.com%2F2020%2F11%2F23%2F3f0c0f39-f17a-4b7c-8536-7b8a290dcacc.jpg%3FimageView2%2F2%2Fw%2F1024%2F&refer=http%3A%2F%2Fi-1-lanrentuku.qqxzb-img.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647686415&t=3abbfcc8ab9c0ce757e4321fee63a5d5',
          x: 0,
          y: 100,
          startTime: 0,
          duration: 20000
        }
      ]
    };
  },
  computed: {
    // 多媒体总时长
    durationTotal() {
      let timeTotal = [];
      this.demoList.forEach((item) => {
        timeTotal.push(item.startTime + item.duration);
      });
      return Math.max(...timeTotal);
    },
    // 缩放比例计算
    transformScale() {
      return 400 / 720;
    }
  },
  methods: {
    // 设置动画
    setAnimate(animate) {
      // if (this.currentAnimate == animate) {
      //   return;
      // }
      const element = document.querySelector('.charlet');
      this.currentAnimate && element.classList.remove(this.currentAnimate);
      if (animate) {
        this.currentAnimate = animate;
        this.$nextTick(() => {
          element.classList.add('animate__animated', animate);
        });
      }
    },
    // 设置动画属性
    setAnimateConfig(type, value) {
      const element = document.querySelector('.charlet');
      // element.style.setProperty('--animate-duration', '0.5s');
      if (type == 'repeat' && value == 'animate__infinite') {
        // 设置无限次
        element.classList.remove('animate__repeat-1');
        element.classList.add(value);
        return;
      } else if (type == 'repeat') {
        element.classList.remove('animate__infinite');
        element.classList.add('animate__repeat-1');
      }
      element.style.setProperty(this.animateMap[type], value);
      this.currentAnimate && this.setAnimate(this.currentAnimate);
    },
    // 跳转到第几秒
    jumpSecond() {
      this.playingTime = this.jumpTimeSecond * 1000;
      this.preview();
    },
    // 字幕拖拽
    subtitleOnDrag(data, x, y) {
      data.x = x;
      data.y = y;
      console.log('字幕拖拽后的元素====>>>', data);
    },
    // 播放
    preview() {
      let that = this;
      let remainderTime = that.durationTotal - that.playingTime;
      if (remainderTime < 1000) {
        that.playingTime = 0;
        remainderTime = that.durationTotal;
      }

      console.log(
        '视频总时长 ms===>>>',
        this.durationTotal,
        '已播放时间 ms===>>>',
        this.playingTime,
        '剩余时间 ms===>>>',
        remainderTime
      );

      // this.playingTime = 0;
      that.playTimer = setInterval(() => {
        let allPaused = true; // 视频全部都是暂停
        that.mediaDoms.forEach((item, index) => {
          /**
           *  预览时间 == 素材播放时间播放
           *  开始时间 < 预览时间 < 开始时间+时长
           *  非暂停状态
           * */
          if (!item.paused) {
            // 有视频在播放时，不补黑帧
            if (item.tagName == 'VIDEO') {
              allPaused = false;
            }
            return;
          }
          if (
            that.demoList[index].startTime == that.playingTime ||
            (that.demoList[index].startTime < that.playingTime &&
              that.playingTime < that.demoList[index].startTime + that.demoList[index].duration)
          ) {
            // 如果是从中间开始播放的，获取素材的开始播放位置
            if (
              that.demoList[index].startTime < that.playingTime &&
              that.playingTime < that.demoList[index].startTime + that.demoList[index].duration
            ) {
              item.currentTime = (that.playingTime - that.demoList[index].startTime) / 1000;
              console.log('暂停后跳转的视频时间=====>>>', item.currentTime);
            }
            if (that.demoList[index].type == 'video') {
              console.log('开始播放时间===>>>', that.playingTime);
              that.draw1(item);
            } else if (that.demoList[index].type == 'audio') {
              item.play();
            }
          }
        });
        // 相邻两段视频有间隙时，补黑帧
        if (allPaused) {
          that.canvasContext.fillStyle = '#000000';
          that.canvasContext.fillRect(0, 0, that.canvasDom.width, that.canvasDom.height);
        }
        that.playingTime += 16;
      }, 16);
      that.stopPreviewTimer = setTimeout(() => {
        console.log('预览的播放完成，清理===>>>');
        clearInterval(that.playTimer);
      }, remainderTime);
      // this.draw1();
    },
    // 暂停
    stop() {
      clearInterval(this.playTimer);
      console.log('暂停时间====>>>', this.playingTime);
      this.mediaDoms.forEach((item) => {
        if (item.tagName == 'VIDEO' || item.tagName == 'AUDIO') {
          item.pause();
        }
      });
      this.mediaTimer.forEach((item) => {
        clearInterval(item);
      });
      this.mediaTimer = [];
      clearTimeout(this.stopPreviewTimer);
    },
    // 渲染视频的
    draw1(videoDom) {
      videoDom.play();
      let timer = setInterval(() => {
        if (videoDom.ended) {
          clearInterval(timer);
          console.log('视频播放完成===>>', videoDom.duration);
          videoDom.pause();
        }
        if (videoDom.videoWidth < videoDom.videoHeight) {
          // fill 垂直
          // 根据视频宽高比例，调整canvas中的宽高
          let wRatio = (this.canvasDom.height / videoDom.videoHeight) * videoDom.videoWidth;
          // 左右留白后的位置
          let canvasX = this.canvasDom.width / 2 - wRatio / 2;
          //绘制视频
          this.canvasContext.drawImage(videoDom, canvasX, 0, wRatio, this.canvasDom.height);
        } else {
          // fill 水平
          let hRatio = (this.canvasDom.width / videoDom.videoWidth) * videoDom.videoHeight;
          let canvasY = this.canvasDom.height / 2 - hRatio / 2;
          this.canvasContext.drawImage(videoDom, 0, canvasY, this.canvasDom.width, hRatio);
        }
        this.testEffects(videoDom);
      }, 16);
      this.mediaTimer.push(timer);
      console.log('this.mediaTimer===>>>', this.mediaTimer);
    },
    /**
     * 转场效果
     */
    testEffects(dom) {
      MoEffects.animate(document.getElementsByClassName('preview-wrap')[0], dom, {
        // width: this.previewParam.width,
        // height: this.previewParam.height,
        width: this.canvasDom.width,
        height: this.canvasDom.height,
        duration: 500,
        easing: 'Wheel'
      });
      setTimeout(() => {
        if (document.getElementsByTagName('figure')) document.getElementsByTagName('figure')[0].style.display = 'none';
      }, 1000);
    }
  },
  mounted() {
    this.canvasDom = document.getElementById('myCanvas');
    this.canvasContext = this.canvasDom.getContext('2d');
    // 默认绘制全黑
    this.canvasContext.fillRect(0, 0, this.canvasDom.width, this.canvasDom.height);
    // this.videoDom.width = window.innerWidth * 2; //获取屏幕宽度作为canvas的宽度  这个设置的越大，画面越清晰（相当于绘制的图像大，然后被css缩小）
    // this.videoDom.height = window.innerHeight * 2;
    // this.draw1();

    let that = this;
    that.$nextTick(() => {
      that.mediaDoms = document.querySelectorAll('.media-dom');
      that.mediaDoms.forEach((item, index) => {
        item.oncanplay = function () {
          that.disabledBtn = false;
          that.demoList[index].duration = item.duration * 1000;
        };
      });
    });
  }
};
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  height: 500px;
  overflow: hidden;
  border: 1px solid;
}

.preview-wrap {
  position: relative;
  width: 1280px;
  height: 720px;
  left: 50%;
  transform-origin: 0 0;
  // margin: 0 auto;
}

.media-list-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .media {
    margin-right: 8px;
  }
}

#myCanvas {
  position: absolute;
  left: 0;
}
</style>
