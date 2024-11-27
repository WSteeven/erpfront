import { Endpoint } from 'shared/http/domain/Endpoint'

export const sso = {
  incidentes: new Endpoint('sso/incidentes'),
  inspecciones: new Endpoint('sso/inspecciones'),
}
