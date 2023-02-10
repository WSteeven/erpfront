import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificacionStore = defineStore('notificacion', () => {
  // State
  const $q = ref()

  // Actions
  function setQuasar($instancia) {
    $q.value = $instancia
  }

  return {
    // State
    $q,
    // Actions
    setQuasar,
  }
})
