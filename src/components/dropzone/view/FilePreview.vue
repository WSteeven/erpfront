<template>
  <component :is="tag" class="file-preview">
    <button
      @click="$emit('remove', file)"
      class="close-icon"
      aria-label="Remove"
    >
      ×
    </button>
    <!-- <img :src="file.url" :alt="file.file.name" :title="file.file.name" /> -->
    <small>{{ file.file.name }}</small>
    <span
      class="status-indicator loading-indicator"
      v-show="file.status == 'loading'"
      ><div class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Loading...</span>
      </div></span
    >
    <span
      class="status-indicator success-indicator"
      v-show="file.status == true"
      ><i class="bi-check"></i
    ></span>
    <span
      class="status-indicator failure-indicator"
      v-show="file.status == false"
      >Error</span
    >
  </component>
</template>

<script lang="ts" setup>
defineProps({
  file: { type: Object, required: true },
  tag: { type: String, default: 'li' },
})
defineEmits(['remove'])
</script>

<style lang="scss" scoped>
.file-preview {
  width: 22%;
  margin: 10px;
  position: relative;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 4px 6px;
  .close-icon,
  .status-indicator {
    --size: 20px;
    position: absolute;
    line-height: var(--size);
    height: var(--size);
    border-radius: var(--size);
    box-shadow: 0 0 5px currentColor;
    right: 0.25rem;
    appearance: none;
    border: 0;
    padding: 0;
  }
  .close-icon {
    width: var(--size);
    font-size: var(--size);
    background: #d23326;
    color: #fff;
    cursor: pointer;
  }
  .status-indicator {
    font-size: calc(0.75 * var(--size));
    padding: 3px;
  }
  .loading-indicator {
    background: rgb(0, 174, 249);
    color: #000;
  }
  .success-indicator {
    background: #6c6;
    color: #040;
  }
  .failure-indicator {
    background: #933;
    color: #fff;
  }
}
@keyframes pulse {
  0% {
    background: #fff;
  }
  50% {
    background: #ddd;
  }
  100% {
    background: #fff;
  }
}
</style>
