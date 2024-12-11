import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class VisitaDomiciliaria extends EntidadAuditable{
  empleado:string|null
  composicion_familiar:any


  constructor() {
    super()
    this.empleado = []
    this.composicion_familiar = []
  }
}
