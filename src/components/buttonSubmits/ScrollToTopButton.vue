<template>
  <q-btn v-if="showButton" @click="scrollToTop" class="scroll-to-top-button">
    <q-icon name="bi-arrow-up-short"></q-icon>
  </q-btn>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'

export default defineComponent({
  setup() {
    const showButton = ref(false)

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }

    const handleScroll = () => {
      showButton.value = window.scrollY > 100 // Cambia el valor según el desplazamiento deseado
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      scrollToTop,
      showButton,
    }
  },
})
</script>

<style lang="scss" scoped>
.scroll-to-top-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  background-color: $primary;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 9999;
}
</style>
