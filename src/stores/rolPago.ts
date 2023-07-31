import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRolPagoStore = defineStore('rolpago', () => {
  const idRolPagoMes = ref()
  const idRolPagoSeleccionada = ref()
  const posicionRolPagoSeleccionada = ref()
  const idEmpleado = ref()
  const tareaTieneRolPagos = ref()
  const motivoSuspendido = ref()
  const accion = ref()
  const sueldo = ref()
  const dias = ref()
  const concepto_ingreso = ref()
  const salario = ref()
  const descuento_ley_info = ref()
  const concepto_ingreso_info = ref()
  const descuento_general_info = ref()
  const multa_info = ref()
  const descuento_general = ref()
  const descuento_ley = ref()
  const multa = ref()
  const decimo_tercero = ref
  const decimo_cuarto = ref()
  const total_ingreso = ref()
  const total_egreso = ref()
  const bonificacion = ref()
  const bono_recurente = ref()
  const ingreso = ref()
  const egreso = ref()
  const horas_extra_tipo = ref()
  const horas_extra_subtipo = ref()
  const total = ref()
  const ingresos = ref()
  const egresos = ref()
  const roles = ref()
  const dias_permiso_sin_recuperar = ref()
  const estado = ref()

  return {
    idRolPagoMes,
    idRolPagoSeleccionada,
    tareaTieneRolPagos,
    idEmpleado,
    motivoSuspendido,
    posicionRolPagoSeleccionada,
    accion,
    sueldo,
    dias,
    concepto_ingreso,
    salario,
    descuento_ley_info,
    concepto_ingreso_info,
    descuento_general_info,
    multa_info,
    descuento_general,
    descuento_ley,
    multa,
    decimo_tercero,
    decimo_cuarto,
    total_ingreso,
    total_egreso,
    bonificacion,
    bono_recurente,
    ingreso,
    egreso,
    horas_extra_tipo,
    horas_extra_subtipo,
    total,
    ingresos,
    egresos,
    roles,
    dias_permiso_sin_recuperar,
    estado,
  }
})
