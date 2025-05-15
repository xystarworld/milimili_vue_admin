<template>
  <div>
    <div ref="container" class="artplayer-container flex"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Artplayer from 'artplayer'

const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
  }
})

const container = ref(null)
let instance = null

onMounted(() => {
  instance = new Artplayer({
    ...props.option,
    container: container.value
  })

  // 修复拖动进度条后从头播放的问题
  // 只需确保不在外部每次option变化时重建实例即可
  // 若有自定义seek事件处理，需如下设置
  instance.on('seek', (time) => {
    if (instance && instance.video) {
      instance.video.currentTime = time
    }
  })
})

onBeforeUnmount(() => {
  if (instance?.destroy) {
    instance.destroy(false)
  }
})
</script>

<style scoped>
.artplayer-container {
  width: 100%;
  height: 0s;
  padding-bottom: 56.25%; /* 16:9 比例 */
  position: relative;
}

.artplayer-container > :deep(div) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 75%;
}
</style>