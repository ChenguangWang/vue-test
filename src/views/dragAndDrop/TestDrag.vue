<template>
  <div class="main">
    <div class="container-list">
      <div class="item-container">
        <draggable
          v-for="item in videoContainerList"
          :key="item.value.name"
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
          :key="item.value.name"
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
        <droppable
          class="track-item"
          :class="{ 'track-tip': dragContainerType == track.containerType }"
          v-for="(track, index) in trackList"
          :key="index"
          @dragenter="onTrackDragEnter($event, track)"
          @drop="onTrackDrop($event, track)"
        >
          <vue-draggable-resizable
            v-for="(item, index) in track.materialData"
            :key="index"
            class="track-drag"
            class-name-active="track-drag-active"
            class-name-handle="track-handle-class"
            :w="item.trackWidth"
            :h="40"
            :x="item.trackX"
            :parent="true"
            :debug="false"
            :handles="['ml', 'mr']"
            :isConflictCheck="true"
            :snap="true"
            :snapTolerance="10"
            :onResize="onResizeCallback"
            @dragstop="onContainerDrag"
            @resizestop="onResizeEnd"
            @activated="activatedSelect(item)"
          >
            {{ item.name }}
            <div slot="mr">|</div>
            <div slot="ml">|</div>
          </vue-draggable-resizable>
        </droppable>
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
        <div v-show="showTrakTip" class="track-pane-tip"></div>
      </droppable>
    </div>
  </div>
</template>

<script>
import Draggable from '@/components/dnd/draggable'; // form后面的地址根据实际情况而定// form后面的地址根据实际情况而定
import Droppable from '@/components/dnd/droppable'; // form后面的地址根据实际情况而定
import Const from './const';
import cloneDeep from 'lodash/cloneDeep';

// 拖拽组件
import VueDraggableResizable from 'vue-draggable-resizable-gorkys';
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css';

export default {
  components: {
    Draggable,
    Droppable,
    VueDraggableResizable
  },
  data() {
    return {
      showTrakTip: false, // 展示轨道提示
      dragContainerType: undefined, // 拖动的容器类型
      activatedContainer: undefined, // 选中的容器
      trackList: [], // 轨道列表
      videoContainerList: [
        {
          name: '混剪视频',
          value: {
            name: 'hunjian',
            type: 'video'
          }
        },
        {
          name: '独立视频',
          value: {
            name: 'duli',
            type: 'video'
          }
        }
      ],
      audioContainerList: [
        {
          name: 'AI语音',
          value: {
            name: 'ai',
            type: 'audio'
          }
        },
        {
          name: 'BGM',
          value: {
            name: 'bgm',
            type: 'audio'
          }
        }
      ]
    };
  },

  methods: {
    /**
     * 容器拖动大小 实时触发
     * The function receives the handle and the next values of x, y, width and height.
     * If false is returned by any handler, the action will cancel.
     */
    onResizeCallback(handle, x, y, w) {
      return true;
    },

    /**
     * 容器元素拖拽事件
     */
    onContainerDrag(x, y) {
      console.log('容器元素拖拽事件', x, y);
    },
    /**
     * 容器改变长度
     */
    onResizeEnd(x, y, w) {
      console.log('容器改变长度', x, y, w, this.activatedContainer);
      this.activatedContainer.trackWidth = w;
    },
    /**
     * 容器item选中触发
     */
    activatedSelect(item) {
      this.activatedContainer = item;
    },

    onSourceDragStart(params) {
      console.log('被拖动元素监听到拖动开始', params);
      this.showTrakTip = true;
      this.dragContainerType = params.data.type;
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
      this.dragContainerType = undefined;
    },
    // 拖动容器到底部
    onDrop(params, type) {
      console.log('监听到被拖动元素放下', params, type);
      params.methods.removeDragedNode('fade');
      let container = cloneDeep(Const.containerMap[params.data.name]);
      // 容器元素
      container.materialData.push({
        name: params.data.name,
        trackWidth: 100,
        trackX: 0
      });
      // 先创建轨道，再添加元素
      this.trackList.push(container);
    },
    // 拖动容器到轨道
    onTrackDrop(params, track) {
      console.log('轨道监听到被拖动元素放下', params);
      // 轨道类型和拖拽的容器类型一致
      if (track.containerType == params.data.type) {
        params.methods.removeDragedNode('fade');
        let trackX = 0;
        track.materialData.forEach((element) => {
          trackX += element.trackWidth;
        });
        const len = track.materialData.length;
        track.materialData.push({
          name: params.data.name,
          trackWidth: 100,
          trackX
        });
      } else {
        params.methods.removeDragedNode('back');
      }
    },
    onDragEnter(params, type) {
      console.log('监听到被拖动元素进入当前范围', type);
    },
    // 拖动容器到轨道范围
    onTrackDragEnter(params, track) {
      console.log('轨道监听到被拖动元素进入当前范围', params, track);
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
  .drop-area {
    flex: 1 1;
    min-height: 100px;
  }
}

.track-item {
  height: 40px;
  line-height: 40px;
  border: 1px dashed greenyellow;
  margin: 8px 0;
  &.track-tip {
    background: #eef3fe;
  }
}

.content {
  .track-pane-tip {
    height: 50px;
    width: 100%;
    background: #eef3fe;
    border-radius: 4px;
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

.track-drag {
  border-radius: 4px;
  padding: 0 10px;
  border: 1px solid #dee0e6 !important;
  background: #fff;
  .dot-dot {
    display: inline-block;
    line-height: 32px;
    width: 100%;
    padding: 0 12px;
    color: #fff;
    &.video-track {
      color: #808695;
    }
  }
  .img-track {
    height: 100%;
    border-radius: 4px;
    overflow: hidden;
    text-align: center;
  }
}

.track-drag-active {
  border-color: #0300ff !important;
  box-shadow: 0px 1px 3px 0px rgba(3, 0, 255, 0.6);
}
/deep/ .track-handle-class {
  position: absolute;
  color: #fff;
  background-color: #0300ff;
  border: 1px solid #0300ff;
  height: 14px !important;
  -webkit-transition: all 300ms linear;
  -ms-transition: all 300ms linear;
  transition: all 300ms linear;
  top: 0 !important;
  height: 38px !important;
  line-height: 40px;
  text-align: center;
  &-ml {
    left: 0px !important;
    cursor: w-resize;
  }

  &-mr {
    right: 0px !important;
    cursor: e-resize;
  }
}
</style>
