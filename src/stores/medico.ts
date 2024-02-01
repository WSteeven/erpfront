import { Examen } from 'pages/medico/examenes/domain/Examen'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useMedicoStore = defineStore('medico', () => {
  const empleado = ref()
  const examen: Ref<Examen | undefined> = ref()
  const examenesSolicitados: Ref<Examen[] | undefined> = ref()
  const idRegistroEmpleadoExamen = ref()

  return {
    examen,
    empleado,
    examenesSolicitados,
    idRegistroEmpleadoExamen,
  }
})
