import { ExamenSolicitado } from 'pages/medico/solicitudesExamenes/domain/ExamenSolicitado'
import { SolicitudExamen } from 'pages/medico/solicitudesExamenes/domain/SolicitudExamen'
import { acciones } from 'config/utils'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useMedicoStore = defineStore('medico', () => {
  const empleado = ref()
  const examenSolicitado: Ref<ExamenSolicitado | undefined> = ref()
  const solicitudExamen: Ref<SolicitudExamen | undefined> = ref()
  const examenesSolicitados: Ref<ExamenSolicitado[] | undefined> = ref()
  const idRegistroEmpleadoExamen = ref()
  const idCita = ref()
  const accion: typeof acciones[keyof typeof acciones] = acciones.nuevo as typeof acciones[keyof typeof acciones]

  return {
    examenSolicitado,
    empleado,
    examenesSolicitados,
    solicitudExamen,
    accion,
    idRegistroEmpleadoExamen,
    idCita,
  }
})
