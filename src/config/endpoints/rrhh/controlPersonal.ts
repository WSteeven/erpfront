import { Endpoint } from 'shared/http/domain/Endpoint'

/**
 * Control de personal
 */
export const controlPersonal = {
  sincronizar_asistencias: new Endpoint('control-personal/sincronizar-asistencias'),
  sincronizar_atrasos: new Endpoint('control-personal/sincronizar-atrasos'),
  asistencias: new Endpoint('control-personal/asistencias'),
  horarioLaboral: new Endpoint('control-personal/horarios-laborales'),
  horarioDeAlmuerzo: new Endpoint('control-personal/horario-almuerzo'),
  atrasos: new Endpoint('control-personal/atrasos'),
}
