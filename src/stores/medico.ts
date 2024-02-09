import { ExamenSolicitado } from 'pages/medico/gestionarPacientes/modules/solicitudExamen/domain/ExamenSolicitado'
import { Examen } from 'pages/medico/examenes/domain/Examen'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useMedicoStore = defineStore('medico', () => {
  const empleado = ref()
  const examenSolicitado: Ref<ExamenSolicitado | undefined> = ref()
  const examenesSolicitados: Ref<Examen[] | undefined> = ref()
  const idRegistroEmpleadoExamen = ref()

  return {
    examenSolicitado,
    empleado,
    examenesSolicitados,
    idRegistroEmpleadoExamen,
  }
})
