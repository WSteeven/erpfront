import { Endpoint } from 'shared/http/domain/Endpoint'

export const trabajoSocial = {
  fichas_socioeconomicas: new Endpoint('trabajo-social/fichas-socioeconomicas'),
  visitas_domiciliarias: new Endpoint('trabajo-social/visitas-domiciliarias'),
  empleado_tiene_ficha_socioeconomica: new Endpoint('trabajo-social/empleado-tiene-ficha-socioeconomica'),
  ultima_ficha_socioeconomica_empleado: new Endpoint('trabajo-social/ultima-ficha-socioeconomica'),
}
