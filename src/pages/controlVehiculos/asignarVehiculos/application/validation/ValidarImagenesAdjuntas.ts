import { Validador } from 'shared/validadores/domain/Validador'
import { AsignacionVehiculo } from '../../domain/AsignacionVehiculo'

export class ValidarImagenesAdjuntas implements Validador {
  private refArchivo
  private asignacion: AsignacionVehiculo
  constructor(refArchivo, asignacion: AsignacionVehiculo) {
    this.refArchivo = refArchivo
    this.asignacion = asignacion
  }
  async validar(): Promise<boolean> {
    // console.log(this.refArchivo.value)
    if (
      this.asignacion.estado == 'ACEPTADO' ||
      this.asignacion.estado == 'PENDIENTE'
    )
      if (
        this.refArchivo.value.cantElementos +
          this.refArchivo.value.listadoArchivos.length <
        6
      )
        throw new Error(
          'Debe ingresar al menos 6 fotografías o archivos adjuntos del vehículo que se va a asignar'
        )
    // console.log(this.refArchivo.value)
    return true
  }
}
