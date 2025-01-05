import { Endpoint } from 'shared/http/domain/Endpoint'

export const vehiculos = {
  combustibles: new Endpoint('vehiculos/combustibles'),
  garajes: new Endpoint('vehiculos/garajes'),
  vehiculos: new Endpoint('vehiculos/vehiculos'),
  tipos_vehiculos: new Endpoint('vehiculos/tipos-vehiculos'),
  bitacoras_vehiculos: new Endpoint('vehiculos/bitacoras-vehiculos'),
  ultima_bitacora: new Endpoint('vehiculos/ultima-bitacora'),
  registros_incidentes: new Endpoint('vehiculos/registros-incidentes'),
  historial_vehiculos: new Endpoint('vehiculos/historial'),
  empleados_choferes: new Endpoint('vehiculos/empleados-choferes'),
  conductores: new Endpoint('vehiculos/conductores'),
  matriculas: new Endpoint('vehiculos/matriculas'),
  ordenes_reparaciones: new Endpoint('vehiculos/ordenes-reparaciones'),
  asignaciones_vehiculos: new Endpoint('vehiculos/asignaciones-vehiculos'),
  transferencias_vehiculos: new Endpoint('vehiculos/transferencias-vehiculos'),
  multas_conductores: new Endpoint('vehiculos/multas'),
  seguros: new Endpoint('vehiculos/seguros'),
  servicios: new Endpoint('vehiculos/servicios'),
  tanqueos: new Endpoint('vehiculos/tanqueos'),
  planes_mantenimientos: new Endpoint('vehiculos/planes-mantenimientos'),
  mantenimientos_vehiculos: new Endpoint('vehiculos/mantenimientos-vehiculos'),
  reporte_conductor_licencia: new Endpoint('vehiculos/reporte-conductor-licencia'),
  reporte_combustibles: new Endpoint('vehiculos/reporte-combustibles'),
  reporte_seguros_vehiculos: new Endpoint('vehiculos/reporte-seguros-vehiculos'),

}
