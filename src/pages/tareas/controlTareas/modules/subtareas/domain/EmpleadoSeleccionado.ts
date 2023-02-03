import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'

export class EmpleadoSeleccionado extends Empleado {
  principal: boolean

  constructor() {
    super()
    this.principal = false
  }
}
