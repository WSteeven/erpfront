import { Endpoint } from 'shared/http/domain/Endpoint'

/**
 * Control de personal
 */
export const controlPersonal = {
  sincronizar_marcaciones: new Endpoint('control-personal/sincronizar-marcaciones'),
  sincronizar_atrasos: new Endpoint('control-personal/sincronizar-atrasos'),
  marcaciones: new Endpoint('control-personal/marcaciones'),
  horarioLaboral: new Endpoint('control-personal/horarios-laborales'),
  horarioDeAlmuerzo: new Endpoint('control-personal/horario-almuerzo'),
  atrasos: new Endpoint('control-personal/atrasos'),
  dashboard_control_personal: new Endpoint('control-personal/dashboard'),
}
