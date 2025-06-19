import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class CertificacionEmpleado extends EntidadAuditable {
  empleado: string | null
  certificaciones: number[]

  constructor() {
    super()
    this.empleado = null
    this.certificaciones = []
  }
}
