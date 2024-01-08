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


export const estadosRolPagoEmpleado = {
  todo: '',
  creado: 'CREADO',
  ejecutando: 'EJECUTANDO',
  realizado: 'REALIZADO',
  finalizado: 'FINALIZADO',

}