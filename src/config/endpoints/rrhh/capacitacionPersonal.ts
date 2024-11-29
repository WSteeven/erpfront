import { Endpoint } from 'shared/http/domain/Endpoint'

export const capacitacionPersonal = {
  dashboard_capacitacion_personal: new Endpoint(
    'capacitacion/dahboard-capacitacion-personal'
  ),
  formularios: new Endpoint('capacitacion/formularios'),
}
