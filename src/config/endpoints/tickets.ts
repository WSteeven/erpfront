import { Endpoint } from 'shared/http/domain/Endpoint'

export const tickets = {
  dashboard_tickets: new Endpoint('tickets/dashboard'),
  tickets: new Endpoint('tickets/tickets'),
  tipos_tickets: new Endpoint('tickets/tipos-tickets'),
  categorias_tipos_tickets: new Endpoint('tickets/categorias-tipos-tickets'),
  archivos_tickets: new Endpoint('tickets/archivos-tickets'),
  archivos_seguimientos_tickets: new Endpoint(
    'tickets/archivos-seguimientos-tickets'
  ),
  motivos_pausas_tickets: new Endpoint('tickets/motivos-pausas-tickets'),
  motivos_cancelados_tickets: new Endpoint(
    'tickets/motivos-cancelados-tickets'
  ),
  cambiar_responsable_ticket: new Endpoint(
    'tickets/tickets/cambiar-responsable'
  ),
  actividades_realizadas_seguimientos_tickets: new Endpoint(
    'tickets/actividades-realizadas-seguimientos-tickets'
  ),
  pausas_tickets: new Endpoint('tickets/tickets/obtener-pausas'),
  rechazos_tickets: new Endpoint('tickets/tickets/obtener-rechazados'),
  linea_tiempo_tickets: new Endpoint('tickets/linea-tiempo'),
  comentarios_tickets: new Endpoint('tickets/comentarios-tickets'),
}
