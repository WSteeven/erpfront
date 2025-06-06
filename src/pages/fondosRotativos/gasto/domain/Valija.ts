import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Valija extends EntidadAuditable {
  gasto:string|number|null
  empleado_id:number|null
  empleado:string|null
  departamento:string|number|null
  descripcion:string|number|null
  destinatario:string|number|null
  imagen_evidencia:string|number|null

  constructor() {
    super()
    this.gasto = null
    this.empleado_id = null
    this.empleado = null
    this.departamento = null
    this.descripcion = null
    this.destinatario = null
    this.imagen_evidencia = null
  }
}
