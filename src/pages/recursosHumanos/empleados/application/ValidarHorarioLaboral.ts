import { Validador } from 'shared/validadores/domain/Validador'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { acciones } from 'config/utils'

type AccionType = typeof acciones.nuevo | typeof acciones.editar

export class ValidarHorarioLaboral implements Validador {
  private empleado: Empleado
  private readonly accion: AccionType

  constructor(empleado: Empleado, accion: AccionType){
    this.empleado = empleado
    this.accion = accion
  }

  async validar(): Promise<boolean> {
    if (
      [acciones.nuevo, acciones.editar].includes(this.accion) &&
      !this.empleado.tiene_horario_laboral
    )
      throw new Error(
        'El empleado debe tener un horario laboral asignado, por favor asignarle un horario antes de continuar.'
      )
    return true
  }
}
