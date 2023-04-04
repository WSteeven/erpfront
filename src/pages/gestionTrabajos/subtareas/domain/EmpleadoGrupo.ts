import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'

export class EmpleadoGrupo extends Empleado {
  es_responsable: boolean | number

  constructor() {
    super()

    this.es_responsable = false
  }
}
