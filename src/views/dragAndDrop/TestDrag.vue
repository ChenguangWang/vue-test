<template>
  <div class="main">
    <div class="container-list">
      <div class="item-container">
        <draggable
          v-for="item in videoContainerList"
          :key="item.value"
          :data="item.value"
          @dragstart="onSourceDragStart"
          @dragsend="onSourceDragEnd"
        >
          <div class="drag-item">{{ item.name }}</div>
        </draggable>
      </div>
      <div class="item-container">
        <draggable
          v-for="item in audioContainerList"
          :key="item.value"
          :data="item.value"
          @dragstart="onSourceDragStart"
          @dragsend="onSourceDragEnd"
        >
          <div class="drag-item">{{ item.name }}</div>
        </draggable>
      </div>
    </div>

    <div class="content">
      <div class="track-list">
        <div class="track-item" v-for="(item, index) in trackList" :key="index">每条容器轨道</div>
      </div>
      <droppable
        class="drop-area"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
        @drop="onDrop"
        @dragenter="onDragEnter"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
      >
        <div v-show="showTrakTip" class="track-pane-tip">这里是底部工具预览，用于新增容器轨道</div>
      </droppable>
    </div>
  </div>
</template>

<script>
import Draggable from '@/components/dnd/draggable'; // form后面的地址根据实际情况而定// form后面的地址根据实际情况而定
import Droppable from '@/components/dnd/droppable'; // form后面的地址根据实际情况而定
import Const from './const';

export default {
  components: {
    Draggable,
    Droppable
  },
  data() {
    return {
      showTrakTip: false, // 展示轨道提示
      trackList: [], // 轨道列表
      videoContainerList: [
        {
          name: '混剪视频',
          value: 'hunjian'
        },
        {
          name: '独立视频',
          value: 'duli'
        }
      ],
      audioContainerList: [
        {
          name: 'AI语音',
          value: 'ai'
        },
        {
          name: 'BGM',
          value: 'bgm'
        }
      ]
    };
  },

  methods: {
    createTrackDrop(element) {
      const that = this;
      /* eslint-disable */
      new Drop(element, {
        onDragStart(params) {
          console.log('11监听到拖动开始');
        },
        onDragEnter(params) {
          console.log('11监听到被拖元素进入');
        },
        onDragOver(params) {
          console.log('11监听到被拖动元素在自己上方移动');
          console.log('11这个函数会被连续调用');
        },
        onDragLeave(params) {
          console.log('11监听被拖动元素离开');
        },
        onDrop(params) {
          console.log('11监听到被拖动元素在自己上方放下');
          that.onDrop(params, 'hadTrack');
        },
        onDragEnd(params) {
          console.log('11监听到拖动结束');
        }
      });
    },

    onSourceDragStart(params) {
      console.log('被拖动元素监听到拖动开始', params);
      this.showTrakTip = true;
    },

    onSourceDragEnd(params) {
      console.log('被拖动元素监听到拖动结束');
    },

    onDragStart(params, type) {
      console.log('监听到拖动开始', type);
    },
    onDragEnd(params, type) {
      console.log('监听到拖动结束', type);
      this.showTrakTip = false;
    },
    onDrop(params, type) {
      console.log('监听到被拖动元素放下', params, type);
      params.methods.removeDragedNode('fade');
      let container = Const.containerMap[params.data];

      // 创建轨道盒子
      let trackDom = document.createElement('div');
      trackDom.setAttribute('class', 'track-wrap');

      let containerDom = document.createElement('div');
      containerDom.setAttribute('class', 'container-wrap');
      containerDom.innerHTML = container['materialType'] || '没有配置const';
      trackDom.insertAdjacentElement('beforeend', containerDom);
      // let newNode = params.sourceNode.cloneNode(true);
      params.el.insertAdjacentElement('afterbegin', trackDom);
    },
    onDragEnter(params, type) {
      console.log('监听到被拖动元素进入当前范围', type);
    },
    onDragOver(params, type) {
      // console.log('监听到被拖动元素在上方移动, 这个调用调多次就不打印了')
    },
    onDragLeave(params, type) {
      console.log('监听到被拖动元素离开当前范围', type);
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  text-align: -webkit-auto;
  padding: 24px;
}
.container-list {
  display: flex;
  justify-content: flex-start;
  .item-container {
    width: 200px;
    height: 200px;
    border: 1px solid;
    margin-right: 10px;
  }
}

.content {
  margin-top: 16px;
  width: 100%;
  min-height: 300px;
  border: 1px solid;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.drop-area {
  flex: 1 1;
  min-height: 100px;
}

.content {
  .track-pane-tip {
    height: 50px;
    width: 100%;
    background: #eef3fe;
    border-radius: 4px;
  }
  /deep/ .track-wrap {
    display: inline-block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border: 1px dashed greenyellow;
    margin: 8px 0;
  }
  /deep/ .container-wrap {
    display: inline-block;
    width: 200px;
    height: 30px;
    border: 1px solid blue;
    margin: 4px 0;
  }
}

.drag-item {
  background: rgba(34, 133, 240, 0.2);
  display: inline-block;
  margin: 10px;
  padding: 5px 10px;
  box-sizing: border-box;
}
</style>
