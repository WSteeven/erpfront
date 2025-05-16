import { DetalleVacacion } from 'recursosHumanos/vacaciones/modules/detallesVacaciones/domain/DetalleVacacion'

export interface DetalleVacacionPropsInterface{
  vacacion_id: number,
  accion:string,
  dias_disponibles:number,
  entidad: DetalleVacacion|null,
}
