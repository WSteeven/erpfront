import { ExamenSolicitado } from 'pages/medico/solicitudesExamenes/domain/ExamenSolicitado'
import { SolicitudExamen } from 'pages/medico/solicitudesExamenes/domain/SolicitudExamen'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { acciones } from 'config/utils'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { EsquemaVacuna } from 'pages/medico/gestionarPacientes/modules/esquemaVacunacion/domain/EsquemaVacuna'

export const useMedicoStore = defineStore('medico', () => {
  const empleado: Ref<Empleado | undefined> = ref()
  const examenSolicitado: Ref<ExamenSolicitado | undefined> = ref()
  const solicitudExamen: Ref<SolicitudExamen | undefined> = ref()
  const examenesSolicitados: Ref<ExamenSolicitado[] | undefined> = ref()
  const idRegistroEmpleadoExamen: Ref<number | undefined> = ref()
  const idCita: Ref<number | null> = ref(null)
  const accion: typeof acciones[keyof typeof acciones] = acciones.nuevo as typeof acciones[keyof typeof acciones]
  const tipoCitaMedica: Ref<string | undefined> = ref()
  const esquemaVacuna: Ref<EsquemaVacuna | undefined> = ref()
  const tiposVacunasYaRealizadosPaciente: Ref<number[]> = ref([])
  // Fichas
  const idFichaAptitud: Ref<number | undefined> = ref()
  const idFichaPeriodicaPreocupacional: Ref<number | undefined> = ref()
  const idFichaRetiro: Ref<number | undefined> = ref()

  return {
    examenSolicitado,
    empleado,
    examenesSolicitados,
    solicitudExamen,
    accion,
    idRegistroEmpleadoExamen,
    idCita,
    tipoCitaMedica,
    esquemaVacuna,
    tiposVacunasYaRealizadosPaciente,
    // Fichas
    idFichaAptitud,
    idFichaPeriodicaPreocupacional,
    idFichaRetiro,
  }
})
