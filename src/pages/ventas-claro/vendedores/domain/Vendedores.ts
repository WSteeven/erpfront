import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class Vendedores extends EntidadAuditable {
  id: number | null;
  empleado:number | null
  empleado_id: number | null
  empleado_info: string | null
  modalidad:number | null
  modalidad_id: number | null
  modalidad_info: string | null
  tipo_vendedor: string | null
  jefe_inmediato: number | null
  jefe_inmediato_info : string | null

  constructor() {
    super()
    this.id = null
    this.empleado = null
    this.empleado_id = null
    this.empleado_info = null
    this.modalidad = null
    this.modalidad_id =null
    this.modalidad_info = null
    this.tipo_vendedor = null
    this.jefe_inmediato = null
    this.jefe_inmediato_info = null
  }
}
