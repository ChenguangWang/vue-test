<template>
  <div>
    <Split ref="mySplit" class="split-wrap" direction="vertical" :gutterSize="5" :snapOffset="10">
      <SplitArea :size="33" :minSize="50"> panel left </SplitArea>
      <SplitArea :size="33" :minSize="50"> panel center </SplitArea>
      <SplitArea :size="33" :minSize="50"> panel right </SplitArea>
    </Split>
    <Button @click="getSize">GetSize</Button>
  </div>
</template>

<script>
import { Split, SplitArea } from 'vue-split-panel';

export default {
  name: 'TestSplitPanel',
  components: { Split, SplitArea },
  methods: {
    getSize() {
      console.log('getSize====>>', this.$refs.mySplit.getSizes());
    }
  }
};
</script>

<style lang="less" scoped>
.split-wrap {
  height: 500px;
  width: 300px;
  margin: 50px auto;
  border: 1px solid;
  border-radius: 4px;
}
</style>
