import { Endpoint } from 'shared/http/domain/Endpoint'

export const activosFijos = {
  egresos_activos_fijos: new Endpoint('activos-fijos/egresos'),
  ingresos_activos_fijos: new Endpoint('activos-fijos/ingresos'),
}
