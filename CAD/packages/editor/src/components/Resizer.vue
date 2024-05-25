<template>
  <span ref="target" class="resizer">
    <slot></slot>
  </span>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import Gesto from 'gesto';

const emit = defineEmits(['change']);

const target = ref<HTMLSpanElement>();

let getso: Gesto;

onMounted(() => {
  if (!target.value) return;
  getso = new Gesto(target.value, {
    container: window,
    pinchOutside: true,
  }).on('drag', (e) => {
    if (!target.value) return;

    emit('change', e.deltaX);
  });
});

onUnmounted(() => {
  getso?.unset();
});
</script>

<style lang="scss">
.resizer {
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  width: 1px;
  margin: 0px;
  height: 100%;
  opacity: 0.9;
  box-sizing: border-box;
  cursor: col-resize;
  z-index: 1;
}
</style>
