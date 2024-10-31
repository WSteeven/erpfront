import { DetalleVacacion } from 'recursosHumanos/vacaciones/modules/detallesVacaciones/domain/DetalleVacacion'

export interface DetalleVacacionPropsInterface{
  vacacion_id: number,
  accion:string,
  entidad: DetalleVacacion|null,
}
