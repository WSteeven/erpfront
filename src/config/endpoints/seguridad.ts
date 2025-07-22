import { Endpoint } from 'shared/http/domain/Endpoint'

export const seguridad = {
  actividades_bitacoras: new Endpoint('seguridad/actividades-bitacoras'),
  bitacoras: new Endpoint('seguridad/bitacoras'),
  visitantes: new Endpoint('seguridad/visitantes'),
  zonas: new Endpoint('seguridad/zonas'),
  miembros_zonas: new Endpoint('seguridad/miembros-zonas'),
  prendas_zonas: new Endpoint('seguridad/prendas-zonas'),
  prendas_zonas_existe: new Endpoint('seguridad/prendas-zonas-existe'),
  prendas_zonas_permitidas: new Endpoint('seguridad/prendas-zonas-permitidas'),
  restricciones_prendas_zonas: new Endpoint('seguridad/restricciones-prendas-zonas'),
  restricciones_prendas_zonas_datos: new Endpoint('seguridad/restricciones-prendas-zonas-datos'),
  tipos_eventos_bitacoras: new Endpoint('seguridad/tipos-eventos-bitacoras'),
}
