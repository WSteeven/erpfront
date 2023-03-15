import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class EgresoAsignadoColaborador extends EntidadAuditable{
  usuario: number|null
  fecha_inicio: number|null
  fecha_fin: number|null

  constructor(){
    super()
    this.usuario = null
    this.fecha_inicio=null
    this.fecha_fin=null
  }
}
