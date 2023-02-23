import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'

export class EmpleadoSeleccionado extends Empleado {
  responsable: boolean

  constructor() {
    super()
    this.responsable = false
  }
}
