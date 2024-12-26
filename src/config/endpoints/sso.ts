import { Endpoint } from 'shared/http/domain/Endpoint'

export const sso = {
  incidentes: new Endpoint('sso/incidentes'),
  seguimientos_incidentes: new Endpoint('sso/seguimientos-incidentes'),
  inspecciones: new Endpoint('sso/inspecciones'),
  solicitudes_descuentos: new Endpoint('sso/solicitudes-descuentos'),
  accidentes: new Endpoint('sso/accidentes'),
  seguimientos_accidentes: new Endpoint('sso/seguimientos-accidentes'),
  certificaciones: new Endpoint('sso/certificaciones'),
  certificaciones_empleados: new Endpoint('sso/certificaciones-empleados'),
}
