import { TabOption } from "components/tables/domain/TabOption";

export const tabOptionsEstadosRolPagoEmpleado: TabOption[] = [
  { label: 'Todo', value: '' },
  { label: 'Creado', value: 'CREADO' },
  { label: 'Ejecutando', value: 'EJECUTANDO' },
  { label: 'Realizado', value: 'REALIZADO' },
  { label: 'Finalizado', value: 'FINALIZADO' },
]

export const tabOptionsEstadosRolPago: TabOption[] = [
  // { label: 'Todo', value: '' },
  { label: 'Activas', value: '0' },
  { label: 'Finalizadas', value: '1' },
];
export const tabOptionsEstadosAlimentacion: TabOption[] = [
  { label: 'Activas', value: '0' },
  { label: 'Finalizadas', value: '1' },
];


export const estadosRolPagoEmpleado = {
  todo: '',
  creado: 'CREADO',
  ejecutando: 'EJECUTANDO',
  realizado: 'REALIZADO',
  finalizado: 'FINALIZADO',

}
export const estadosAlimentacion = {
  activa: '0',
  finalizado: '1',
}
export const parentezcos = [
  { nombre: 'CÓNYUGE', value: 'CÓNYUGE'  },
  { nombre: 'HIJO', value: 'HIJO' },
  { nombre: 'HIJA', value: 'HIJA' },
]

export const autoidentificaciones_etnicas = [
  { nombre: 'INDIGENA', value: 'INDIGENA'  },
  { nombre: 'AFRODECENDIENTE/AFROECUATORIANO', value: 'AFRODECENDIENTE' },
  { nombre: 'MESTIZO', value: 'MESTIZO' },
  { nombre: 'BLANCO', value: 'BLANCO' },
  { nombre: 'MONTUBIO', value: 'MONTUBIO' },
]
