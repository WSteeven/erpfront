import { DetalleExamen } from 'pages/medico/gestionarPacientes/domain/DetalleExamen'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useMedicoStore = defineStore('medico', () => {
  const empleado = ref()
  const detalleExamen: Ref<DetalleExamen | undefined> = ref()

  return {
    detalleExamen,
    empleado,
  }
})
