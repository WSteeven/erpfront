import { Endpoint } from 'shared/http/domain/Endpoint'

export const activosFijos = {
  entregas_activos_fijos: new Endpoint('activos-fijos/entregas'),
  ingresos_activos_fijos: new Endpoint('activos-fijos/ingresos'),
  activos_fijos: new Endpoint('activos-fijos/activos-fijos'),
}
