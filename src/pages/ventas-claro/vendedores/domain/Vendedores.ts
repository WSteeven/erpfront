import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Vendedores extends EntidadAuditable {
  codigo_vendedor: string | null
  empleado:number | null
  empleado_info: string | null
  modalidad:number | null
  modalidad_info: string | null

  constructor() {
    super()
    this.codigo_vendedor = null
    this.empleado = null
    this.empleado_info = null
    this.modalidad = null
    this.modalidad_info = null
  }
}
