<template>
  <div
    ref="virtualGrid"
    :style="{
      boxSizing: 'border-box',
      height: `${layoutData.totalHeight}px`,
      paddingTop: `${
        renderData !== null && renderData.firstRenderedRowOffset !== null
          ? renderData.firstRenderedRowOffset + 'px'
          : '0px'
      }`
    }"
  >
    <div
      class="grid"
      :style="{
        display: '-ms-grid',
        display: 'grid',
        'align-items': 'center',
        'grid-template-columns': `repeat(${configData.columnCount}, 1fr)`,
        gap: `${configData.gridGap}px`
      }"
    >
      <div
        v-for="item in renderData.cellsToRender"
        :key="item.id"
        :style="{
          height: `${item.height}px`,
          'grid-column-start': item.columnNumber,
          'grid-column-end': item.columnNumber + item.columnSpan,
          'grid-row-start': getGridRowStart(item, renderData)
        }"
      >
        <component :is="item.renderComponent" :item="item" v-on="$listeners" />
      </div>
    </div>
    <component :is="loadingBatch && loader" />
  </div>
</template>

<script>
import {
  getGridGapDefault,
  getColumnCountDefault,
  getWindowMarginDefault,
  getItemRatioHeightDefault,
  debugLog
} from './utils';

export default {
  name: 'VirtualGrid',
  props: {
    items: {
      required: true
    },
    updateFunction: {
      default: true
    },
    getGridGap: {
      default: () => getGridGapDefault
    },
    getColumnCount: {
      default: () => getColumnCountDefault
    },
    getWindowMargin: {
      default: () => getWindowMarginDefault
    },
    getItemRatioHeight: {
      default: () => getItemRatioHeightDefault
    },
    updateTriggerMargin: {
      type: Number,
      default: 500
    },
    loader: {
      default: null
    },
    debug: {
      default: false
    }
  },
  data() {
    return {
      updateLock: false,
      bottomReached: false,
      ref: null,
      containerData: {
        windowSize: { height: 0, width: 0 },
        windowScroll: { x: 0, y: 0 },
        elementWindowOffset: 0,
        elementSize: { height: 0, width: 0 }
      }
    };
  },
  computed: {
    loadingBatch() {
      return this.loader && this.updateLock;
    },
    configData() {
      return this.computeConfigData(this.containerData, this.items);
    },
    layoutData() {
      return this.computeLayoutData(this.configData);
    },
    renderData() {
      return this.computeRenderData(this.configData, this.containerData, this.layoutData);
    }
  },
  methods: {
    resize() {
      this.loadMoreData();
    },

    scroll() {
      this.loadMoreData();
    },

    initiliazeGrid() {
      this.computeContainerData();
      this.$nextTick(async () => {
        this.loadMoreData();
      });
    },

    loadMoreData() {
      this.loadMoreDataAsync()
        .catch((error) => {
          if (error) {
            console.error('Fail to load next data batch', error);
          }
        })
        .then();
    },

    async loadMoreDataAsync() {
      this.computeContainerData();

      const windowTop = this.containerData.windowScroll.y;
      const windowBottom = windowTop + this.containerData.windowSize.height;
      const bottomTrigger = Math.max(
        0,
        this.containerData.elementWindowOffset + this.containerData.elementSize.height - this.updateTriggerMargin
      );

      if (!this.bottomReached && windowBottom >= bottomTrigger && !this.updateLock) {
        this.updateLock = true;

        debugLog(this.debug, 'Loading next batch');
        const isLastBatch = await this.updateFunction();

        if (isLastBatch) {
          debugLog(this.debug, 'Bottom reached');
          this.bottomReached = true;
        }

        this.updateLock = false;
        await this.loadMoreDataAsync();
      }
    },

    computeContainerData() {
      if (this.ref === null) {
        return;
      }

      const windowSize = this.getWindowSize();
      const windowScroll = this.getWindowScroll();
      const elementWindowOffset = this.getElementOffset(this.ref);
      const elementSize = this.getElementSize(this.ref);

      this.containerData = { windowSize, windowScroll, elementWindowOffset, elementSize };
    },

    computeConfigData(containerData, items) {
      if (containerData === null || items === null) {
        return {
          windowMargin: 0,
          gridGap: 0,
          columnCount: 1,
          entries: []
        };
      }

      const elementWidth = containerData.elementSize ? containerData.elementSize.width : 0;

      const windowMargin = this.getWindowMargin(containerData.windowSize.height);

      const gridGap = this.getGridGap(elementWidth, containerData.windowSize.height);

      const columnCount = this.getColumnCount(elementWidth);

      const columnWidth = this.getColumnWidth(columnCount, gridGap, elementWidth);

      const entries = items.map((item) => {
        // if width is not set we leave the height untouched
        if (!item.width) {
          return item;
        }

        // we make sure the width takes the full column space and adjust the height based on ratio
        const imageWidth = columnWidth * item.columnSpan + gridGap * (item.columnSpan - 1);
        return {
          ...item,
          height: this.getItemRatioHeight(item.height, item.width, imageWidth),
          width: imageWidth
        };
      });

      return {
        windowMargin,
        gridGap,
        columnCount,
        entries
      };
    },

    computeLayoutData(configData) {
      if (configData === null) {
        return { cells: [], totalHeight: 0 };
      }

      let currentRowNumber = 1;
      let prevRowsTotalHeight = 0;
      let currentRowMaxHeight = 0;

      let columnShift = 0;

      const cells = configData.entries.map((entry, index) => {
        const { columnCount, gridGap } = configData;

        let columnSpanRecompute = entry.columnSpan;
        let heightRecompute = entry.height;

        // if the column span is 0 or negative we assume it is full width
        if (columnSpanRecompute < 1) {
          columnSpanRecompute = columnCount;
        }

        const distanceToRowStart = (index + columnShift) % columnCount;
        if (entry.newRow && distanceToRowStart !== 0) {
          columnShift += columnCount - distanceToRowStart;
        }

        const shiftedIndex = index + columnShift;
        const columnNumber = (shiftedIndex % columnCount) + 1;
        const rowNumber = Math.floor(shiftedIndex / columnCount) + 1;

        // here we check that an image is not going out of the grid, if yes we resize it
        if (columnNumber + columnSpanRecompute > columnCount + 1) {
          const overlapNumber = columnNumber + columnSpanRecompute - columnCount - 1;
          const overlapRatio = overlapNumber / columnSpanRecompute;
          heightRecompute = heightRecompute * (1 - overlapRatio);

          columnSpanRecompute -= overlapNumber;
        }

        // we need to count the shift created by multiple column objects
        if (columnSpanRecompute > 1) {
          columnShift += columnSpanRecompute - 1;
        }

        if (rowNumber !== currentRowNumber) {
          currentRowNumber = rowNumber;
          prevRowsTotalHeight += currentRowMaxHeight + gridGap;
          currentRowMaxHeight = 0;
        }

        const offset = prevRowsTotalHeight;
        const height = Math.round(heightRecompute);

        currentRowMaxHeight = Math.max(currentRowMaxHeight, height);

        return { ...entry, columnNumber, rowNumber, offset, height, columnSpan: columnSpanRecompute };
      });

      const totalHeight = prevRowsTotalHeight + currentRowMaxHeight;

      return { cells, totalHeight };
    },

    computeRenderData(configData, containerData, layoutData) {
      if (layoutData === null || configData === null) {
        return { cellsToRender: [], firstRenderedRowNumber: 0, firstRenderedRowOffset: 0 };
      }
      const cellsToRender = [];
      let firstRenderedRowNumber = null;
      let firstRenderedRowOffset = null;

      if (containerData.elementWindowOffset !== null) {
        const elementWindowOffset = containerData.elementWindowOffset;

        for (const cell of layoutData.cells) {
          const cellTop = elementWindowOffset + cell.offset;
          const cellBottom = cellTop + cell.height;

          const windowTop = containerData.windowScroll.y;
          const windowBottom = windowTop + containerData.windowSize.height;

          const renderTop = windowTop - configData.windowMargin;
          const renderBottom = windowBottom + configData.windowMargin;

          if (cellTop > renderBottom) {
            continue;
          }
          if (cellBottom < renderTop) {
            continue;
          }

          if (firstRenderedRowNumber === null) {
            firstRenderedRowNumber = cell.rowNumber;
          }

          if (cell.rowNumber === firstRenderedRowNumber) {
            firstRenderedRowOffset = firstRenderedRowOffset
              ? Math.min(firstRenderedRowOffset, cell.offset)
              : cell.offset;
          }

          cellsToRender.push(cell);
        }
      }

      return { cellsToRender, firstRenderedRowNumber, firstRenderedRowOffset };
    },

    /** Grid utils */

    getColumnWidth(columnCount, gridGap, elementWidth) {
      if (columnCount === null || gridGap === null || elementWidth === null) {
        return 0;
      }

      const totalGapSpace = (columnCount - 1) * gridGap;
      const columnWidth = Math.round((elementWidth - totalGapSpace) / columnCount);

      return columnWidth;
    },

    getGridRowStart(cell, renderData) {
      if (renderData === null) {
        return undefined;
      }

      const offset = renderData.firstRenderedRowNumber !== null ? renderData.firstRenderedRowNumber - 1 : 0;
      const gridRowStart = cell.rowNumber - offset;

      return `${gridRowStart}`;
    },

    /** For Parent Component */

    resetGrid() {
      this.bottomReached = false;
      this.loadMoreData();
    },

    /** Utils */

    isSameElementSize(a, b) {
      return a.width === b.width && a.height === b.height;
    },

    getWindowSize() {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    },

    getElementSize(element) {
      const rect = element.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height
      };
    },

    isSameElementScroll(a, b) {
      return a.x === b.x && a.y === b.y;
    },

    getWindowScroll() {
      return {
        x: window.scrollX,
        y: window.scrollY
      };
    },

    getElementOffset(element) {
      return window.scrollY + element.getBoundingClientRect().top;
    }
  },
  mounted() {
    this.ref = this.$refs.virtualGrid;
    this.initiliazeGrid();
    window.addEventListener('resize', this.resize);
    window.addEventListener('scroll', this.scroll);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('scroll', this.scroll);
  }
};
</script>
