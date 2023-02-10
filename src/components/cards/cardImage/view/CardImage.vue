<template>
  <div class="card h-100" @click="clickEvent">
    <div
      class="card-custom-header"
      :style="{
        backgroundImage:
          'linear-gradient(to bottom, rgba(255, 255, 255, 0) 4%, rgba(0, 0, 0, 0.15) 300%), url(' +
          card_image_url +
          ')',
      }"
    >
      <span class="bg-white text-texto fw-bold px-4 py-1 nombre-empresa">
        {{ card_title }}
      </span>
    </div>
    <div class="card-body text-center bg-white">
      <p class="card-text">{{ card_subtitle }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'CardImage',
  props: {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  },
  emits: ['clickEvent'],
  setup(props, { emit }) {
    const clickEvent = () => {
      emit('clickEvent')
    }
    return {
      card_image_url: computed(() => props.imageUrl),
      card_title: computed(() => props.title),
      card_subtitle: computed(() => props.subtitle),
      clickEvent,
    }
  },
})
</script>

<style lang="scss" scoped>
.card-custom-header {
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background-size: contain;
  background-position: center;

  .nombre-empresa {
    border-radius: 14px 14px 0 0;
    box-shadow: 10px 10px 60px 2px rgb(44, 44, 44, 0.2);

    &::active {
      border: none;
    }
  }
}
</style>
