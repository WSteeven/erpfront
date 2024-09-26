import { RouteRecordRaw } from 'vue-router'

const rutasTickets: RouteRecordRaw[] = [
  {
    path: '/departamentos',
    name: 'departamentos',
    component: () =>
      import('recursosHumanos/departamentos/view/DepartamentoPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard-tickets',
    name: 'dashboard_tickets',
    component: () =>
      import('dashboardTickets/view/DashboardTicketsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/tickets',
    name: 'tickets',
    component: () => import('tickets/view/TicketPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/tickets-asignados',
    name: 'tickets_asignados',
    component: () => import('ticketsAsignados/view/TicketAsignadoPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/categorias-tipos-tickets',
    name: 'categorias_tipos_tickets',
    component: () =>
      import('categoriasTiposTickets/view/CategoriaTipoTicketPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/tipos-tickets',
    name: 'tipos_tickets',
    component: () => import('tiposTickets/view/TipoTicketPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/motivos-pausas-tickets',
    name: 'motivos_pausas_tickets',
    component: () =>
      import('motivosPausasTickets/view/MotivoPausaTicketPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/motivos-cancelados-tickets',
    name: 'motivos_cancelados_tickets',
    component: () =>
      import('motivosCanceladosTickets/view/MotivoCanceladoTicketPage.vue'),
    meta: { requiresAuth: true },
  },
]

export default rutasTickets
