<template>
  <div class="toastification">
    <div class="d-flex align-items-start">
      <div
        class="me-3 flex-shrink-0 rounded-circle px-2 py-1"
        :class="`bg-${variant}`"
      >
        <div :class="icon" class="text-white" />
      </div>
      <div class="d-flex flex-grow-1 mt-1">
        <div>
          <h5
            v-if="title"
            :class="`text-${variant}`"
            class="font-weight-bold toastification-title"
            v-text="title"
          />
          <small v-if="text" class="d-inline-block text-body" v-html="text" />
        </div>
        <span
          class="cursor-pointer toastification-close-icon ms-auto"
          @click="$emit('close-toast')"
        >
          <div v-if="!hideClose" class="text-body bi bi-x-lg" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    variant: {
      type: String,
      default: "primary",
    },
    icon: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      default: null,
    },
    hideClose: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.toastification-title {
  color: inherit;
  font-size: 16px;
  font-weight: bold;
  font-family: "Montserrat", Helvetica, Arial, serif;
}

.text-body {
  font-size: 12px;
  font-family: "Montserrat", Helvetica, Arial, serif;
}
</style>
