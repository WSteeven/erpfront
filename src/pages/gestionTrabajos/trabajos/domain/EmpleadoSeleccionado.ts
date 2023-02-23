import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'

export class EmpleadoSeleccionado extends Empleado {
  es_responsable: boolean

  constructor() {
    super()
    this.es_responsable = false
  }
}
