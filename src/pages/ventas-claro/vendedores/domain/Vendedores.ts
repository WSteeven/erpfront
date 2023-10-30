import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Vendedores extends EntidadAuditable {
  id: number | null;
  codigo_vendedor: string | null
  empleado:number | null
  empleado_id: number | null
  empleado_info: string | null
  modalidad:number | null
  modalidad_id: number | null
  modalidad_info: string | null

  constructor() {
    super()
    this.id = null
    this.codigo_vendedor = null
    this.empleado = null
    this.empleado_id = null
    this.empleado_info = null
    this.modalidad = null
    this.modalidad_id =null
    this.modalidad_info = null
  }
}
