import { Endpoint } from 'shared/http/domain/Endpoint'

export const trabajoSocial = {
  imprimir_fichas_socioeconomicas: new Endpoint('trabajo-social/fichas-socioeconomicas/imprimir/'),
  imprimir_formulario_evaluacion_riesgos: new Endpoint('trabajo-social/evaluacion-riesgos/imprimir/'),
  fichas_socioeconomicas: new Endpoint('trabajo-social/fichas-socioeconomicas'),
  imprimir_visitas_domiciliarias: new Endpoint('trabajo-social/visitas-domiciliarias/imprimir/'),
  visitas_domiciliarias: new Endpoint('trabajo-social/visitas-domiciliarias'),
  empleado_tiene_ficha_socioeconomica: new Endpoint('trabajo-social/empleado-tiene-ficha-socioeconomica'),
  empleado_tiene_visita_domiciliaria: new Endpoint('trabajo-social/empleado-tiene-visita-domiciliaria'),
  ultima_ficha_socioeconomica_empleado: new Endpoint('trabajo-social/ultima-ficha-socioeconomica'),
  ultima_visita_domiciliaria_empleado: new Endpoint('trabajo-social/ultima-visita-domiciliaria'),
}
